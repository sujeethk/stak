(function () {
  'use strict';

  // Apps controller
  angular
    .module('apps')
    .controller('AppsController', AppsController);

  AppsController.$inject = ['$scope', '$state', 'Authentication', 'appResolve'];

  function AppsController ($scope, $state, Authentication, app) {
    var vm = this;

    vm.authentication = Authentication;
    vm.app = app;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing App
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.app.$remove($state.go('apps.list'));
      }
    }

    // Save App
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.appForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.app._id) {
        vm.app.$update(successCallback, errorCallback);
      } else {
        vm.app.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('apps.view', {
          appId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
