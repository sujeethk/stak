'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Domain Schema
 */
var DomainSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Domain name',
    trim: true
  },
  status: {
    type: String,
    enum: ['active','inactive'],
    default: 'active'
  },
  manager: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Domain', DomainSchema);
