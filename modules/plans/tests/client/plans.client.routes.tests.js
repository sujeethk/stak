(function () {
  'use strict';

  describe('Plans Route Tests', function () {
    // Initialize global variables
    var $scope,
      PlansService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PlansService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PlansService = _PlansService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('plans');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/plans');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PlansController,
          mockPlan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('plans.view');
          $templateCache.put('modules/plans/client/views/view-plan.client.view.html', '');

          // create mock Plan
          mockPlan = new PlansService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Plan Name'
          });

          //Initialize Controller
          PlansController = $controller('PlansController as vm', {
            $scope: $scope,
            planResolve: mockPlan
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:planId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.planResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            planId: 1
          })).toEqual('/plans/1');
        }));

        it('should attach an Plan to the controller scope', function () {
          expect($scope.vm.plan._id).toBe(mockPlan._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/plans/client/views/view-plan.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PlansController,
          mockPlan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('plans.create');
          $templateCache.put('modules/plans/client/views/form-plan.client.view.html', '');

          // create mock Plan
          mockPlan = new PlansService();

          //Initialize Controller
          PlansController = $controller('PlansController as vm', {
            $scope: $scope,
            planResolve: mockPlan
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.planResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/plans/create');
        }));

        it('should attach an Plan to the controller scope', function () {
          expect($scope.vm.plan._id).toBe(mockPlan._id);
          expect($scope.vm.plan._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/plans/client/views/form-plan.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PlansController,
          mockPlan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('plans.edit');
          $templateCache.put('modules/plans/client/views/form-plan.client.view.html', '');

          // create mock Plan
          mockPlan = new PlansService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Plan Name'
          });

          //Initialize Controller
          PlansController = $controller('PlansController as vm', {
            $scope: $scope,
            planResolve: mockPlan
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:planId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.planResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            planId: 1
          })).toEqual('/plans/1/edit');
        }));

        it('should attach an Plan to the controller scope', function () {
          expect($scope.vm.plan._id).toBe(mockPlan._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/plans/client/views/form-plan.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
