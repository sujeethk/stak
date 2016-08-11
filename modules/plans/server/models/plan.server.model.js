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
  description: String,
  domain: {
    type: Schema.ObjectId,
    ref: 'Domain' 
  },
  category: String,
  crqs: String,
  apps: {
    type: [Schema.ObjectId],
    ref: 'App'
  },
  dcs: [String],
  status: String,
  execution: {
    completion: Number,
    status: String,
    colorstatus: String,
    isDelay: Boolean,
    totalTasks: Number,
    completedTasks: Number,
    inprogressTasks: Number,
    lateTasks: Number,
    delayTime: Number,
    voidTasks: Number
  },
  release: {
    type: Schema.ObjectId,
    ref: 'Release'
  },
  duration: Number,
  lock: Boolean,
  edit: Boolean,
  editby: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  autolock: Date,
  startTime: Date,
  endTime: Date,
  updatedStart: Date,
  updatedEnd: Date,
  actualStart: Date,
  actualEnd: Date,
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  modifiedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  lastModified: Date,
  subscribers: String
});

mongoose.model('Plan', PlanSchema);
