(function () {
  'use strict';

  angular
    .module('domains')
    .controller('DomainsListController', DomainsListController);

  DomainsListController.$inject = ['DomainsService'];

  function DomainsListController(DomainsService) {
    var vm = this;

    vm.domains = DomainsService.query();
  }
})();
