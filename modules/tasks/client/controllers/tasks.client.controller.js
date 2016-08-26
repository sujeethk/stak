(function () {
  'use strict';

  // Tasks controller
  angular
    .module('tasks')
    .controller('TasksController', TasksController);

  TasksController.$inject = ['$scope', '$stateParams', '$state', 'Authentication', 'taskResolve', 'toasty', 'Userslist', 'TeamsService'];

  function TasksController ($scope, $stateParams, $state, Authentication, task, toasty, Userslist, TeamsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.task = task;
    var lastbestknown = task.toJSON();
    vm.options = {};
    vm.options.type = ['Milestone', 'Stack', 'Task'];
    vm.options.category = ['Deploy', 'Routing', 'Certiifcation', 'Infrastructure'];
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.cancelform = cancelform;
    vm.save = save;
    vm.userslist = Userslist.query();

    vm.teamslist = TeamsService.query();
    // Remove existing Task
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.task.$remove(successCallback, errorCallback);
      }
      function successCallback(res) {
        $state.go('plans.view', {
          planId: (res.parent._id ? res.parent._id : res.parent)
        });
        toasty.success({
          title: 'Delete successful!',
          msg: vm.task.name + ' has been deleted!',
          theme: 'bootstrap'
        });
      }
      function errorCallback(res) {
        vm.error = res.data.message;
        toasty.error({
          title: 'Delete error!',
          msg: vm.error,
          theme: 'bootstrap',
          shake: true
        });
      }
    }

    function cancelform() {
      $state.go('plans.view', {'planId': $stateParams.planId});
    }

    // Save Task
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taskForm');
        return false;
      }
      vm.task.parent = { _id: $stateParams.planId };
      vm.task.lastModified = Date.now();
      vm.task.lastbestknown = lastbestknown;
      // TODO: move create/update logic to service
      if (vm.task._id) {
        vm.task.$update(successCallback, errorCallback);
      } else {
        vm.task.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('plans.view', {
          planId: (res.parent._id ? res.parent._id : res.parent)
        });
        toasty.success({
          title: 'Save successful!',
          msg: vm.task.name + ' has been saved!',
          theme: 'bootstrap'
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        toasty.error({
          title: 'Save error!',
          msg: vm.error,
          theme: 'bootstrap',
          shake: true
        });
      }
    }
  }
})();
