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
    handleDisConnection(options);
    handleMessagesToUser(options);
    handleTyping(options);
    handleStopTyping(options);
}
function handleJoins(options) {
    var socket = options.socket, server = options.server, users = options.users;
    socket.on("join", function(name) {
        users.push({
            name: name,
            uuid: socket.id
        });
        server.to(socket.id).emit("accountCreated", {
            name: name,
            uuid: socket.id
        });
        server.emit("allUsers", users);
    });
}
function handleMessagesToUser(options) {
    var server = options.server, socket = options.socket, users = options.users;
    socket.on("sendMessageToUser", function(msg, id) {
        if (!users.find(function(u) {
            return u.uuid === id;
        })) return;
        server.to(id).to(socket.id).emit("recieveMessage", _objectSpread({
        }, msg, {
            from: socket.id,
            to: id,
            type: "message",
            time: new Date()
        }));
    });
}
function handleDisConnection(options) {
    var socket = options.socket, users = options.users, usersSockets = options.usersSockets;
    socket.on("disconnect", function() {
        var index = users.findIndex(function(u) {
            return u.uuid === socket.id;
        });
        if (index >= 0) {
            socket.broadcast.emit("userLeft", _objectSpread({
                sender: users[index].name,
                from: socket.id,
                to: "all",
                type: "disconnect"
            }, (0, _shared).defaultMessage()));
            var i = usersSockets.indexOf(socket);
            usersSockets.splice(i, 1);
            users.splice(index, 1);
            socket.broadcast.emit("allUsers", users);
        }
    });
}
function handleTyping(options) {
    var server = options.server, socket = options.socket, users = options.users;
    socket.on("typing", function(id) {
        var ref, ref1;
        var sender = (ref = users.find(function(u) {
            return u.uuid === socket.id;
        })) === null || ref === void 0 ? void 0 : ref.name;
        var receiver = (ref1 = users.find(function(u) {
            return u.uuid === id;
        })) === null || ref1 === void 0 ? void 0 : ref1.uuid;
        if (!receiver || !sender) return;
        server.to(id).emit("userTyping", socket.id);
    });
}
function handleStopTyping(options) {
    var server = options.server, socket = options.socket, users = options.users;
    socket.on("stoppedTyping", function(id) {
        var ref, ref1;
        var sender = (ref = users.find(function(u) {
            return u.uuid === socket.id;
        })) === null || ref === void 0 ? void 0 : ref.name;
        var receiver = (ref1 = users.find(function(u) {
            return u.uuid === id;
        })) === null || ref1 === void 0 ? void 0 : ref1.uuid;
        if (!receiver || !sender) return;
        server.to(id).emit("userStoppedTyping", socket.id);
    });
}
