/** @jsx h */
import { h } from "preact";

type FieldType = undefined | null | string | number | boolean;
type DataTable = Record<string, FieldType>[];

export default function SmartTable({ data }: { data: DataTable }) {
    const fieldNames = [...getFieldNames(data)];
    return (
        <table className="ui compact collapsing table">
            <thead>
                <tr>
                    {fieldNames.map(name => (
                        <th class="border" key={name}>{name}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        {fieldNames.map(name => (
                            <td class="border" key={name}>{row[name]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function getFieldNames(data: DataTable): Set<string> {
    return new Set(data.flatMap(r => Object.keys(r)));
}