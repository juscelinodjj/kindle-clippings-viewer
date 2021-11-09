'use strict';

var app = {
  'kc2json': kc2json,
  'error': false,
  'errorMessage': '',
  alert: undefined,
  sectionClippings: undefined,
  sidebar: undefined,
  inputFile: undefined,
  dragDrop: undefined,
  render: undefined
};

(function () {
  function handleError () {
    app.alert(app.errorMessage);
    app.error = false;
    app.errorMessage = '';
  }

  function renderFileContent (data) {
    app.sectionClippings.clear();
    app.render.sidebar(data);
    app.sidebar.enableButtons(app.render.sectionClippings);
  }

  function handleFileContent () {
    var fileContent = app.inputFile.getFileContent()
      || app.dragDrop.getFileContent();
    app.inputFile.clearFileContent();
    app.dragDrop.clearFileContent();
    if (fileContent) {
      var json = app.kc2json.run(fileContent);
      var data = JSON.parse(json);
      app.error = data.error || false;
      app.errorMessage = data.message || '';
      if (app.error) {
        handleError();
        return;
      }
      renderFileContent(data);
    }
  }

  (function () {
    setInterval(handleFileContent, 1000);
  })();
})();