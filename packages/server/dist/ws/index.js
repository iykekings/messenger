"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleSockets = handleSockets;
var _shared = require("@chat/shared");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function handleSockets(options) {
    handleJoins(options);
    handleMessages(options);
    handleDisConnection(options);
}
function handleJoins(options) {
    var socket = options.socket, server = options.server, users = options.users;
    socket.on("joinChat", function(name) {
        users.push({
            name: name,
            uuid: socket.id
        });
        socket.broadcast.to(socket.id).emit("newUser", _objectSpread({
            sender: name,
            uuid: socket.id,
            type: "join"
        }, (0, _shared).defaultMessage()));
        server.to(socket.id).emit("allUsers", users);
    });
}
function handleMessages(options) {
    var server = options.server, socket = options.socket;
    socket.on("sendMessage", function(msg) {
        server.to(socket.id).emit("recieveMessage", _objectSpread({
        }, msg, {
            uuid: socket.id,
            time: new Date(),
            type: "message",
            sameUser: msg.sender === socket.id
        }));
    });
}
function handleDisConnection(options) {
    var server = options.server, socket = options.socket, users = options.users, usersSockets = options.usersSockets;
    socket.on("disconnect", function() {
        var index = users.findIndex(function(u) {
            return u.uuid === socket.id;
        });
        if (index >= 0) {
            server.to(socket.id).emit("userLeft", _objectSpread({
                sender: users[index].name,
                uuid: socket.id,
                type: "disconnect"
            }, (0, _shared).defaultMessage()));
            var i = usersSockets.indexOf(socket);
            usersSockets.splice(i, 1);
            users.splice(index, 1);
        }
    });
}
