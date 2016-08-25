(function () {
  'use strict';

  angular
    .module('plans')
    .controller('PlansListController', PlansListController);

  PlansListController.$inject = ['PlansService'];

  function PlansListController(PlansService) {
    var vm = this;

    vm.plans = PlansService.query(function(res) {

    }, function(error) {
      vm.failed = true;
    });
  }
})();
