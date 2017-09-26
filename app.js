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

  const apiCall = (publication) => {
    return new Promise((resolve, reject) => {
      const url = `https://en.wikipedia.org/w/api.php?format=json&page=${publication}&action=parse&section=0`;
      $.ajax({
        url,
        type: 'GET',
        dataType: 'jsonp',
        contentType: 'application/json; charset=utf-8',
        success(res) {
          resolve(res);
        },
        error(res) {
          reject(res);
        }
      });
    })
  };
  let promises = publications.map((publication) => {
    return apiCall(publication);
  })
  Promise.all(promises).then((responses) => {
    responses.forEach((response) => {
      renderPublications(response);
    })
  })
});
