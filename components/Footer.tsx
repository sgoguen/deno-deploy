/** @jsx h */
import { h, } from "preact";


export default function Footer() {
    //  Show a basic copyright notice that's centered using Semantic UI
    return (
        <div>
            Copyright &copy; {new Date().getFullYear()} Steve's Fresh Site
        </div>
    );
}