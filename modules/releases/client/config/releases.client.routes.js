(function () {
  'use strict';

  angular
    .module('releases')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('releases', {
        abstract: true,
        url: '/releases',
        template: '<ui-view/>'
      })
      .state('releases.list', {
        url: '',
        templateUrl: 'modules/releases/client/views/list-releases.client.view.html',
        controller: 'ReleasesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Releases List'
        }
      })
      .state('releases.create', {
        url: '/create',
        templateUrl: 'modules/releases/client/views/form-release.client.view.html',
        controller: 'ReleasesController',
        controllerAs: 'vm',
        resolve: {
          releaseResolve: newRelease
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Releases Create'
        }
      })
      .state('releases.edit', {
        url: '/:releaseId/edit',
        templateUrl: 'modules/releases/client/views/form-release.client.view.html',
        controller: 'ReleasesController',
        controllerAs: 'vm',
        resolve: {
          releaseResolve: getRelease
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Release {{ releaseResolve.name }}'
        }
      })
      .state('releases.view', {
        url: '/:releaseId',
        templateUrl: 'modules/releases/client/views/view-release.client.view.html',
        controller: 'ReleasesController',
        controllerAs: 'vm',
        resolve: {
          releaseResolve: getRelease
        },
        data:{
          pageTitle: 'Release {{ articleResolve.name }}'
        }
      });
  }

  getRelease.$inject = ['$stateParams', 'ReleasesService'];

  function getRelease($stateParams, ReleasesService) {
    return ReleasesService.get({
      releaseId: $stateParams.releaseId
    }).$promise;
  }

  newRelease.$inject = ['ReleasesService'];

  function newRelease(ReleasesService) {
    return new ReleasesService();
  }
})();
