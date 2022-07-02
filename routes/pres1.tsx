/** @jsx h */
/** @jsxFrag Fragment */
import { h, } from "preact";
import WebSlides from "../components/WebSlides.tsx";

export default function Home() {
    const title = "Presenation 1";
    return (
        <WebSlides title="Main">
            <section>
                <h1>Design for trust</h1>
            </section>
            {/* <!-- Slide 2 --> */}
            <section class="bg-primary">
                <div>
                    <h2>.wrap = container (width: 90%) with fadein</h2>
                </div>
            </section>
            <section>
                <p>It's nice</p>
            </section>

        </WebSlides>
    );
}
