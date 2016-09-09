'use strict';

var redis = require('redis');
var client = redis.createClient('11406', 'pub-redis-11406.us-east-1-4.2.ec2.garantiadata.com', { no_ready_check: true });
module.exports.init = function(){
  client.auth('root123', function (err) {
    if (err){
      console.log(err);
    }
  });

  client.on('connect', function() {
    console.log('Connected to Redis');
  });
  return true;
};

module.exports.client = function(){
  return client;
};
