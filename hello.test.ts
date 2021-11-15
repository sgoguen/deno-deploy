import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.114.0/async/delay.ts";

Deno.test("async hello world", async () => {
  const x = 1 + 2;

  // await some async task
  await delay(100);
  assertEquals(x, 3);

  if (x !== 3) {
    throw Error("x should be equal to 3");
  }
});

// // Simple name and function, compact form, but not configurable
// Deno.test("hello world #1", () => {
//     const x = 1 + 2;
//     assertEquals(x, 3);
// });

// // Fully fledged test definition, longer form, but configurable (see below)
// Deno.test({
//     name: "hello world #2",
//     fn: () => {
//         const x = 1 + 2;
//         assertEquals(x, 3);
//     },
// });