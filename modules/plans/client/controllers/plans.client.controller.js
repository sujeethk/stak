(function () {
  'use strict';

  // Plans controller
  angular
    .module('plans')
    .controller('PlansController', PlansController);

  PlansController.$inject = ['$scope', '$state', '$stateParams', '$http', 'Authentication', 'toasty', 'planResolve', 'Userslist', 'DomainsService', 'AppsService', 'ReleasesService', 'TasksService'];

  function PlansController ($scope, $state, $stateParams, $http, Authentication, toasty, plan, Userslist, DomainsService, AppsService, ReleasesService, TasksService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.plan = plan;
    vm.tasks = (vm.plan._id ? TasksService.query({ planId: vm.plan._id }) : []);
    vm.dateformat = 'MMM dd, yyyy';
    vm.startExecution = startExecution;
    vm.taskCompleted = taskCompleted;
    if($state.current.name === 'plans.edit' || 'plans.create'){
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
      vm.options.status = ['Draft', 'Final', 'Started', 'Completed', 'Canceled'];
      vm.userslist = Userslist.query();
      vm.domainslist = DomainsService.query();
      vm.appslist = AppsService.query();
      vm.releaseslist = ReleasesService.query();
    }

    //Calculate start and end times for tasks
    if(vm.plan._id){
      vm.tasks.$promise.then(function(){
        for(var i = 0; i < vm.tasks.length; i++){
          if(vm.tasks[i].status === 'Draft' || 'Approved' || 'Canceled'){
            if(i===0){
              vm.tasks[i].initStart = new Date(vm.plan.actualStart || vm.plan.updatedStart || vm.plan.initStart);
              vm.tasks[i].initEnd = new Date(vm.tasks[i].initStart.getTime() + (vm.tasks[i].duration*60000));
            } else {
              vm.tasks[i].initStart = vm.tasks[i-1].initEnd;
              vm.tasks[i].initEnd = new Date(vm.tasks[i].initStart.getTime() + (vm.tasks[i].duration*60000));
            }
          } else if(vm.tasks[i].status === 'Started'){

          } else if(vm.tasks[i].status === 'Completed'){

          }
        }
      });
    }

    // Remove existing Plan
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.plan.$remove($state.go('plans.list'));
      }
    }

    function cancelform() {
      if($state.current.name === 'plans.edit'){
        $state.go('plans.view', { planId: vm.plan._id });
      } else {
        $state.go('plans.list');
      }

    }

    //Start execution function
    function startExecution() {
      vm.plan.status = vm.options.status[2];
      vm.tasks[0].status = 'Started';
      vm.plan.actualStart = Date.now();
      vm.tasks[0].actualStart = vm.plan.actualStart;

      var req = {
        method: 'PUT',
        url: 'api/plans/'+vm.plan._id+'/tasks/'+vm.tasks[0]._id,
        data: vm.tasks[0]
      };

      $http(req).then(function(){
        vm.plan.$update(function(){
          toasty.success({
            title: 'Startup completed!',
            theme: 'bootstrap'
          });
        }, function(res){
          toasty.error({
            title: 'Error on Startup!',
            msg: res.data.message,
            theme: 'bootstrap'
          });
        });
      }, function(){});
    }

    //Task completed function
    function taskCompleted(taskId){

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
        //Call bulk update api to update sortorder and any other changes from the form on update
        for(var i = 0; i < vm.tasks.length; i++){
          vm.tasks[i].sortOrder = i;
        }
        var req = {
          method: 'PUT',
          url: 'api/plans/'+vm.plan._id+'/tasks',
          data: vm.tasks
        };

        $http(req).then(function(){
          vm.plan.$update(successCallback, errorCallback);
        }, errorCallback);
      } else {
        vm.plan.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('plans.view', {
          planId: res._id
        });
        toasty.success({
          title: 'Save successful!',
          msg: vm.plan.name + ' has been saved!',
          theme: 'bootstrap'
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        toasty.error({
          title: 'Save error!',
          msg: vm.eror,
          theme: 'bootstrap'
        });
      }
    }
  }
})();
