'use strict';

app.dragDrop = (function () {
  var fileContent = '';
  var body = document.body;

  function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  function handleDragDrop (event) {
    event.preventDefault();
    event.stopPropagation();
    var file = event.dataTransfer.files[0];
    if (file.type !== 'text/plain') {
      fileContent = file.type;
      return;
    }
    var fileReader = new FileReader();
    fileReader.onload = function () {
      fileContent = fileReader.result;
    };
    fileReader.readAsText(file);
  }

  function getFileContent () {
    return fileContent;
  }

  function clearFileContent () {
    fileContent = '';
  }

  (function enableDragDrop () {
    body.addEventListener('dragover', handleDragOver, false);
    body.addEventListener('drop', handleDragDrop, false);
  })();

  return {
    'getFileContent': getFileContent,
    'clearFileContent': clearFileContent
  };
})();