(function () {
  'use strict';

  // Plans controller
  angular
    .module('plans')
    .controller('PlansController', PlansController);

  PlansController.$inject = ['$scope', '$state', 'Authentication', 'planResolve', 'Userslist', 'DomainsService', 'AppsService', 'ReleasesService', 'TasksService'];

  function PlansController ($scope, $state, Authentication, plan, Userslist, DomainsService, AppsService, ReleasesService, TasksService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.plan = plan;
    vm.plan.status = (vm.plan.status ? vm.plan.status : 'Draft');
    vm.plan.autolock = new Date(vm.plan.autolock || Date.now());
    vm.plan.initStart = (vm.plan.initStart ? new Date(vm.plan.initStart) : '');
    vm.plan.initEnd = (vm.plan.initEnd ? new Date(vm.plan.initEnd) : '');
    vm.plan.updatedStart = (vm.plan.updatedStart ? new Date(vm.plan.updatedStart) : '');
    vm.plan.updatedEnd = (vm.plan.updatedEnd ? new Date(vm.plan.updatedEnd) : '');

    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.options = {};
    vm.dnd = {};
    vm.cancelform = cancelform;
    vm.options.category = ['Routing', 'Release', 'Adhoc', 'Template'];
    vm.options.dcs = ['QTS', 'COIT', 'FRYE', 'VA', 'TX'];
    vm.options.status = ['Draft', 'Final', 'InProgress', 'Completed', 'Canceled'];
    vm.dateformat = 'MMM dd, yyyy';

    vm.userslist = Userslist.query();
    vm.domainslist = DomainsService.query();
    vm.appslist = AppsService.query();
    vm.releaseslist = ReleasesService.query();
    vm.tasks = (vm.plan._id ? TasksService.query({ planId: vm.plan._id }) : []);
    // Remove existing Plan
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.plan.$remove($state.go('plans.list'));
      }
    }

    function cancelform() {
      $state.go('plans.list');
    }

    // Save Plan
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.planForm');
        return false;
      }
      vm.plan.lastModified = Date.now();
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
