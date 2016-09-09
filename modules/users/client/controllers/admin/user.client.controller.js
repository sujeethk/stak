'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve', 'toasty',
  function ($scope, $state, Authentication, userResolve, toasty) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;
    $scope.userroles = ['user', 'coord', 'manager', 'admin'];
    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();
          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
            toasty.success({
              title: 'Deleted!',
              msg: $scope.user.displayName + ' has been deleted!',
              theme: 'bootstrap'
            });
          });
        }
      }
    };

    $scope.cancelform = function () {
      $state.go('admin.users');
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        toasty.success({
          title: 'Save successful!',
          msg: user.displayName + ' has been saved!',
          theme: 'bootstrap'
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        toasty.error({
          title: 'Save Error!',
          msg: $scope.error,
          theme: 'bootstrap'
        });
      });
    };
  }
]);
