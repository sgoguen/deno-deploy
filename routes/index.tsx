/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from "preact";
import { asset, Head } from "$fresh/runtime.ts";
import Footer from "../components/Footer.tsx";
import Layout from "../components/Layout.tsx";

export default function Home() {
  return (
    <Layout title="My Site">
      <Head>
        <title>Welcome to Steve's Fresh Site</title>
        {/* <link rel="stylesheet" href={asset("styles/bootstrap.min.css")} /> */}
        <link rel="stylesheet" type="text/css" href={asset("semantic.min.css")}/>
      </Head>
      <div>
        <h1 >Welcome</h1>
        <p>
          Welcome to `fresh`. Try update this message in the ./routes/index.tsx
          file, and refresh.
        </p>
      </div>
    </Layout>
  );
}
