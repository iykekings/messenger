"use strict";
var _cors = _interopRequireDefault(require("cors"));
var _express = _interopRequireDefault(require("express"));
var _http = require("http");
var _socketIo = require("socket.io");
var _ws = require("./ws");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var app = (0, _express).default();
var http = (0, _http).createServer(app);
var io = new _socketIo.Server(http, {
    cors: {
        origin: "http://localhost:3005",
        methods: [
            "GET",
            "POST"
        ]
    }
});
var USERSSOCKETS = [];
var USERS = [];
var PORT = process.env.PORT || 4005;
app.use((0, _cors).default());
app.get("/", function(_req, res) {
    res.status(200).json({
        message: "welcome to our chat server"
    });
});
io.on("connection", function(socket) {
    (0, _ws).handleSockets({
        server: io,
        socket: socket,
        users: USERS,
        usersSockets: USERSSOCKETS
    });
});
http.listen(PORT, function() {
    console.log("listening on http://localhost:4005");
});
