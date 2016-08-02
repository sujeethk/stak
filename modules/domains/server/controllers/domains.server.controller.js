'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Domain = mongoose.model('Domain'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Domain
 */
exports.create = function(req, res) {
  var domain = new Domain(req.body);
  domain.createdBy = req.user;

  domain.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(domain);
    }
  });
};

/**
 * Show the current Domain
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var domain = req.domain ? req.domain.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  domain.isCurrentUserOwner = req.user && domain.createdBy && domain.createdBy._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(domain);
};

/**
 * Update a Domain
 */
exports.update = function(req, res) {
  var domain = req.domain ;

  domain = _.extend(domain , req.body);

  domain.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(domain);
    }
  });
};

/**
 * Delete an Domain
 */
exports.delete = function(req, res) {
  var domain = req.domain ;

  domain.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(domain);
    }
  });
};

/**
 * List of Domains
 */
exports.list = function(req, res) { 
  Domain.find().sort('-created').populate('createdBy', 'displayName').exec(function(err, domains) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(domains);
    }
  });
};

/**
 * Domain middleware
 */
exports.domainByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Domain is invalid'
    });
  }

  Domain.findById(id).populate('createdBy', 'displayName').exec(function (err, domain) {
    if (err) {
      return next(err);
    } else if (!domain) {
      return res.status(404).send({
        message: 'No Domain with that identifier has been found'
      });
    }
    req.domain = domain;
    next();
  });
};
