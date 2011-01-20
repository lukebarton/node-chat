window.Message = Backbone.Model.extend
 body : undefined
 timestamp : undefined
 nick : undefined

window.Connection = Backbone.Model.extend
 initialize  : () ->
  messages = this.get('messages')
  @get('socket').connect()

  @get('socket').on 'connect', () ->
   @send 'NICK ' + prompt('nick:')


  @get('socket').on 'message', (data) ->
   messages.add(new Message(data))

  @get('socket').on 'disconnect', () ->
   undefined

 command : (message) ->
  if (message.charAt 0) is '/'
   ## We're handling a command ##
   rawCommand = message.substr 1

   parts = rawCommand.split ' '
   command = parts.shift()
   input = parts.join ' '

   switch command
    when 'quit' then return undefined
    else @get('socket').send rawCommand
  else
   ## We're sending a message to the current channel ##
   @get('socket').send 'MESSAGE ' + message


window.MessageList = Backbone.Collection.extend
 model : Message
