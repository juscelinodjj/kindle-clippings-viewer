'use strict';

app.sectionClippings = (function () {
  var sectionInfo = document.querySelector('.section-info');
  var sectionContainer = document.querySelector('.section-container');

  function clear () {
    sectionInfo.innerHTML = '';
    sectionContainer.innerHTML = '';
  }

  return {'clear': clear};
})();