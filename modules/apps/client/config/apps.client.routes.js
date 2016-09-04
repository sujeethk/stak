(function () {
  'use strict';

  angular
    .module('apps')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('apps', {
        abstract: true,
        url: '/apps',
        template: '<ui-view/>'
      })
      .state('apps.list', {
        url: '',
        templateUrl: 'modules/apps/client/views/list-apps.client.view.html',
        controller: 'AppsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Apps List'
        }
      })
      .state('apps.create', {
        url: '/create',
        templateUrl: 'modules/apps/client/views/form-app.client.view.html',
        controller: 'AppsController',
        controllerAs: 'vm',
        resolve: {
          appResolve: newApp
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Apps Create'
        }
      })
      .state('apps.edit', {
        url: '/:appId/edit',
        templateUrl: 'modules/apps/client/views/form-app.client.view.html',
        controller: 'AppsController',
        controllerAs: 'vm',
        resolve: {
          appResolve: getApp
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit App {{ appResolve.name }}'
        }
      })
      .state('apps.view', {
        url: '/:appId',
        templateUrl: 'modules/apps/client/views/view-app.client.view.html',
        controller: 'AppsController',
        controllerAs: 'vm',
        resolve: {
          appResolve: getApp
        },
        data:{
          pageTitle: 'App {{ articleResolve.name }}'
        }
      });
  }

  getApp.$inject = ['$stateParams', 'AppsService'];

  function getApp($stateParams, AppsService) {
    return AppsService.get({
      appId: $stateParams.appId
    }).$promise;
  }

  newApp.$inject = ['AppsService'];

  function newApp(AppsService) {
    return new AppsService();
  }
})();
