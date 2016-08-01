(function () {
  'use strict';

  angular
    .module('apps')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Apps',
      state: 'apps.list'
    });

  }
})();
