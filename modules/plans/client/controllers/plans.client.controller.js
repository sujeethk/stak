(function () {
  'use strict';

  // Plans controller
  angular
    .module('plans')
    .controller('PlansController', PlansController);

  PlansController.$inject = ['$scope', '$state', 'Authentication', 'planResolve'];

  function PlansController ($scope, $state, Authentication, plan) {
    var vm = this;

    vm.authentication = Authentication;
    vm.plan = plan;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Plan
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.plan.$remove($state.go('plans.list'));
      }
    }

    // Save Plan
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.planForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.plan._id) {
        vm.plan.$update(successCallback, errorCallback);
      } else {
        vm.plan.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('plans.view', {
          planId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    $scope.models = {
      selected: null,
      templates: [{
        type: 'item',
        id: 2
      }, {
        type: 'container',
        id: 1,
        columns: [
          [],
          []
        ]
      }],
      dropzones: {
        'A': [{
          'type': 'container',
          'id': 1,
          'columns': [
            [{
              'type': 'item',
              'id': '1'
            }, {
              'type': 'item',
              'id': '2'
            }],
            [{
              'type': 'item',
              'id': '3'
            }]
          ]
        }, {
          'type': 'item',
          'id': '4'
        }, {
          'type': 'item',
          'id': '5'
        }, {
          'type': 'item',
          'id': '6'
        }],
        'B': [{
          'type': 'item',
          'id': 7
        }, {
          'type': 'item',
          'id': '8'
        }, {
          'type': 'container',
          'id': '2',
          'columns': [
            [{
              'type': 'item',
              'id': '9'
            }, {
              'type': 'item',
              'id': '10'
            }, {
              'type': 'item',
              'id': '11'
            }],
            [{
              'type': 'item',
              'id': '12'
            }, {
              'type': 'container',
              'id': '3',
              'columns': [
                [{
                  'type': 'item',
                  'id': '13'
                }],
                [{
                  'type': 'item',
                  'id': '14'
                }]
              ]
            }, {
              'type': 'item',
              'id': '15'
            }, {
              'type': 'item',
              'id': '16'
            }]
          ]
        }, {
          'type': 'item',
          'id': 16
        }]
      }
    };

    $scope.$watch('models.dropzones', function(model) {
      $scope.modelAsJson = angular.toJson(model, true);
    }, true);
  }
})();
