(function() {
  window.MessageView = Backbone.View.extend({
    tagName: 'li',
    render: function() {
      $(this.el).text(_.template('[<%= timestamp %>] <<%= nick %>> <%= body %>', this.model.toJSON()));
      return this;
    }
  });
  window.AppView = Backbone.View.extend({
    initialize: function() {
      this.render();
      _.bindAll(this, 'addOne', 'addAll', 'render');
      this.model.get('messages').bind('add', this.addOne);
      return void 0;
    },
    render: function() {
      this.el.html((_.template($('#app-template').html()))());
      return void 0;
    },
    addOne: function(message) {
      this.$('.messages').append((new MessageView({
        model: message
      })).render().el);
      return void 0;
    },
    events: {
      "keypress .newMessage": "sendOnEnter"
    },
    sendOnEnter: function(e) {
      if (e.keyCode === 13) {
        this.model.command(e.currentTarget.value);
        $(e.currentTarget).val('');
      }
      return void 0;
    }
  });
}).call(this);
