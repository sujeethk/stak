//Releases service used to communicate Releases REST endpoints
(function () {
  'use strict';

  angular
    .module('releases')
    .factory('ReleasesService', ReleasesService);

  ReleasesService.$inject = ['$resource'];

  function ReleasesService($resource) {
    return $resource('api/releases/:releaseId', {
      releaseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
