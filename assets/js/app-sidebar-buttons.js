var sidebarButtons = (function () {
  'use strict';

  function hideSidebar () {
    var buttonMenuMobile = document.querySelector('.button-menu-mobile');
    var isVisible = buttonMenuMobile.offsetLeft > 0;
    if (isVisible) {
      buttonMenuMobile.click();
    }
  }

  function addEventListener (fn) {
    var buttons = document.querySelectorAll('.sidebar-container > .button');
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      button.addEventListener('click', fn);
    }
  }

  function active (fn) {
    addEventListener(fn);
    addEventListener(hideSidebar);
  }

  return {'active': active};
})();