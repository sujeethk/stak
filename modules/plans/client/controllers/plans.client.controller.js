(function () {
  'use strict';

  // Plans controller
  angular
    .module('plans')
    .controller('PlansController', PlansController);

  PlansController.$inject = ['$scope', '$state', 'Authentication', 'planResolve'];

  function PlansController ($scope, $state, Authentication, plan) {
    var vm = this;

    vm.authentication = Authentication;
    vm.plan = plan;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Plan
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.plan.$remove($state.go('plans.list'));
      }
    }

    // Save Plan
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.planForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.plan._id) {
        vm.plan.$update(successCallback, errorCallback);
      } else {
        vm.plan.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('plans.view', {
          planId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
