//Plans service used to communicate Plans REST endpoints
(function () {
  'use strict';

  angular
    .module('plans')
    .factory('PlansService', PlansService);

  PlansService.$inject = ['$resource'];

  function PlansService($resource) {
    return $resource('api/plans/:planId', {
      planId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
