const { WebSocket, WebSocketServer: WSS } = require("ws");

class WebSocketServer {
  static instance;

  constructor() {
    if (WebSocketServer.instance) {
      return WebSocketServer.instance;
    }

    this.wss = new WSS({ port: 8081 });
    this.wss.on("connection", (ws) => {
      console.log("Client connected");
      if (ws.readyState === WebSocket.OPEN) {
        ws.send("Hi");
      }
      ws.on("close", () => console.log("Client disconnected"));
    });

    WebSocketServer.instance = this;
  }

  static getInstance() {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer();
    }
    return WebSocketServer.instance;
  }

  broadcast(message) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

const WebSocketServerInstance = WebSocketServer.getInstance();

module.exports = { WebSocketServerInstance };
