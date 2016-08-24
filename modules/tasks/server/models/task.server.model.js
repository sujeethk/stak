'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Task name',
    trim: true
  },
  parent: {
    type: Schema.ObjectId,
    ref: 'Plan'
  },
  description: String,
  taskid: String,
  type: String, //Milestone, Stack, Task
  importplan: {
    type: Schema.ObjectId,
    ref: 'Plan'
  },
  category: String,
  highlight: Boolean,
  crqs: [String],
  apps: [{
    type: Schema.ObjectId,
    ref: 'App' 
  }],
  dcs: [String],
  status: String,
  colorstatus: String,
  progress: String,
  sql: {
    type: Boolean,
    default: false
  },
  sqlloc: String,
  approved: {
    type: Boolean,
    default: false
  },
  child: {
    type: Schema.ObjectId,
    ref: 'Plan'
  },
  externaldependency: {
    plan: {
      type: Schema.ObjectId,
      ref: 'Plan'
    },
    task: [{
      type: Schema.ObjectId,
      ref: 'Task'
    }]
  },
  sortOrder: Number,
  duration: Number,
  startTime: Date,
  endTime: Date,
  updatedStart: Date,
  updatedEnd: Date,
  actualStart: Date,
  actualEnd: Date,
  poc: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  team: [{
    type: Schema.ObjectId,
    ref: 'Team'
  }],
  contact: String,
  notes: String,
  lastPaged: Date,
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  modifiedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  completedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  subscribers: String,
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Task', TaskSchema);
