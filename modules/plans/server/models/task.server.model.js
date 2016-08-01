var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  title: String,
  description: String,
  taskid: String,
  type: String, //Milestone, Stack, Task
  importplan: {
    type: Schema.ObjectId,
    ref: 'Plan'
  },
  category: String,
  highlight: Boolean,
  crqs: [String],
  apps: {
    type: [Schema.ObjectId],
    ref: 'App' 
  },
  dcs: [String],
  status: String,
  sql: {
    type: Boolean,
    default: false
  },
  sqlloc: String,
  approved: {
    type: Boolean,
    default: false
  },
  parents: [Schema.ObjectId],
  externaldependency: {
    plan: {
      type: Schema.ObjectId,
      ref: 'Plan'
    },
    task: {
      type: [Schema.ObjectId]
    }
  },
  plan:{
    colorstatus: String,
    progress: String
  },
  sortOrder: Number,
  duration: Number,
  startTime: Date,
  endTime: Date,
  updatedStart: Date,
  updatedEnd: Date,
  actualStart: Date,
  actualEnd: Date,
  poc: {
    type: [Schema.ObjectId],
    ref: 'User'
  },
  team: {
    type: [Schema.ObjectId],
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
  lastModified: Date,
  subscribers: String
});

module.exports = TaskSchema;