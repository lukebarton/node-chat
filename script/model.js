(function() {
  window.Message = Backbone.Model.extend({
    body: void 0,
    timestamp: void 0,
    nick: void 0
  });
  window.Connection = Backbone.Model.extend({
    initialize: function() {
      var messages;
      messages = this.get('messages');
      this.get('socket').connect();
      this.get('socket').on('connect', function() {
        return this.send('NICK ' + prompt('nick:'));
      });
      this.get('socket').on('message', function(data) {
        return messages.add(new Message(data));
      });
      return this.get('socket').on('disconnect', function() {
        return void 0;
      });
    },
    command: function(message) {
      var command, input, parts, rawCommand;
      if ((message.charAt(0)) === '/') {
        rawCommand = message.substr(1);
        parts = rawCommand.split(' ');
        command = parts.shift();
        input = parts.join(' ');
        switch (command) {
          case 'quit':
            return void 0;
          default:
            return this.get('socket').send(rawCommand);
        }
      } else {
        return this.get('socket').send('MESSAGE ' + message);
      }
    }
  });
  window.MessageList = Backbone.Collection.extend({
    model: Message
  });
}).call(this);
