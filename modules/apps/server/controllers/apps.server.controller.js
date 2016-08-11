'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  App = mongoose.model('App'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a App
 */
exports.create = function(req, res) {
  var app = new App(req.body);
  app.createdBy = req.user;

  app.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(app);
    }
  });
};

/**
 * Show the current App
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var app = req.app ? req.app.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  app.isCurrentUserOwner = req.user && app.createdBy && app.createdBy._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(app);
};

/**
 * Update a App
 */
exports.update = function(req, res) {
  var app = req.app ;

  app = _.extend(app , req.body);

  app.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(app);
    }
  });
};

/**
 * Delete an App
 */
exports.delete = function(req, res) {
  var app = req.app ;

  app.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(app);
    }
  });
};

/**
 * List of Apps
 */
exports.list = function(req, res) { 
  App.find().sort('status ait name').populate('createdBy manager domain', 'displayName displayName name').exec(function(err, apps) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(apps);
    }
  });
};

/**
 * App middleware
 */
exports.appByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'App is invalid'
    });
  }

  App.findById(id).populate('createdBy manager domain', 'displayName displayName name').exec(function (err, app) {
    if (err) {
      return next(err);
    } else if (!app) {
      return res.status(404).send({
        message: 'No App with that identifier has been found'
      });
    }
    req.app = app;
    next();
  });
};
