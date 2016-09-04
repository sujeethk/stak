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
  child: {
    type: Schema.ObjectId,
    ref: 'Plan'
  },
  lastbestknown: {
    type: Schema.Types.Mixed
  },
  description: String,
  type: {
    type: String,
    default: 'Task'
  }, //Milestone, Stack, Task
  category: String, //Deploy, Routing, Certiifcation, Infrastructure
  status: {
    type: String,
    default: 'Draft' //Draft, Approved, Started, Completed, Canceled, deleted
  },
  colorstatus: {
    type: String,
    default: 'Green' //Green, Yellow, Red from Child plan status
  },
  progress: {
    type: Number,
    default: 0 //% from child plan
  },
  sql: {
    is: {
      type: Boolean,
      default: false
    },
    dcs: [String],
    status: String,
    location: String,
    apps: [{
      type: Schema.ObjectId,
      ref: 'App'
    }],
  },
  dependents: [{
    type: Schema.ObjectId,
    ref: 'Task'
  }],
  sortOrder: {
    type: Number,
    default: 999
  },
  duration: Number,
  initStart: Date,
  initEnd: Date,
  updatedStart: Date,
  updatedEnd: Date,
  actualStart: Date,
  actualEnd: Date,
  poc: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
  },
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
  subscribers: [{
    type: String
  }]
}, { timestamps: true });

mongoose.model('Task', TaskSchema);
