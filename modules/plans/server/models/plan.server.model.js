'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
/**
 * Plan Schema
 */
var PlanSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Plan name',
    trim: true
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    default: ''
  },
  domain: {
    type: Schema.ObjectId,
    ref: 'Domain'
  },
  category: String,
  crqs: String,
  apps: [{
    type: Schema.ObjectId,
    ref: 'App'
  }],
  dcs: [String],
  status: {
    type: String,
    default: 'Draft'  // Draft, Final, Started, Completed, Canceled, deleted
  },
  execution: {
    completion: {
      type: Number,
      default: 0
    },
    colorstatus: {
      type:  String,
      default: 'Green'
    },
    isDelay: {
      type: Boolean,
      default: false
    },
    totalTasks: {
      type: Number,
      default: 0
    },
    completedTasks: {
      type: Number,
      default: 0
    },
    inprogressTasks: {
      type: Number,
      default: 0
    },
    lateTasks: {
      type: Number,
      default: 0
    },
    delayTime: {
      type: Number,
      default: 0
    },
    canceledTasks: {
      type: Number,
      default: 0
    },
  },
  release: {
    type: Schema.ObjectId,
    ref: 'Release'
  },
  duration: {
    type: Number,
    default: 0
  },
  edit: {
    type: Boolean,
    default: true
  },
  autolock: Date,
  initStart: Date,
  initEnd: Date,
  updatedStart: Date,
  updatedEnd: Date,
  actualStart: Date,
  actualEnd: Date,
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  modifiedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  subscribers: [{
    type: String
  }]
}, { timestamps: true });

mongoose.model('Plan', PlanSchema);
