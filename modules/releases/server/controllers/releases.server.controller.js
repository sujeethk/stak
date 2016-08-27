'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Release = mongoose.model('Release'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Release
 */
exports.create = function(req, res) {
  var release = new Release(req.body);
  release.createdBy = req.user;

  release.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(release);
    }
  });
};

/**
 * Show the current Release
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var release = req.release ? req.release.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  release.isCurrentUserOwner = req.user && release.createdBy && release.createdBy._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(release);
};

/**
 * Update a Release
 */
exports.update = function(req, res) {
  var release = req.release ;

  release = _.extend(release , req.body);

  release.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(release);
    }
  });
};

/**
 * Delete an Release
 */
exports.delete = function(req, res) {
  var release = req.release ;
  release.status = 'deleted';
  release.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(release);
    }
  });
};

/**
 * List of Releases
 */
exports.list = function(req, res) {
  Release.find({ 'status': 'active' }).sort('status name').populate('createdBy', 'displayName').exec(function(err, releases) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(releases);
    }
  });
};

/**
 * Release middleware
 */
exports.releaseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Release is invalid'
    });
  }

  Release.findById(id).populate('createdBy', 'displayName').exec(function (err, release) {
    if (err) {
      return next(err);
    } else if (!release) {
      return res.status(404).send({
        message: 'No Release with that identifier has been found'
      });
    }
    req.release = release;
    next();
  });
};
