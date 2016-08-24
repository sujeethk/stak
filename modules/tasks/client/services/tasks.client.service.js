//Tasks service used to communicate Tasks REST endpoints
(function () {
  'use strict';

  angular
    .module('tasks')
    .factory('TasksService', TasksService);

  TasksService.$inject = ['$resource'];

  function TasksService($resource) {
    return $resource('api/plans/:planId/tasks/:taskId', {
      taskId: '@_id',
      planId: '@planId'
    }, {
      update: {
        method: 'PUT',
        params: {
          taskId: '@_id',
          planId: '@parent._id'
        }
      }
    });
  }
})();
