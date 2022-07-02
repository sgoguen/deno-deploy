/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, ComponentChildren } from "preact";
import { asset, Head } from "$fresh/runtime.ts";
import Footer from "../components/Footer.tsx";
import Layout from "../components/Layout.tsx";

export default function WebSlides({ title, children }: { title: string, children: ComponentChildren }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                {/* <!-- Google Fonts --> */}
                <link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,700,700i%7CMaitree:200,300,400,600,700&amp;subset=latin-ext" rel="stylesheet" />

                {/* <!-- CSS Base --> */}
                <link rel="stylesheet" type='text/css' media='all' href={asset("webslides/css/webslides.css")} />

                {/* <!-- Optional - CSS SVG Icons (Font Awesome) --> */}
                <link rel="stylesheet" type='text/css' media='all' href={asset("webslides/css/svg-icons.css")} />

                {/* <link rel="stylesheet" type="text/css" href={asset("semantic.min.css")} /> */}
            </Head>

            <main role="main">
                <article id="webslides">
                    {children}
                </article>
            </main>

            <script src={asset("webslides/js/webslides.js")}></script>

            <script>
                window.ws = new WebSlides();
            </script>
        </>
    );
}
