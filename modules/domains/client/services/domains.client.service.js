//Domains service used to communicate Domains REST endpoints
(function () {
  'use strict';

  angular
    .module('domains')
    .factory('DomainsService', DomainsService);

  DomainsService.$inject = ['$resource'];

  function DomainsService($resource) {
    return $resource('api/domains/:domainId', {
      domainId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
