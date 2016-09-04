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
    trim: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  manager: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

mongoose.model('Domain', DomainSchema);
