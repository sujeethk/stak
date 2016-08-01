(function () {
  'use strict';

  describe('Apps Route Tests', function () {
    // Initialize global variables
    var $scope,
      AppsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AppsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AppsService = _AppsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('apps');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/apps');
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
          AppsController,
          mockApp;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('apps.view');
          $templateCache.put('modules/apps/client/views/view-app.client.view.html', '');

          // create mock App
          mockApp = new AppsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'App Name'
          });

          //Initialize Controller
          AppsController = $controller('AppsController as vm', {
            $scope: $scope,
            appResolve: mockApp
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:appId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.appResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            appId: 1
          })).toEqual('/apps/1');
        }));

        it('should attach an App to the controller scope', function () {
          expect($scope.vm.app._id).toBe(mockApp._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/apps/client/views/view-app.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AppsController,
          mockApp;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('apps.create');
          $templateCache.put('modules/apps/client/views/form-app.client.view.html', '');

          // create mock App
          mockApp = new AppsService();

          //Initialize Controller
          AppsController = $controller('AppsController as vm', {
            $scope: $scope,
            appResolve: mockApp
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.appResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/apps/create');
        }));

        it('should attach an App to the controller scope', function () {
          expect($scope.vm.app._id).toBe(mockApp._id);
          expect($scope.vm.app._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/apps/client/views/form-app.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AppsController,
          mockApp;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('apps.edit');
          $templateCache.put('modules/apps/client/views/form-app.client.view.html', '');

          // create mock App
          mockApp = new AppsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'App Name'
          });

          //Initialize Controller
          AppsController = $controller('AppsController as vm', {
            $scope: $scope,
            appResolve: mockApp
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:appId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.appResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            appId: 1
          })).toEqual('/apps/1/edit');
        }));

        it('should attach an App to the controller scope', function () {
          expect($scope.vm.app._id).toBe(mockApp._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/apps/client/views/form-app.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
