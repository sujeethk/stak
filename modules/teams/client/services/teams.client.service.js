//Teams service used to communicate Teams REST endpoints
(function () {
  'use strict';

  angular
    .module('teams')
    .factory('TeamsService', TeamsService);

  TeamsService.$inject = ['$resource'];

  function TeamsService($resource) {
    return $resource('api/teams/:teamId', {
      teamId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
