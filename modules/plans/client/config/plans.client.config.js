(function () {
  'use strict';

  angular
    .module('plans')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Plans',
      state: 'plans',
      type: 'dropdown',
      roles: ['user'],
      position: 1
    });

    Menus.addMenuItem('topbar', {
      title: 'Dashboard',
      state: 'home',
      type: '',
      roles: ['*'],
      position: 0
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'plans', {
      title: 'List Plans',
      state: 'plans.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'plans', {
      title: 'Create Plan',
      state: 'plans.create',
      roles: ['user']
    });
  }
})();
