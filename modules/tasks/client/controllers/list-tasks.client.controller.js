(function () {
  'use strict';

  angular
    .module('tasks')
    .controller('TasksListController', TasksListController);

  TasksListController.$inject = ['TasksService'];

  function TasksListController(TasksService) {
    var vm = this;

    vm.tasks = TasksService.query();
  }
})();
