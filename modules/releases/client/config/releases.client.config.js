(function () {
  'use strict';

  angular
    .module('releases')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Releases',
      state: 'releases.list'
    });

  }
})();
