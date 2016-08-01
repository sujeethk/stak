'use strict';

/**
 * Module dependencies
 */
var plansPolicy = require('../policies/plans.server.policy'),
  plans = require('../controllers/plans.server.controller');

module.exports = function(app) {
  // Plans Routes
  app.route('/api/plans').all(plansPolicy.isAllowed)
    .get(plans.list)
    .post(plans.create);

  app.route('/api/plans/:planId').all(plansPolicy.isAllowed)
    .get(plans.read)
    .put(plans.update)
    .delete(plans.delete);

  // Finish by binding the Plan middleware
  app.param('planId', plans.planByID);
};
