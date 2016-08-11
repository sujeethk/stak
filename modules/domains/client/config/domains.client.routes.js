(function () {
  'use strict';

  angular
    .module('domains')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('domains', {
        abstract: true,
        url: '/domains',
        template: '<ui-view/>'
      })
      .state('domains.list', {
        url: '',
        templateUrl: 'modules/domains/client/views/list-domains.client.view.html',
        controller: 'DomainsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Domains List'
        }
      })
      .state('domains.create', {
        url: '/create',
        templateUrl: 'modules/domains/client/views/form-domain.client.view.html',
        controller: 'DomainsController',
        controllerAs: 'vm',
        resolve: {
          domainResolve: newDomain
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Domains Create'
        }
      })
      .state('domains.edit', {
        url: '/:domainId/edit',
        templateUrl: 'modules/domains/client/views/form-domain.client.view.html',
        controller: 'DomainsController',
        controllerAs: 'vm',
        resolve: {
          domainResolve: getDomain
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Domain {{ domainResolve.name }}'
        }
      })
      .state('domains.view', {
        url: '/:domainId',
        templateUrl: 'modules/domains/client/views/view-domain.client.view.html',
        controller: 'DomainsController',
        controllerAs: 'vm',
        resolve: {
          domainResolve: getDomain
        },
        data:{
          pageTitle: 'Domain {{ articleResolve.name }}'
        }
      });
  }

  getDomain.$inject = ['$stateParams', 'DomainsService'];

  function getDomain($stateParams, DomainsService) {
    return DomainsService.get({
      domainId: $stateParams.domainId
    }).$promise;
  }

  newDomain.$inject = ['DomainsService'];

  function newDomain(DomainsService) {
    return new DomainsService();
  }
})();
