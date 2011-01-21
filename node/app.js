console.log(require.paths);
var http = require('http'),
    io = require('socket.io'), // for npm, otherwise use require('./path/to/socket.io')
    _ = require('underscore'),

server = http.createServer(function(req, res){
 // your normal server code
 res.writeHeader(200, {'Content-Type': 'text/html'});
 res.writeBody('<h1>Hello world</h1>');
 res.finish();
});
server.listen(1234);


var ChatServer = {
    socket : undefined,
    nickBlacklist : [
        'system',
        'fuck',
        'shit',
        'cunt',
        'wanker',
        'wank'
    ],
    systemMessage : function (message) {
        return {
            nick    : 'SYSTEM',
            body        : message ,
            timestamp   : 'foo'
        };
    },
    init : function () {
        server = this;
        socket = this.socket;

        socket.on('connection', function(client){

            client.on('message', function(rawCommand){
                var parts = rawCommand.split(' ');
                var command = parts.shift().toUpperCase();
                var input = parts;
                var rawInput = parts.join(' ');

                if (command === 'NICK') {
                    var nick = input[0].trim();
                    if (server.isValidNick(nick)) {
                        if (client.nick !== undefined) {
                            socket.broadcast(server.systemMessage(client.nick + ' changed their nick to ' + nick));
                        } else {
                            socket.broadcast(server.systemMessage(nick + ' joined the chat'));
                        }
                        client.nick = nick;
                    } else {
                        client.send(server.systemMessage('Invalid Nick: `' + nick + '`'));
                    }
                } else if (client.nick !== undefined) {
                    switch (command) {
                        case 'MESSAGE':
                            socket.broadcast({ nick : client.nick, body : rawInput, timestamp : 'foo' });
                        break;
                        default:
                            client.send(server.systemMessage('Unrecognised Command: ' + rawCommand, client));
                        break;
                    }
                } else {
                    client.send(server.systemMessage('Access Denied: You must set a nick via `/nick <nick>` first'));
                }

            });

        });

        socket.on('clientDisconnect', function(client){
            if (client.nick) {
                console.log('DISCONNECT ' + client.nick);
                socket.broadcast(server.systemMessage(client.nick + ' Disconnected');
            }
        });
    },
    isValidNick : function (nick) {
        if (nick.length < 3 || _.indexOf(this.nickBlacklist, nick.toLowerCase()) > -1) {
            return false;
        } else {
            return true;    
        }

    }

};

// socket.io
var socket = io.listen(server);
ChatServer.socket = socket;
ChatServer.init();

