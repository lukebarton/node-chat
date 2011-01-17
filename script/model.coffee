Message = Backbone.Model.extend
 body : undefined
 timestamp : undefined
 username : undefined
 initialize: (body) ->
  this.body = body

MessageList = Backbone.Collection.extend
 model : Message