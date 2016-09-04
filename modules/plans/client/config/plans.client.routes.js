(function () {
  'use strict';

  angular
    .module('plans')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('plans', {
        abstract: true,
        url: '/plans',
        template: '<ui-view/>'
      })
      .state('plans.list', {
        url: '',
        templateUrl: 'modules/plans/client/views/list-plans.client.view.html',
        controller: 'PlansListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Plans List'
        }
      })
      .state('plans.create', {
        url: '/create',
        templateUrl: 'modules/plans/client/views/form-plan.client.view.html',
        controller: 'PlansController',
        controllerAs: 'vm',
        resolve: {
          planResolve: newPlan
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Plans Create'
        }
      })
      .state('plans.edit', {
        url: '/:planId/edit',
        templateUrl: 'modules/plans/client/views/form-plan.client.view.html',
        controller: 'PlansController',
        controllerAs: 'vm',
        resolve: {
          planResolve: getPlan
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Plan {{ planResolve.name }}'
        }
      })
      .state('plans.view', {
        url: '/:planId',
        templateUrl: 'modules/plans/client/views/view-plan.client.view.html',
        controller: 'PlansController',
        controllerAs: 'vm',
        resolve: {
          planResolve: getPlan
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Plan {{ articleResolve.name }}'
        }
      });
  }

  getPlan.$inject = ['$stateParams', 'PlansService'];

  function getPlan($stateParams, PlansService) {
    return PlansService.get({
      planId: $stateParams.planId
    }).$promise;
  }

  newPlan.$inject = ['PlansService'];

  function newPlan(PlansService) {
    return new PlansService();
  }
})();
