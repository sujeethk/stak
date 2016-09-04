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
    enum: ['active', 'inactive', 'deleted'],
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
  isCurrentRelease: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

mongoose.model('Release', ReleaseSchema);
