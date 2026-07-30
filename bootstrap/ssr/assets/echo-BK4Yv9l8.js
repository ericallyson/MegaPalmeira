import Echo from "laravel-echo";
import Pusher from "pusher-js";
window.Pusher = Pusher;
let instance = null;
function getEcho() {
  if (instance === null) {
    instance = new Echo({
      broadcaster: "reverb",
      key: "megapalmeira-local-key",
      wsHost: "localhost",
      wsPort: Number("8081"),
      wssPort: Number("8081"),
      forceTLS: false,
      enabledTransports: ["ws", "wss"]
    });
  }
  return instance;
}
function socketConectado() {
  return instance?.connector.pusher.connection.state === "connected";
}
export {
  getEcho,
  socketConectado
};
