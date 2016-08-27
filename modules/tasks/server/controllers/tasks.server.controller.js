'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Task
 */
exports.create = function(req, res) {
  var task = new Task(req.body);
  task.createdBy = req.user;

  task.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(task);
    }
  });
};

/**
 * Show the current Task
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var task = req.task ? req.task.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  task.isCurrentUserOwner = req.user && task.createdBy && task.createdBy._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(task);
};

/**
 * Update a Task
 */
exports.update = function(req, res) {
  var task = req.task ;

  task = _.extend(task , req.body);
  task.modifiedBy = req.user;
  task.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(task);
    }
  });
};

/**
 * Bulk Update Tasks
 */
exports.bulkupdate = function(req, res) {
  var tasks = req.body;
  var msg = '';
  for(var i = 0; i < tasks.length; i++){
    Task.findOneAndUpdate({ '_id': tasks[i]._id }, { 'sortOrder': tasks[i].sortOrder }, callbackfnbu);
  }
  function callbackfnbu(err){
    if(err){
      msg = 'Errored on saving tasks structure';
    }
  }
  if(msg === ''){
    return res.status(200).send({ message: 'Successful save' });
  } else {
    return res.status(400).send({ message: msg });
  }

};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
  var task = req.task ;
  task.status = 'deleted';
  task.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(task);
    }
  });
};

/**
 * List of Tasks
 */
exports.list = function(req, res) {
  Task.find({ 'status' : { '$ne': 'deleted' }, 'parent': { '_id': req.params.planId } }).sort('sortOrder').populate('createdBy poc parent', 'displayName name').exec(function(err, tasks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tasks);
    }
  });
};

/**
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Task is invalid'
    });
  }

  Task.findById(id).select('-lastbestknown').populate('createdBy parent poc team child sql.apps', 'displayName name release ait').exec(function (err, task) {
    if (err) {
      return next(err);
    } else if (!task) {
      return res.status(404).send({
        message: 'No Task with that identifier has been found'
      });
    }
    req.task = task;
    next();
  });
};
