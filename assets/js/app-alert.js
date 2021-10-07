var appAlert = (function () {
  'use strict';

  function show (string) {
    var alert = document.querySelector('.alert');
    var message = document.querySelector('.alert .message');
    alert.classList.add('show-alert');
    message.textContent = string;
    hide(alert, message);
  }

  function hide (alert, message) {
    setTimeout(function () {
      alert.classList.remove('show-alert');
    }, 2000);
    setTimeout(function () {
      message.textContent = '';
    }, 2500);
  }

  function run (message) {
    show(message);
  }

  return {'run': run};
})();