var kc2json = (function () {
  'use strict';

  var lang = {
    'br': {
      'highlight': 'destaque',
      'note': 'nota',
      'bookmark': 'marcador',
      'page': 'página',
      'position': 'posição'
    },
    'es': {
      'highlight': 'subrayado',
      'note': 'nota',
      'bookmark': 'marcador',
      'page': 'página',
      'position': 'posición'
    },
    'en': {
      'highlight': 'highlight',
      'note': 'note',
      'bookmark': 'bookmark',
      'page': 'page',
      'position': 'position'
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

  function getTypeInDocumentLang (lang, fileLang) {
    return {
      'highlight': lang[fileLang]['highlight'],
      'note': lang[fileLang]['note'],
      'bookmark': lang[fileLang]['bookmark']
    };
  }

  function getStringPage (lang, fileLang) {
    return lang[fileLang]['page'];
  }

  function getStringPosition (lang, fileLang) {
    return lang[fileLang]['position'];
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
        return type;
      }
    }
  }

  function getInfoFromClipping (parameters) {
    var typesInDocumentLang = parameters['typesInDocumentLang'];
    var clipping = parameters['clipping'];
    var stringPage = parameters['stringPage'];
    var stringPosition = parameters['stringPosition'];
    var text = getText(clipping);
    var pageNumber = getPage(clipping);
    var page = pageNumber ? stringPage + ' ' + pageNumber : pageNumber;
    var position = stringPosition + ' ' + getPosition(clipping);
    var date = getDate(clipping);
    var type = getType(typesInDocumentLang, clipping);
    var object = {type, text, page, position, date};
    object['type'] === 'bookmark' ? delete object['text'] : null;
    !object['page'] ? delete object['page'] : null;
    return object;
  }

  function parseClipping (parameters) {
    var clippings = parameters['clippings'];
    var typesInDocumentLang = parameters['typesInDocumentLang'];
    var stringPage = parameters['stringPage'];
    var stringPosition = parameters['stringPosition'];
    var parsedClippings = {'books': {}};
    for (var index in clippings) {
      var clipping = clippings[index];
      var info = getInfoFromClipping({
        'typesInDocumentLang': typesInDocumentLang,
        'clipping': clipping,
        'stringPage': stringPage,
        'stringPosition': stringPosition,
      });
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
    var typesInDocumentLang = getTypeInDocumentLang(lang, fileLang);
    var stringPage = getStringPage(lang, fileLang);
    var stringPosition = getStringPosition(lang, fileLang);
    var parsedClippings = parseClipping({
      'clippings': clippings,
      'typesInDocumentLang': typesInDocumentLang,
      'stringPage': stringPage,
      'stringPosition': stringPosition,
    });
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