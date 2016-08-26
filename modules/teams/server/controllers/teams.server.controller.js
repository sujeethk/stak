'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Team
 */
exports.create = function(req, res) {
  var team = new Team(req.body);
  team.createdBy = req.user;

  team.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(team);
    }
  });
};

/**
 * Show the current Team
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var team = req.team ? req.team.toJSON() : {};
  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  team.isCurrentUserOwner = req.user && team.createdBy && team.createdBy._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(team);
};

/**
 * Update a Team
 */
exports.update = function(req, res) {
  var team = req.team ;

  team = _.extend(team , req.body);

  team.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(team);
    }
  });
};

/**
 * Delete an Team
 */
exports.delete = function(req, res) {
  var team = req.team ;

  team.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(team);
    }
  });
};

/**
 * List of Teams
 */
exports.list = function(req, res) {
  Team.find().sort('status name').populate('manager createdBy primarypoc domain', 'displayName name').exec(function(err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(teams);
    }
  });
};

/**
 * Team middleware
 */
exports.teamByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Team is invalid'
    });
  }

  Team.findById(id).populate('manager createdBy primarypoc secondarypoc members domain', 'displayName email name').exec(function (err, team) {
    if (err) {
      return next(err);
    } else if (!team) {
      return res.status(404).send({
        message: 'No Team with that identifier has been found'
      });
    }
    req.team = team;
    next();
  });
};
