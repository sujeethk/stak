(function () {
  'use strict';

  // Domains controller
  angular
    .module('domains')
    .controller('DomainsController', DomainsController);

  DomainsController.$inject = ['$scope', '$http','$state', 'Authentication', 'domainResolve', 'Userslist'];

  function DomainsController ($scope, $http, $state, Authentication, domain, Userslist) {
    var vm = this;

    vm.authentication = Authentication;
    vm.domain = domain;
    //Support new form for ngMaterial by creating empty array
    vm.domain.manager = (vm.domain.manager === undefined ? [] : vm.domain.manager);
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.cancelform = cancelform;
    vm.save = save;

    vm.userslist = Userslist.query();
    vm.querySearch = querySearch;

    function querySearch (criteria) {
      return vm.userslist.filter(createFilterFor(criteria));
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(contact) {
        var lowercaseName = angular.lowercase(contact.displayName);
        return (lowercaseName.indexOf(lowercaseQuery) !== -1);
      };

    }

    // Remove existing Domain
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.domain.$remove($state.go('domains.list'));
      }
    }

    //Cancel and go to list view
    function cancelform() {
      $state.go('domains.list');
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
        $state.go('domains.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
