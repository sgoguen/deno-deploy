import { join } from "https://deno.land/std@0.110.0/path/mod.ts";
import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { mapToFile, serveStatic } from "./static-content.ts";

Deno.test("Parse a url", () => {
    const url = new URL("https://www.example.com/path/to/file.html?query=string#hash");
    assertEquals(url.protocol, "https:");
    assertEquals(url.host, "www.example.com");
    assertEquals(url.pathname, "/path/to/file.html");
    assertEquals(url.search, "?query=string");
    assertEquals(url.hash, "#hash");

});

Deno.test("Map a URL to a mapped folder", () => {
    const url = new URL("https://www.example.com/path/to/file.html?query=string#hash");
    const mapped = mapToFile(url, "", "/static");
    assertEquals(mapped, "/static/path/to/file.html");
});

Deno.test("Map a URL to a mapped folder with a file", async () => {
    const url = new URL("https://www.example.com/style.css?query=string#hash");
    const response = await serveStatic(url, "", "./public/");
    if (!response) {
        throw new Error("Response is null");
    }
    assertEquals(response.status, 200);
    assertEquals(response.headers.get("Content-Type"), "text/css");

    const responseText = await response.text();
    const file = await Deno.readTextFile(join(Deno.cwd(), "public/style.css"));
    assertEquals(responseText, file);
});