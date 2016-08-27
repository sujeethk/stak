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
      return function(collection, keyname) {
        var output = [],
          keys = [];

        angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
            keys.push(key);
            output.push(item);
          }
        });
        return output;
      };
    });
})();
