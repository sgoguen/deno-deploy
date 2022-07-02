/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, ComponentChildren } from "preact";
import { asset, Head } from "$fresh/runtime.ts";

export default function Layout({ children, title }: { title: string, children: ComponentChildren }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="stylesheet" type="text/css" href={asset("semantic.min.css")} />
            </Head>

            <div class="ui fixed inverted menu">
                <div class="ui container">
                    <div class="header item">
                        <a href="/">Home</a>
                    </div>
                    <div class="item">
                        <a href="/about">About</a>
                    </div>
                </div>
            </div>

            <div class="ui main text container" style={{ marginTop: "5em" }}>
                <h1 class="ui header">{title}</h1>

                {children}
            </div>
        </>
    );
}