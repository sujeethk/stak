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
    //required: 'Please fill AIT number',
    trim: true
  },
  status:{
    type: String,
    enum: ['active', 'inactive']
  },
  manager: {
    type: Schema.ObjectId,
    ref: 'User'
  },
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

mongoose.model('App', AppSchema);
