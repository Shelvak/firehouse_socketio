var html = require('http')
  , app  = html.createServer()
  , io   = require('socket.io')(app);


app.listen(8085);

function SessionController () {
  this.redis = require('redis').createClient(6379, process.env['REDIS_PORT_6379_TCP_ADDR'] || 'localhost')
}

SessionController.prototype.subscribe = function (socket) {
  this.redis.on('message', function (channel, msg) {
    socket.emit('new-console-intervention', { link: msg });
  });

  this.redis.subscribe('socketio-new-intervention');
}

SessionController.prototype.unsubscribe = function () {
  this.redis.unsubscribe('socketio-new-intervention');
}



io.on('connection', function (socket) {

  sessionController = new SessionController
  sessionController.subscribe(socket);

  socket.on('new intervention', function (data) {
    socket.broadcast.emit('update interventions', { message: data['message'] })
  });

  socket.on('disconnect', function() {
    sessionController.unsubscribe()
  });
});
