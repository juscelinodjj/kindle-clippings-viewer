'use strict';

app.inputFile = (function () {
  var fileContent = '';
  var inputFile = document.querySelector('.input-file');

  function handleInputFile () {
    var fileReader = new FileReader();
    fileReader.onload = function () {
      fileContent = fileReader.result;
      inputFile.value = '';
    };
    fileReader.readAsText(inputFile.files[0]);
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