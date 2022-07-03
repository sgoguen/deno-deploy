/** @jsx h */
/** @jsxFrag Fragment */
import { h, } from "preact";
import { asset, Head } from "$fresh/runtime.ts";
import WebSlides from "../components/WebSlides.tsx";
import SmartTable from "../components/SmartTable.tsx";

export default function Home() {
  const myTable = [
    { name: "John", age: "30" },
    { name: "Jane", age: "25" },
  ]

  return (
    <WebSlides title="My Site">
      <section className="aligncenter">
        <h1 >Welcome</h1>
        <SmartTable data={myTable} />

      </section>
      <section class="fullscreen">
        <div class="card-50">
          <figure>
            <img src={asset("images/geometry.jpg")}/>
          </figure>
          <div class="flex-content">
            <h2>
              What is inspiration?
            </h2>
            <p>
              In Greek thought, inspiration meant that the poet or artist would go into ecstasy or furor poeticus, the divine frenzy or poetic madness. The Muses are the inspirational goddesses of literature, science, and the arts in Greek mythology.
            </p>
          </div>
        </div>
      </section>
    </WebSlides>
  );
}
