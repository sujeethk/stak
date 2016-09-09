'use strict';
var path = require('path'),
  redis = require(path.resolve('./config/lib/redis')).client();

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  redis.set('chat', 'samm', function(err, result){
    redis.get('chat', function(err, result){
      io.emit('chatMessage', {
        type: 'status',
        text: result,
        created: Date.now()
      });
    });
  });


  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;

    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      profileImageURL: socket.request.user.profileImageURL,
      username: socket.request.user.username
    });
  });
};
