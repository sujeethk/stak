'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Plan = mongoose.model('Plan'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Plan
 */
exports.create = function(req, res) {
  var plan = new Plan(req.body);
  plan.createdBy = req.user;

  plan.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plan);
    }
  });
};

/**
 * Show the current Plan
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var plan = req.plan ? req.plan.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  plan.isCurrentUserOwner = req.user && plan.createdBy && plan.createdBy._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(plan);
};

/**
 * Update a Plan
 */
exports.update = function(req, res) {
  var plan = req.plan ;

  plan = _.extend(plan , req.body);

  plan.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plan);
    }
  });
};

/**
 * Delete an Plan
 */
exports.delete = function(req, res) {
  var plan = req.plan ;

  plan.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plan);
    }
  });
};

/**
 * List of Plans
 */
exports.list = function(req, res) { 
  Plan.find().sort('-created').populate('createdBy', 'displayName').exec(function(err, plans) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(plans);
    }
  });
};

/**
 * Plan middleware
 */
exports.planByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Plan is invalid'
    });
  }

  Plan.findById(id).populate('createdBy', 'displayName').exec(function (err, plan) {
    if (err) {
      return next(err);
    } else if (!plan) {
      return res.status(404).send({
        message: 'No Plan with that identifier has been found'
      });
    }
    req.plan = plan;
    next();
  });
};
