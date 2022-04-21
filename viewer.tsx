/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

type ViewerProps = {
    value: unknown;
    maxDepth?: number;
}
export function Viewer(props: ViewerProps) {
    const maxDepth = props.maxDepth ?? 3;
    const value = props.value;
    const type = typeof value;
    const isArray = Array.isArray(value);
    //  If the type is a primitive type, render the value as a string.
    if (type === "string" || type === "number" || type === "boolean") {
        return <span>{value}</span>;
    }
    // If the type is a date, render the value as a string.
    if (value instanceof Date) {
        return <span>{value.toString()}</span>;
    }
    if (value === null || value === undefined) {
        return <span>null</span>;
    }
    // If the type is an object, but not an array, render the object as a table.
    if (typeof value === 'object' && !isArray) {
        if (value === null) {
            return <span>null</span>;
        }
        const keys = Object.keys(value);
        const o = value as { [key: string]: unknown };
        return (
            <table class="table table-bordered">
                <tbody>
                    {keys.map(key => <tr key={key}>
                        <td>{key}</td>
                        <td>
                            <Viewer value={o[key]} maxDepth={maxDepth} />
                        </td>
                    </tr>)}
                </tbody>
            </table>
        );


    }
    return <div>
        <div>Type: {type}, IsArray: {isArray}</div>
        <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>;
}