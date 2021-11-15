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
                <link rel="stylesheet" href="style.css" />
                <script src="htmx.min.js"></script>
            </head>
            <body>
                <h1 class="red">Hello world</h1>

                <h2>Post</h2>
                <div hx-ws="connect:/hi">
                    <div id="test">

                    </div>
                    <form hx-ws="send:submit">
                        <input name="chat_message" />
                        {/* <input type="submit" value="Send"/> */}
                    </form>

                </div>
            </body>
        </html>
    );
}