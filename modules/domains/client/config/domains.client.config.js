(function () {
  'use strict';

  angular
    .module('domains')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Domains',
      state: 'domains.list'
    });

  }
})();
