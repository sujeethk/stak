(function () {
  'use strict';

  // Domains controller
  angular
    .module('domains')
    .controller('DomainsController', DomainsController);

  DomainsController.$inject = ['$scope', '$state', 'Authentication', 'domainResolve'];

  function DomainsController ($scope, $state, Authentication, domain) {
    var vm = this;

    vm.authentication = Authentication;
    vm.domain = domain;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Domain
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.domain.$remove($state.go('domains.list'));
      }
    }

    // Save Domain
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.domainForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.domain._id) {
        vm.domain.$update(successCallback, errorCallback);
      } else {
        vm.domain.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('domains.view', {
          domainId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
