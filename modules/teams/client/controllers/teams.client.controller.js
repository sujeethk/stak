(function () {
  'use strict';

  // Teams controller
  angular
    .module('teams')
    .controller('TeamsController', TeamsController);

  TeamsController.$inject = ['$scope', '$state', 'Authentication', 'teamResolve', 'Admin', 'DomainsService'];

  function TeamsController ($scope, $state, Authentication, team, Admin, DomainsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.team = team;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.cancelform = cancelform;
    vm.save = save;

    vm.userslist = Admin.query();
    vm.domainslist = DomainsService.query();
    
    // Remove existing Team
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.team.$remove($state.go('teams.list'));
      }
    }

    // Cancel and go to list
    function cancelform() {
      $state.go('teams.list');
    }

    // Save Team
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.teamForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.team._id) {
        vm.team.$update(successCallback, errorCallback);
      } else {
        vm.team.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('teams.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }

  angular.module('teams').filter('propsFilter', function() {
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
