/** @jsx h */
import { h } from "preact";
import WebSlides from "../components/WebSlides.tsx";
import Counter from '../islands/Counter.tsx';

type Lambda =
    | { type: 'var'; varId: string }
    | { type: 'application'; left: Lambda; right: Lambda }
    | { type: 'abstraction'; varId: string; body: Lambda };

type LambdaInput = Lambda | string;
type LambdaList = Array<LambdaInput>;
type Debruijn =
    | { type: 'var'; varId: number }
    | { type: 'application'; left: Debruijn; right: Debruijn }
    | { type: 'abstraction'; body: Debruijn };
const ivar = function (x: string): Lambda {
    return { type: 'var', varId: x };
};
const toLambda = function (x: Lambda | string): Lambda {
    if (typeof x === 'string') {
        return ivar(x);
    }
    return x;
};
function apply2(f: string | Lambda, x: string | Lambda): Lambda {
    return { type: 'application', left: toLambda(f), right: toLambda(x) };
}
function apply(...lambdas: (string | Lambda)[]): Lambda {
    if (lambdas.length === 0) {
        throw new Error('apply: invalid arguments');
    }
    if (lambdas.length === 1) {
        return toLambda(lambdas[0]);
    }
    let result: Lambda | undefined = undefined;
    for (const l of lambdas) {
        if (result) {
            result = apply2(result, l);
        } else {
            result = toLambda(l);
        }
    }
    if (!result) {
        throw new Error('apply: invalid arguments');
    }
    return result;
}
const lam = function (x: string, body: LambdaInput | LambdaList): Lambda {
    if (Array.isArray(body)) {
        return { type: 'abstraction', varId: x, body: apply(...body) };
    }
    return { type: 'abstraction', varId: x, body: toLambda(body) };
};
function debruijnEncode(l: Lambda): Debruijn {
    type VarRecord = Record<string, number>;
    const varRecord: { [key: string]: number } = {};
    function encode(l: Lambda, varRecord: VarRecord, stackSize: number): Debruijn {
        //  Here we substitue variables with numbers that act like stack offsets.
        //  This means innermost defined variables will have the lowest numbers when they
        //  are referenced.
        switch (l.type) {
            case 'abstraction':
                const newRecord = { ...varRecord, [l.varId]: stackSize };
                return {
                    type: 'abstraction',
                    body: encode(l.body, newRecord, stackSize + 1)
                };
            case 'var':
                return { type: 'var', varId: stackSize - varRecord[l.varId] - 1 };
            case 'application':
                return {
                    type: 'application',
                    left: encode(l.left, varRecord, stackSize),
                    right: encode(l.right, varRecord, stackSize)
                };
            default:
                throw new Error('Unknown lambda type');
        }
    }
    return encode(l, varRecord, 0);
}
const RosenburgString = {
    encode(z: number): [number, number] {
        const m = Math.floor(Math.sqrt(z));
        const m2 = m * m;
        if (z - m2 < m) {
            return [z - m2, m];
        } else {
            return [m, m2 + 2 * m - z];
        }
    },
    decode(x: number, y: number): number {
        //  r2(x, y) = sqr(max(x, y)) + max(x, y) + x − y
        const m = Math.max(x, y);
        return m * m + m + x - y;
    }
};
function debruijnDecode(d: Debruijn): Lambda {
    function decode(d: Debruijn, lastVar: number): Lambda {
        switch (d.type) {
            case 'var':
                return {
                    type: 'var',
                    varId: indexToVar(lastVar - d.varId - 1)
                };
            case 'application':
                return apply(decode(d.left, lastVar), decode(d.right, lastVar));
            case 'abstraction':
                return lam(indexToVar(lastVar), decode(d.body, lastVar + 1));
            default:
                throw new Error('Unknown debruijn type');
        }
    }
    return decode(d, 0);
}
function nToDebruijn(z: number): Debruijn {
    function encode(z: number, maxVar: number): Debruijn {
        if (z < maxVar) {
            return { type: 'var', varId: z };
        }
        z = z - maxVar;
        const t = z % 2;
        const n = Math.floor(z / 2);
        switch (t) {
            case 0:
                const [l, r] = RosenburgString.encode(n);
                return {
                    type: 'application',
                    left: encode(l, maxVar),
                    right: encode(r, maxVar)
                };
            case 1:
                return {
                    type: 'abstraction',
                    body: encode(n, maxVar + 1)
                };
            default:
                throw new Error(`${t} is not a valid remainer for ${n}`);
        }
    }
    return {
        type: 'abstraction',
        body: encode(z, 1)
    };
}
function debruijnToN(d: Debruijn): number {
    function decode(d: Debruijn, lastVar: number): number {
        switch (d.type) {
            case 'var':
                if (d.varId > lastVar) {
                    throw new Error(`${d.varId} is not a valid variable`);
                }
                return d.varId;
            case 'application':
                const left = decode(d.left, lastVar);
                const right = decode(d.right, lastVar);
                return RosenburgString.decode(left, right) * 2 + (lastVar + 1);
            case 'abstraction':
                const b = decode(d.body, lastVar + 1);
                return b * 2 + (lastVar + 2);
            default:
                throw new Error('Unknown debruijn type');
        }
    }
    if (d.type === 'abstraction') {
        return decode(d.body, 0);
    } else {
        throw new Error('Not a debruijn term');
    }
}
function indexToVar(i: number): string {
    return String.fromCharCode(97 + i);
}
const toString = function (lambda: Lambda): string {
    switch (lambda.type) {
        case 'var':
            return `${lambda.varId}`;
        case 'application':
            return `(${toString(lambda.left)} ${toString(lambda.right)})`;
        case 'abstraction':
            return `λ${toString(ivar(lambda.varId))}.${toString(lambda.body)}`;
    }
};
function toStringDebruijn<T>(lambda: Debruijn): string {
    switch (lambda.type) {
        case 'var':
            return `${lambda.varId}`;
        case 'application':
            return `(${toStringDebruijn(lambda.left)} ${toStringDebruijn(lambda.right)})`;
        case 'abstraction':
            return `[${toStringDebruijn(lambda.body)}]`;
    }
}
/*
Lambda culculus terms:
TRUE := λx.λy.x
FALSE := λx.λy.y
AND := λp.λq.p q p
OR := λp.λq.p p q
NOT := λp.p FALSE TRUE
IFTHENELSE := λp.λa.λb.p a b
Let's evaulate the following lambda, step by step:
    AND TRUE
    1. (λp.λq.p q p) (λx.λy.x)
    2. (λq.(λx.λy.x) q (λx.λy.x))
    3. (λq. (λy.q) (λx.λy.x))
    4. (λq. q)
    5. (λq. q) = ID
*/
const ID = lam('x', 'x');
const TRUE = lam('x', lam('y', 'x'));
const One = lam('f', lam('x', 'x'));
const Two = lam('f', lam('x', ['f', 'x']));
const Three = lam('f', lam('x', apply('f', apply('f', 'x'))));
const Four = lam('f', lam('x', apply('f', apply('f', apply('f', 'x')))));
const FALSE = lam('x', lam('y', 'y'));
const AND = lam('p', lam('q', ['p', 'q']));
const IFTHENELSE = lam('p', lam('a', lam('b', ['p', 'a', 'b'])));
// OR := λp.λq.p p q
const OR = lam('p', lam('q', ['p', 'p', 'q']));
const NOT = lam('p', apply('p', FALSE, TRUE));
const Y = lam(
    'f',
    lam(
        'x',
        apply(
            apply(ivar('f'), apply(ivar('x'), ivar('x'))),
            apply(ivar('f'), apply(ivar('x'), ivar('x')))
        )
    )
);
let ω = lam('x', apply('x', 'x'));
const expressions = {
    I: lam('x', 'x'),
    K: lam('x', lam('y', 'x')),
    S: lam('x', lam('y', lam('z', ['x', 'z', apply('y', 'z')]))),
    // B := λx.λy.λz.x (y z)
    B: lam('x', lam('y', lam('z', ['x', apply('y', 'z')]))),
    // C := λx.λy.λz.x z y
    C: lam('x', lam('y', lam('z', ['x', 'z', 'y']))),
    // W := λx.λy.x y y
    W: lam('x', lam('y', apply('x', 'y', 'y'))),
    // ω or Δ := λx.x x
    ω: ω,
    // Ω := ω ω
    // Ω: apply(ω, ω),
    // One, 
    // Two, 
    // Three, 
    // Four, 
    ID,
    TRUE,
    FALSE,
    AND,
    OR,
    Y,
    IFTHENELSE,
    NOT
};
const expressionInfo = Object.entries(expressions).map(([name, e]) => {
    const d = debruijnEncode(e);
    return {
        name,
        n: debruijnToN(d),
        expression: toString(e),
        debruijn: toStringDebruijn(d),
        debruijnString: toString(debruijnDecode(d))
    };
});
const countedExpressions = Array.from(
    (function* () {
        for (let i = 0; i < 10; i++) {
            const [l, r] = RosenburgString.encode(i);
            const d = nToDebruijn(i);
            const lam = debruijnDecode(d);
            const n = debruijnToN(d);
            yield {
                name: i,
                debruijn: toStringDebruijn(d),
                lambda: toString(lam),
                n: n
            };
        }
    })()
);


export default function Lambda() {
    return (
        <WebSlides title="Lambda Functions">
            <section>
                <h1>Lambda Functions</h1>
            </section>
            <section>
                <h1>Common Lambda Functions</h1>
                <SmartTable data={expressionInfo} />
            </section>
            <section>
                <h2>Counting Lambda Expressions</h2>
                <SmartTable data={countedExpressions} />
            </section>
            <section>
                <h2>Counter</h2>
                <Counter start={1} />
            </section>
        </WebSlides>
    );
}

type FieldType = undefined | null | string | number | boolean;
type DataTable = Record<string, FieldType>[];

function SmartTable({ data }: { data: DataTable }) {
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