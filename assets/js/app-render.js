'use strict';

app.render = (function () {
  function parseTitleAndAuthor (titleAndAuthor) {
    var occurrences = titleAndAuthor.match(/(\(.*?\))/g);
    if (!occurrences) {
      return {
        'title': titleAndAuthor,
        'author': ''
      };
    }
    var rawAuthor = occurrences[occurrences.length - 1];
    var author = rawAuthor.replace(/[\(\)]/g, '');
    var title = titleAndAuthor.replace(rawAuthor, '').trim();
    return {
      'title': title,
      'author': author
    };
  }

  function encodeDataClippings (clippings) {
    return JSON.stringify(clippings)
      .split('')
      .map(function (char) {
        return char.charCodeAt(0);
      });
  }

  function getSidebarMarkup (myClippings) {
    var books = myClippings.books;
    var markupSidebar = '';
    for (var titleAndAuthor in books) {
      var parsedTitleAndAuthor = parseTitleAndAuthor(titleAndAuthor);
      var title = parsedTitleAndAuthor.title;
      var author = parsedTitleAndAuthor.author;
      var clippings = encodeDataClippings(books[titleAndAuthor]);
      var markupButton = '<div class="button">'
        + '<span class="span-title">' + title + '</span>'
        + '<span class="span-author">' + author + '</span>'
        + '<span class="span-data" data-clippings="' + clippings + '"></span>'
        + '</div>';
      markupSidebar += markupButton;
    }
    return markupSidebar;
  }

  function getSectionInfoMarkup (title, author) {
    return '<span class="span-book">' + title + '</span>'
      + '<span class="span-author">' + author + '</span>'
  }

  function decodeDataClippings (clippings) {
    var json = clippings.split(',')
      .map(function (char) {
        return String.fromCharCode(char);
      })
      .join('');
    return JSON.parse(json);
  }

  function getClippingsMarkup (clippings) {
    var markupClippings = '';
    for (var index in clippings) {
      var clipping = clippings[index];
      var type = clipping.type;
      var rawText = clipping.text;
      var page = clipping.page;
      var location = clipping.location;
      var date = clipping.date;
      var text = !rawText ? rawText
        : rawText.replace(/[<>]/g, '').replace(/\n/g, '<br>');
      var markupSpanPage = !page ? ''
        : '<span class="span-page">' + page + '</span>';
      var markupSpanText = (type === 'bookmark' || !text) ? ''
        : '<span class="span-text">' + text + '</span>';
      var markupSection = '<div class="section-clipping">'
        + markupSpanText
        + '<div class="footer">'
        + '<div class="left">'
        + '<span class="span-type">' + type + '</span>'
        + markupSpanPage
        + '<span class="span-location">' + location + '</span>'
        + '</div>'
        + '<div class="right">'
        + '<span class="span-date">' + date + '</span>'
        + '</div>'
        + '</div>'
        + '</div>';
      markupClippings += markupSection;
    }
    return markupClippings;
  }

  function sectionClippings (event) {
    var button = event.currentTarget;
    var spanData = button.querySelector('.span-data');
    var title = button.querySelector('.span-title').textContent;
    var author = button.querySelector('.span-author').textContent;
    var encodedDataClippings = spanData.getAttribute('data-clippings');
    var clippings = decodeDataClippings(encodedDataClippings);
    var markupSectionInfo = getSectionInfoMarkup(title, author);
    var markupClippings = getClippingsMarkup(clippings);
    var sectionInfo = document.querySelector('.section-info');
    var sectionContainer = document.querySelector('.section-container');
    sectionContainer.scrollTop = 0;
    sectionInfo.innerHTML = markupSectionInfo;
    sectionContainer.innerHTML = markupClippings;
  }

  function sidebar (myClippings) {
    var markup = getSidebarMarkup(myClippings);
    var sidebarContainer = document.querySelector('.sidebar-container');
    sidebarContainer.scrollTop = 0;
    sidebarContainer.innerHTML = markup;
  }

  return {
    'sidebar': sidebar,
    'sectionClippings': sectionClippings
  };
})();