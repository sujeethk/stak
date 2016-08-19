(function () {
  'use strict';

  // Plans controller
  angular
    .module('plans')
    .controller('PlansController', PlansController);

  PlansController.$inject = ['$scope', '$state', 'Authentication', 'planResolve', 'Userslist', 'DomainsService', 'AppsService', 'ReleasesService'];

  function PlansController ($scope, $state, Authentication, plan, Userslist, DomainsService, AppsService, ReleasesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.plan = plan;
    vm.plan.autolock = new Date(vm.plan.autolock || Date.now());
    vm.plan.initStart = new Date(vm.plan.initStart || Date.now());
    vm.plan.initEnd = new Date(vm.plan.initEnd || Date.now());
    vm.plan.updatedStart = new Date(vm.plan.updatedStart || Date.now());
    vm.plan.updatedEnd = new Date(vm.plan.updatedEnd || Date.now());
    
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.options = {};
    vm.options.category = ['Routing', 'Release', 'Adhoc', 'Template'];
    vm.options.dcs = ['QTS', 'COIT', 'FRYE', 'VA', 'TX'];
    vm.options.status = ['Draft', 'Final', 'InProgress', 'Completed', 'Canceled'];
    vm.dateformat = "MMM dd, yyyy";

    vm.userslist = Userslist.query();
    vm.domainslist = DomainsService.query();
    vm.appslist = AppsService.query();
    vm.releaseslist = ReleasesService.query();

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
  angular.module('plans').filter('propsFilter', function() {
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
