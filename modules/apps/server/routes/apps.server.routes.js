'use strict';

/**
 * Module dependencies
 */
var appsPolicy = require('../policies/apps.server.policy'),
  apps = require('../controllers/apps.server.controller');

module.exports = function(app) {
  // Apps Routes
  app.route('/api/apps').all(appsPolicy.isAllowed)
    .get(apps.list)
    .post(apps.create);

  app.route('/api/apps/:appId').all(appsPolicy.isAllowed)
    .get(apps.read)
    .put(apps.update)
    .delete(apps.delete);

  // Finish by binding the App middleware
  app.param('appId', apps.appByID);
};
