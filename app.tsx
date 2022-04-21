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
                <link href="bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"/>
                <script src="bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"></script>
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