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

  angular
    .module('plans')
    .filter('unique', function() {
    return function (arr, field) {
        return _.uniq(arr, function(a) { return a[field]; });
    };
});
})();
