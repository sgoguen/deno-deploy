import { extname } from "https://deno.land/std@0.110.0/path/mod.ts";
import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";


// Simple name and function, compact form, but not configurable
Deno.test("Get file extension", () => {
    const x = getExtension('test.css');
    assertEquals(x, '.css');
});

function getExtension(filename:string) {
    return extname(filename);
}

