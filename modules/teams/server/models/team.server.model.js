'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Team name',
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  dg: {
    type: String,
    lowercase: true
  },
  manager: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  primarypoc: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  secondarypoc: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  members: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  domain: {
    type: Schema.ObjectId,
    ref: 'Domain'
  },
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Team', TeamSchema);
