'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * App Schema
 */
var AppSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill App name',
    trim: true
  },
  ait: {
    type: Number,
    required: 'Please fill AIT number',
    trim: true,
    unique: true
  },
  status:{
    type: String,
    enum: ['active', 'retired', 'inactive', 'deleted'],
    default: 'active'
  },
  manager: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  domain: {
    type: Schema.ObjectId,
    ref: 'Domain'
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

mongoose.model('App', AppSchema);
