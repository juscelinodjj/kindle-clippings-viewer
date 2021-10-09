'use strict';

app.alert = (function () {
  var alert = document.querySelector('.alert');
  var message = document.querySelector('.alert .message');

  function set (string) {
    message.textContent = string;
  }

  function show () {
    alert.classList.add('show-alert');
  }

  function hide () {
    alert.classList.remove('show-alert');
  }

  function run (string) {
    set(string);
    show();
    setTimeout(function () {
      hide();
      set('');
    }, 2500);
  }

  return function (string) {
    run(string);
  };
})();