(function () {
  'use strict';

  angular
    .module('tasks')
    .controller('TasksListController', TasksListController);

  TasksListController.$inject = ['TasksService', '$stateParams'];

  function TasksListController(TasksService, $stateParams) {
    var vm = this;

    vm.tasks = TasksService.query({ planId: $stateParams.planId });
  }
})();
