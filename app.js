var html = require('http')
  , app  = html.createServer()
  , io   = require('socket.io')(app);


app.listen(8085);

function SessionController () {
  this.redis = require('redis').createClient(
    6379,
    process.env['REDIS_HOST'] || process.env['REDIS_PORT_6379_TCP_ADDR'] || 'localhost'
  )
}

SessionController.prototype.subscribe = function (socket) {
  console.log('se llama a controller subscribe')
  this.redis.on('message', function (channel, msg) {
    console.log('en redis msg' + msg)
    message = JSON.parse(msg)
    socket.broadcast.emit(message.emit, message.data);
  });

  console.log('en redis subscribe')
  this.redis.subscribe('socketio-rails-notifier');
}

SessionController.prototype.unsubscribe = function () {
  this.redis.unsubscribe('socketio-rails-notifier');
}


io.on('connection', function (socket) {
  console.log('abriendo conexion')
  sessionController = new SessionController
  sessionController.subscribe(socket);

  console.log('subscripto')

  socket.on('new intervention', function (data) {
    console.log('new intervention, emitting')
    socket.broadcast.emit('update interventions', { message: data['message'] })
  });

  socket.on('disconnect', function() {
    console.log('desconecting')
    sessionController.unsubscribe()
  });
});
