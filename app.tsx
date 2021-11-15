/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

export function App(props: any) {
    return (
        <html>
            <head>
                <title>Hello from JSX</title>
                <link rel="stylesheet" href="style.css"/>
                <script>
                    let ws = new WebSocket("ws://"+location.host);
                    ws.onmessage = e =&gt; pre.textContent += e.data+"\n"</script>
            </head>
            <body>
                <h1 class="red">Hello world</h1>
                <input onkeyup="event.key=='Enter'&amp;&amp;ws.send(this.value)"/>
                <pre id="pre"></pre>
            </body>
        </html>
    );
}