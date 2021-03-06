(function () {
  'use strict';

  angular
    .module('domains')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    // Add apps menu under admin since unable to add from apps folder
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Apps',
      state: 'apps.list'
    });
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Domains',
      state: 'domains.list'
    });

  }
})();
