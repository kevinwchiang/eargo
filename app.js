$(document).ready(() => {
  const publications = [
    'Popular Science',
    'PC Magazine',
    'TechCrunch',
    'Gizmodo',
    'The Verge',
    'GeekWire',
  ];

  const renderPublications = (res) => {
    const html = res.parse.text['*'];
    const template = $(html);
    template.find('.plainlinks').remove();
    const oldUrl = template.find('img').attr('src');
    const newUrl = `http:${oldUrl}`;
    const oldLink = template.find('a').attr('href');
    const newLink = `https://en.wikipedia.org${oldLink}`;

    template.find('p, .hatnote, .mw-references-wrap').remove();
    template.find('a').attr('href', newLink);
    template.find('img').attr('src', newUrl);
    const logoImg = template.find('img');
    template.find('tr').first().remove();

    $('#content').append(template);
    $('.mw-parser-output').last().append(`<div class='logo-container'>${logoImg[0].outerHTML}</div>`);
    $('tr').has('img').remove();
    $('.logo-container:odd').css('order', 1);
    $('.infobox:odd').css('order', 2);
  };

  const apiCall = () => {
    const url = `https://en.wikipedia.org/w/api.php?format=json&page=${publications[0]}&action=parse&section=0`;
    $.ajax({
      url,
      type: 'GET',
      dataType: 'jsonp',
      contentType: 'application/json; charset=utf-8',
      success(res) {
        publications.shift();
        renderPublications(res);
        if (publications.length) {
          apiCall();
        }
      },
    });
  };

  apiCall();
});
