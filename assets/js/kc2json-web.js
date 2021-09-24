var kc2json = (function () {
  'use strict';

  var lang = {
    'br': {
      'highlight': 'destaque',
      'note': 'nota',
      'bookmark': 'marcador'
    },
    'es': {
      'highlight': 'subrayado',
      'note': 'nota',
      'bookmark': 'marcador'
    },
    'en': {
      'highlight': 'highlight',
      'note': 'note',
      'bookmark': 'bookmark'
    }
  };

  function validFile (fileContent) {
    return fileContent.indexOf('==========') > -1;
  }

  function parseFileContent (fileContent) {
    var parsedFileContent = [];
    var arrayFileContent = fileContent.split('==========');
    for (var index in arrayFileContent) {
      var clipping = arrayFileContent[index].split('\n')
        .map(function (line) {
          return line.replace(/\r/g, '');
        })
        .filter(function (line) {
          return line;
        });
      if (clipping.length >= 2) {
        parsedFileContent.push(clipping);
      }
    }
    return parsedFileContent;
  }

  function detectLang (lang, clippings) {
    for (var key in lang) {
      var highlight = lang[key]['highlight'];
      for (var index in clippings) {
        var clipping = clippings[index];
        var secondLine = clipping[1].toLowerCase();
        var match = secondLine.indexOf(highlight) > -1;
        if (match) {
          return key;
        }
      }
    }
    return false;
  }

  function removeCharCode65279 (string) {
    return string.split('')
      .filter(function (char) {
        return char.charCodeAt() !== 65279;
      })
      .join('');
  }

  function getTitleAndAuthor (clipping) {
    var firstLine = clipping[0];
    return removeCharCode65279(firstLine).trim();
  }

  function getText (clipping) {
    var lines = clipping;
    return lines.filter(function (value, index) {
      return index > 1;
    }).join('\n');
  }

  function getPage (clipping) {
    var secondLine = clipping[1];
    var noHasPage = secondLine.match(/\|/g).length === 1;
    if (noHasPage) {
      return false;
    }
    var page = secondLine.match(/-\s(.*?)\s\|/)[1];
    var noHasNumber = !page.match(/\d+/);
    if (noHasNumber) {
      return 'NaN';
    }
    return page.match(/\d+/)[0];
  }

  function getPosition (clipping) {
    var secondLine = clipping[1];
    var position = secondLine.match(/\|/g).length === 1
      ? secondLine.match(/-\s(.*?)\s\|/)[1]
      : secondLine.match(/\|\s(.*?)\s\|/)[1];
    return position.match(/[\d-]+/)[0];
  }

  function getDate (clipping) {
    var secondLine = clipping[1];
    var arraySecondLine = secondLine.split('| ');
    return arraySecondLine[arraySecondLine.length - 1];
  }

  function getType (typesInDocumentLang, clipping) {
    var secondLine = clipping[1].toLowerCase();
    for (var key in typesInDocumentLang) {
      var type = typesInDocumentLang[key];
      var match = secondLine.indexOf(type) > -1;
      if (match) {
        return key;
      }
    }
  }

  function getInfoFromClipping (typesInDocumentLang, clipping) {
    var text = getText(clipping);
    var page = getPage(clipping);
    var position = getPosition(clipping);
    var date = getDate(clipping);
    var type = getType(typesInDocumentLang, clipping);
    var object = {type, text, page, position, date};
    object['type'] === 'bookmark' ? delete object['text'] : null;
    !object['page'] ? delete object['page'] : null;
    return object;
  }

  function parseClipping (clippings, typesInDocumentLang) {
    var parsedClippings = {'books': {}};
    for (var index in clippings) {
      var clipping = clippings[index];
      var info = getInfoFromClipping(typesInDocumentLang, clipping);
      var titleAndAuthor = getTitleAndAuthor(clipping);
      var existsKey = parsedClippings['books'][titleAndAuthor];
      if (!existsKey) {
        parsedClippings['books'][titleAndAuthor] = [];
      }
      parsedClippings['books'][titleAndAuthor].push(info);
    }
    return parsedClippings;
  }

  function start (lang, fileLang, clippings) {
    var typesInDocumentLang = lang[fileLang];
    var parsedClippings = parseClipping(clippings, typesInDocumentLang);
    parsedClippings['lang'] = fileLang;
    return JSON.stringify(parsedClippings, null, 2);
  }

  function preStart (fileContent, lang) {
    var isValidFile = validFile(fileContent);
    if (!isValidFile) {
      var response = {
        'error': true,
        'message': 'The specified file is not valid'
      };
      return JSON.stringify(response, null, 2);
    }
    var clippings = parseFileContent(fileContent);
    var fileLang = detectLang(lang, clippings);
    if (!fileLang) {
      var response = {
        'error': true,
        'message': 'The specified file language is not supported'
      };
      return JSON.stringify(response, null, 2);
    }
    return start(lang, fileLang, clippings);
  }

  function run (fileContent) {
    return preStart(fileContent, lang);
  }

  return {'run': run};
})();