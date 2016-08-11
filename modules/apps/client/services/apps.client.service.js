//Apps service used to communicate Apps REST endpoints
(function () {
  'use strict';

  angular
    .module('apps')
    .factory('AppsService', AppsService);

  AppsService.$inject = ['$resource'];

  function AppsService($resource) {
    return $resource('api/apps/:appId', {
      appId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
