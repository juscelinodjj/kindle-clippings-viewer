(function (render, kc2json) {
  'use strict';

  function handleInputFile (event) {
    var inputFile = event.target;
    var fileReader = new FileReader();
    fileReader.onload = function () {
      render.run(kc2json.run(fileReader.result));
      inputFile.value = '';
    };
    fileReader.readAsText(inputFile.files[0]);
  }

  (function enableInputFile () {
    var buttonUpload = document.querySelector('.button-upload');
    var buttonUploadMobile = document.querySelector('.button-upload-mobile');
    var inputFile = document.querySelector('.input-file');
    buttonUpload.addEventListener('click', function () {
      inputFile.click();
    });
    buttonUploadMobile.addEventListener('click', function () {
      inputFile.click();
    });
    inputFile.addEventListener('change', handleInputFile);
  })();
})(render, kc2json);