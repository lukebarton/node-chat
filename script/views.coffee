window.MessageView = Backbone.View.extend
 tagName : 'li'
 render : () ->
  $(this.el).text _.template '[<%= timestamp %>] <<%= nick %>> <%= body %>', this.model.toJSON()
  this

window.AppView = Backbone.View.extend
 initialize : () ->
  this.render()
  _.bindAll this, 'addOne', 'addAll', 'render'   
  this.model.get('messages').bind 'add', this.addOne
  undefined

 render : () ->
  this.el.html ( _.template $('#app-template').html() )()
  undefined

 addOne : (message) ->
  this.$('.messages').append (new MessageView model: message).render().el
  undefined

 events :
  "keypress .newMessage" : "sendOnEnter"

 sendOnEnter : (e) ->
  if e.keyCode == 13
   this.model.command e.currentTarget.value
   $(e.currentTarget).val ''
  undefined