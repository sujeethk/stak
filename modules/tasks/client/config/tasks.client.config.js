(function () {
  'use strict';

  angular
    .module('tasks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Tasks',
      state: 'tasks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tasks', {
      title: 'List Tasks',
      state: 'tasks.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tasks', {
      title: 'Create Task',
      state: 'tasks.create',
      roles: ['user']
    });
  }
})();
