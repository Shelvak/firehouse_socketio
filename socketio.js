var html = require('http')
  , app  = html.createServer(handler)
  , io   = require('socket.io')(app)
  , fs   = require('fs')

app.listen(8085);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}

io.on('connection', function (socket) {
  socket.on('new intervention', function (data) {
    socket.broadcast.emit('update interventions', { message: data['message'] })
  });
});