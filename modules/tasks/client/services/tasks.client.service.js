//Tasks service used to communicate Tasks REST endpoints
(function () {
  'use strict';

  angular
    .module('tasks')
    .factory('TasksService', TasksService);

  TasksService.$inject = ['$resource'];

  function TasksService($resource) {
    return $resource('api/tasks/:taskId', {
      taskId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
