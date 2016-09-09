(function () {
  'use strict';

  // Releases controller
  angular
    .module('releases')
    .controller('ReleasesController', ReleasesController);

  ReleasesController.$inject = ['$scope', '$state', '$timeout', 'Authentication', 'releaseResolve', 'toasty'];

  function ReleasesController ($scope, $state, $timeout, Authentication, release, toasty) {
    var vm = this;

    vm.authentication = Authentication;
    vm.release = release;
    vm.release.start = new Date(vm.release.start);
    vm.release.end = new Date(vm.release.end);
    vm.error = null;
    vm.form = {};
    vm.cal = {};
    vm.remove = remove;
    vm.cancelform = cancelform;
    vm.save = save;

    vm.dateformat = 'MMM dd, yyyy';

    // Remove existing Release
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.release.$remove(function (){
          $state.go('releases.list');
          toasty.success({
            title: 'Deleted!',
            msg: vm.release.name + ' has been deleted!',
            theme: 'bootstrap'
          });
        });
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
        toasty.success({
          title: 'Save successful!',
          msg: vm.release.name + ' has been saved!',
          theme: 'bootstrap'
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        toasty.error({
          title: 'Save Error!',
          msg: vm.error,
          theme: 'bootstrap'
        });
      }
    }
  }
})();
