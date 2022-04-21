/** @jsx h */

import { listenAndServe } from "https://deno.land/std/http/server.ts";
import { delay } from "https://deno.land/std@0.114.0/async/delay.ts";
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";
import { App } from './app.tsx';
import { serveStaticFromRequest } from "./static-content.ts";
import { Viewer } from "./viewer.tsx";

const sockets = new Set<WebSocket>();

function sendAll(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
  const count = sockets.size;
  console.log(`Sending to ${count} sockets`)
  sockets.forEach((s) => s.send(`<div id="test">${data}</div>`));
}

const channel = new BroadcastChannel("test");
const headers = { "Content-type": "text/html" };

channel.onmessage = (e) => {
  (e.target != channel) && channel.postMessage(e.data);
  sockets.forEach((s) => s.send(e.data));
};

console.clear();
await listenAndServe(":8080", async (r: Request) => {
  const { pathname } = new URL(r.url);
  try {

    console.log({ pathname })

    const res = await serveStaticFromRequest(r, "", './public/');
    if (res) { return res; }

    console.log('Upgrade header:  ', r.headers.get('upgrade'));
    
    const hasUpgradeWebsocket = r.headers.get("Upgrade") === "websocket";
    if(!hasUpgradeWebsocket) {
      const html = renderSSR(<App />);
      return new Response(html, { headers });
    }
    const { socket, response } = Deno.upgradeWebSocket(r);

    sockets.add(socket);
    socket.onmessage = (e) => {
      console.log('socket', e);
      const data = JSON.parse(e.data)
      // sendAll(`<pre>${JSON.stringify(data, null, "  ")}</pre>`);
      const html = renderSSR(<Viewer value={{data, e, headers: [1,2,3,4]}} />);
      sendAll(html);
    }
    socket.onclose = (_) => sockets.delete(socket);
    return response;
  } catch (e) {
    console.error(e);
    return new Response(e.message, { status: 500 });
  }
});



// async function sayHi() {
//   for (let i = 0; i < 500; i++) {
//     const message = `Hello ${i}`;
//     console.log('Sending to all', message);
//     sendAll(message);
//     await delay(10000);
//   }
// }

