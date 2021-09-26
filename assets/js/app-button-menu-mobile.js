(function () {
  'use strict';

  function openMenu (event) {
    var buttonMenuMobile = event.currentTarget;
    var buttonMenuMobileIcon = buttonMenuMobile.querySelector('i');
    buttonMenuMobileIcon.classList.toggle('fa-bars');
    buttonMenuMobileIcon.classList.toggle('fa-times');
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('hide-mobile');
  }

  (function enableButtonMenuMobile () {
    var buttonMenuMobile = document.querySelector('.button-menu-mobile');
    buttonMenuMobile.addEventListener('click', openMenu);
  })();
})();