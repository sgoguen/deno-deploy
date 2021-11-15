/** @jsx h */
import { extname } from "https://deno.land/std@0.110.0/path/mod.ts";
import { listenAndServe } from "https://deno.land/std/http/server.ts";
import { delay } from "https://deno.land/std@0.114.0/async/delay.ts";
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";
import { App } from './app.tsx';

// console.clear();

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

sayHi();

await listenAndServe(":8080", async (r: Request) => {
  const { pathname } = new URL(r.url);
  try {

    console.log({ pathname })

    const files = ["connect.js", "style.css", "htmx.min.js"];
    const res = await checkFile(new Set(files));
    if (res) { return res; }

    const { socket, response } = Deno.upgradeWebSocket(r);

    sockets.add(socket);
    socket.onmessage = (e) => {
      console.log('socket', e);
      const data = JSON.parse(e.data)
      sendAll(`<pre>${JSON.stringify(data, null, "  ")}</pre>`);
    }
    // socket.onmessage = channel.onmessage as any;
    socket.onclose = (_) => sockets.delete(socket);
    return response;
  } catch {
    const html = renderSSR(<App />);
    return new Response(html, { headers });
  }

  async function checkFile(filenames: Set<string>) {
    const contentTypes: Record<string, string> = {
      '.css': 'text/css',
      '.js': 'text/javascript'
    };


    for (const f of filenames) {
      // Check if the request is for style.css.
      const ext = extname(f);
      const contentType = contentTypes[ext];

      if (pathname.startsWith(`/${f}`)) {
        // Read the style.css file from the file system.
        const file = await Deno.readFile(f);
        // Respond to the request with the style.css file.
        return new Response(file, {
          headers: {
            "content-type": `${contentType}`,
          },
        });
      }
    }
    return null;
  }
});

async function sayHi() {
  for (let i = 0; i < 500; i++) {
    const message = `Hello ${i}`;
    console.log('Sending to all', message);
    sendAll(message);
    await delay(1000);
  }
}

