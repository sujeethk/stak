(function () {
  'use strict';

  angular
    .module('apps')
    .controller('AppsListController', AppsListController);

  AppsListController.$inject = ['AppsService'];

  function AppsListController(AppsService) {
    var vm = this;

    vm.apps = AppsService.query();
  }
})();
