'use strict';

(function () {
  var buttonMenuMobile = document.querySelector('.button-menu-mobile');
  var buttonMenuMobileIcon = buttonMenuMobile.querySelector('i');
  var sidebar = document.querySelector('.sidebar');
  var buttonUpload = document.querySelector('.button-upload');
  var inputFile = document.querySelector('.input-file');

  function toggleIcon () {
    buttonMenuMobileIcon.classList.toggle('fa-bars');
    buttonMenuMobileIcon.classList.toggle('fa-times');
  }

  function showSidebar () {
    sidebar.classList.toggle('hide-mobile');
  }

  (function enableButtonMenuMobile () {
    buttonMenuMobile.addEventListener('click', toggleIcon);
    buttonMenuMobile.addEventListener('click', showSidebar);
  })();

  (function enableButtonUpload () {
    buttonUpload.addEventListener('click', function () {
      inputFile.click();
    });
  })();
})();