// import { petstore } from './petstore.ts';
// import { expect } from 'https://deno.land/x/expect/expect.ts';
// import { OpenAPIV3 } from './open-api-types.ts';



// Deno.test("Process Swagger", () => {
//     //  Generate Database Schema from Petstore
//     const schemas = petstore.components.schemas;

//     // .map(s => {
//     //     return {
//     //         name: s.name,
//     //         schema: s.schema
//     //     }
//     // });

//     expect(schemas).toBeTruthy();
// });

// function getValue<TRecord extends Record<string, unknown>, TKey extends keyof TRecord>(obj: TRecord, path: TKey): TRecord[TKey] {
//     return obj[path];
// }

// interface RecordShaper<TRecord extends Record<string, unknown>> {
//     getValue<TKey extends keyof TRecord>(key: TKey): TRecord[TKey];
// }

// function getShaper<TRecord extends Record<string, unknown>>(obj: TRecord): RecordShaper<TRecord> {
//     return {
//         getValue: (key) => obj[key]
//     }
// }


// Deno.test("Process Swagger", () => {
// }

// const pet = getShaper(petstore.components.schemas.Pet.properties);
// const id = pet.getValue("id");