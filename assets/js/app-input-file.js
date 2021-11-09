'use strict';

app.inputFile = (function () {
  var fileContent = '';
  var inputFile = document.querySelector('.input-file');

  function handleInputFile () {
    var file = inputFile.files[0];
    if (file.type !== 'text/plain') {
      fileContent = file.type;
      return;
    }
    var fileReader = new FileReader();
    fileReader.onload = function () {
      fileContent = fileReader.result;
      inputFile.value = '';
    };
    fileReader.readAsText(file);
  }

  function getFileContent () {
    return fileContent;
  }

  function clearFileContent () {
    fileContent = '';
  }

  (function enableInputFile () {
    inputFile.addEventListener('change', handleInputFile);
  })();

  return {
    'getFileContent': getFileContent,
    'clearFileContent': clearFileContent
  };
})();