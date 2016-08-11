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
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.cancelform = cancelform;
    vm.save = save;

    vm.userslist = Userslist.query();
    
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

  angular.module('domains').filter('propsFilter', function() {
    return function(items, props) {
      var out = [];

      if (angular.isArray(items)) {
        var keys = Object.keys(props);
          
        items.forEach(function(item) {
          var itemMatches = false;

          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var text = props[prop].toLowerCase();
            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
          }

          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }

      return out;
    };
  });
})();
