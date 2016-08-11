(function () {
  'use strict';

  angular
    .module('releases')
    .controller('ReleasesListController', ReleasesListController);

  ReleasesListController.$inject = ['ReleasesService'];

  function ReleasesListController(ReleasesService) {
    var vm = this;

    vm.releases = ReleasesService.query();
  }
})();
