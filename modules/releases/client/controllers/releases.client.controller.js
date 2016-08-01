(function () {
  'use strict';

  // Releases controller
  angular
    .module('releases')
    .controller('ReleasesController', ReleasesController);

  ReleasesController.$inject = ['$scope', '$state', 'Authentication', 'releaseResolve'];

  function ReleasesController ($scope, $state, Authentication, release) {
    var vm = this;

    vm.authentication = Authentication;
    vm.release = release;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Release
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.release.$remove($state.go('releases.list'));
      }
    }

    // Save Release
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.releaseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.release._id) {
        vm.release.$update(successCallback, errorCallback);
      } else {
        vm.release.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('releases.view', {
          releaseId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
