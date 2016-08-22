(function () {
  'use strict';

  angular
    .module('teams')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Teams',
      state: 'teams',
      type: 'dropdown',
      roles: ['user'],
      position: 2
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'teams', {
      title: 'List Teams',
      state: 'teams.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'teams', {
      title: 'Create Team',
      state: 'teams.create',
      roles: ['user']
    });
  }
})();
