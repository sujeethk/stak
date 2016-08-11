(function () {
  'use strict';

  // Releases controller
  angular
    .module('releases')
    .controller('ReleasesController', ReleasesController);

  ReleasesController.$inject = ['$scope', '$state', '$timeout', 'Authentication', 'releaseResolve'];

  function ReleasesController ($scope, $state, $timeout, Authentication, release) {
    var vm = this;

    vm.authentication = Authentication;
    vm.release = release;
    vm.error = null;
    vm.form = {};
    vm.cal = {};
    vm.remove = remove;
    vm.cancelform = cancelform;
    vm.save = save;

    $scope.dateformat = 'MMM dd, yyyy';

    // Remove existing Release
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.release.$remove($state.go('releases.list'));
      }
    }

    // Cancel and go back to list
    function cancelform() {
      $state.go('releases.list');
    }
    
    // Save Release
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.releaseForm');
        return false;
      }
      if(vm.release.start > vm.release.end){
        vm.error = 'Start date cannot be greater than end date';
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.release._id) {
        vm.release.$update(successCallback, errorCallback);
      } else {
        vm.release.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('releases.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
