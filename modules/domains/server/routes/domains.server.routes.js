'use strict';

/**
 * Module dependencies
 */
var domainsPolicy = require('../policies/domains.server.policy'),
  domains = require('../controllers/domains.server.controller');

module.exports = function(app) {
  // Domains Routes
  app.route('/api/domains').all(domainsPolicy.isAllowed)
    .get(domains.list)
    .post(domains.create);

  app.route('/api/domains/:domainId').all(domainsPolicy.isAllowed)
    .get(domains.read)
    .put(domains.update)
    .delete(domains.delete);

  // Finish by binding the Domain middleware
  app.param('domainId', domains.domainByID);
};
