'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Release Schema
 */
var ReleaseSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Release name',
    trim: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  start: {
    type: Date,
    required: 'Please fill Start date'
  },
  end: {
    type: Date,
    required: 'Please fill End date'
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

mongoose.model('Release', ReleaseSchema);
