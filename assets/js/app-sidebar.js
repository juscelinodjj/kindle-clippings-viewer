'use strict';

app.sidebar = (function () {
  var buttonMenuMobile = document.querySelector('.button-menu-mobile');
  var buttonUploadMobile = document.querySelector('.button-upload-mobile');
  var inputFile = document.querySelector('.input-file');

  function hide () {
    var isVisible = buttonMenuMobile.offsetLeft > 0;
    if (isVisible) {
      buttonMenuMobile.click();
    }
  }

  function enableButtons (fn) {
    var buttons = document.querySelectorAll('.sidebar-container > .button');
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      button.addEventListener('click', fn);
      button.addEventListener('click', hide);
    }
  }

  (function enableButtonUploadMobile () {
    buttonUploadMobile.addEventListener('click', function () {
      inputFile.click();
    });
  })();

  return {'enableButtons': enableButtons};
})();