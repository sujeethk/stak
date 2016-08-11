(function () {
  'use strict';

  describe('Domains Route Tests', function () {
    // Initialize global variables
    var $scope,
      DomainsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DomainsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DomainsService = _DomainsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('domains');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/domains');
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
          DomainsController,
          mockDomain;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('domains.view');
          $templateCache.put('modules/domains/client/views/view-domain.client.view.html', '');

          // create mock Domain
          mockDomain = new DomainsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Domain Name'
          });

          //Initialize Controller
          DomainsController = $controller('DomainsController as vm', {
            $scope: $scope,
            domainResolve: mockDomain
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:domainId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.domainResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            domainId: 1
          })).toEqual('/domains/1');
        }));

        it('should attach an Domain to the controller scope', function () {
          expect($scope.vm.domain._id).toBe(mockDomain._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/domains/client/views/view-domain.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DomainsController,
          mockDomain;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('domains.create');
          $templateCache.put('modules/domains/client/views/form-domain.client.view.html', '');

          // create mock Domain
          mockDomain = new DomainsService();

          //Initialize Controller
          DomainsController = $controller('DomainsController as vm', {
            $scope: $scope,
            domainResolve: mockDomain
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.domainResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/domains/create');
        }));

        it('should attach an Domain to the controller scope', function () {
          expect($scope.vm.domain._id).toBe(mockDomain._id);
          expect($scope.vm.domain._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/domains/client/views/form-domain.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DomainsController,
          mockDomain;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('domains.edit');
          $templateCache.put('modules/domains/client/views/form-domain.client.view.html', '');

          // create mock Domain
          mockDomain = new DomainsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Domain Name'
          });

          //Initialize Controller
          DomainsController = $controller('DomainsController as vm', {
            $scope: $scope,
            domainResolve: mockDomain
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:domainId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.domainResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            domainId: 1
          })).toEqual('/domains/1/edit');
        }));

        it('should attach an Domain to the controller scope', function () {
          expect($scope.vm.domain._id).toBe(mockDomain._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/domains/client/views/form-domain.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
