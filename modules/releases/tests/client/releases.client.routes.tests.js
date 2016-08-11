(function () {
  'use strict';

  describe('Releases Route Tests', function () {
    // Initialize global variables
    var $scope,
      ReleasesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ReleasesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ReleasesService = _ReleasesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('releases');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/releases');
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
          ReleasesController,
          mockRelease;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('releases.view');
          $templateCache.put('modules/releases/client/views/view-release.client.view.html', '');

          // create mock Release
          mockRelease = new ReleasesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Release Name'
          });

          //Initialize Controller
          ReleasesController = $controller('ReleasesController as vm', {
            $scope: $scope,
            releaseResolve: mockRelease
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:releaseId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.releaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            releaseId: 1
          })).toEqual('/releases/1');
        }));

        it('should attach an Release to the controller scope', function () {
          expect($scope.vm.release._id).toBe(mockRelease._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/releases/client/views/view-release.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ReleasesController,
          mockRelease;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('releases.create');
          $templateCache.put('modules/releases/client/views/form-release.client.view.html', '');

          // create mock Release
          mockRelease = new ReleasesService();

          //Initialize Controller
          ReleasesController = $controller('ReleasesController as vm', {
            $scope: $scope,
            releaseResolve: mockRelease
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.releaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/releases/create');
        }));

        it('should attach an Release to the controller scope', function () {
          expect($scope.vm.release._id).toBe(mockRelease._id);
          expect($scope.vm.release._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/releases/client/views/form-release.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ReleasesController,
          mockRelease;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('releases.edit');
          $templateCache.put('modules/releases/client/views/form-release.client.view.html', '');

          // create mock Release
          mockRelease = new ReleasesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Release Name'
          });

          //Initialize Controller
          ReleasesController = $controller('ReleasesController as vm', {
            $scope: $scope,
            releaseResolve: mockRelease
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:releaseId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.releaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            releaseId: 1
          })).toEqual('/releases/1/edit');
        }));

        it('should attach an Release to the controller scope', function () {
          expect($scope.vm.release._id).toBe(mockRelease._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/releases/client/views/form-release.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
