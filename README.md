# map_updater
A tiny socket using SocketIo to update a general map when something changes in the application

## Dependencies
You must install Node (and socketio if you have any trouble using this)

# Usage
For the server, after cd to this project's folder you should run: 
```
node socketio.js
```
And that will start the mini server

In your application you must have the core.js (utilities/core.js) file and it must be available when you want to call any functions

For example you can make a file like this that manages the Updates
``` javascript
//javascript

var Updater = ( function () {
  var socket  = io('http://localhost:8085') //check the port if you changed it in the configuration
    , timeout = 1500

    , listenToUpdates = function () {
        socket.on('update interventions', function (data) {
          var message = 'New updates'
          showMessage(message)
          setTimeout(refreshPage, timeout)
        });
    }
    , emitEvent = function (event, incomingMessage) {
        if (event == 'new update') socket.emit(event, { message: incomingMessage })
    }
    , showMessage = function (message) {
        var alertDiv = document.querySelector('[rel="alerts"]')
        alertDiv.className = 'alert alert-warning'
        alertDiv.innerHTML = message
    }
    , refreshPage = function () {
        window.location.reload()
    }
  return {
      update    : listenToUpdates
    , emitEvent : emitEvent
  }
} () )
```

And then call them from your views:
```javascript
// When you want to let the server knows that something happened, I usually do this after an ajax request.
InterventionUpdater.emitEvent('new update')
```
```html
<!-- This goes where you want to catch the advices from the server -->
  <script type="text/javascript" charset="utf-8">
    $(document).ready(function() {
      Updater.update();
    });
  </script>
```

PD: this is super beta and made for a specific project, probably you should edit the socketio.js file in order to make this work correctly
