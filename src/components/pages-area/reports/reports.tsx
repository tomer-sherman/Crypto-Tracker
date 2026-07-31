
import { GraphListRendComp } from "../../crypto-area/reports-comps/rendering-comps/graph-list-rend-comp";
import "./reports.css";

export function Reports() {
    return (
        <div className="Reports">

            {/* The page's one line of its own: what the body below is doing, and how
                often. Everything else on this page belongs to the list comp. */}
            <p>Live · one reading every second</p>

            <GraphListRendComp />

        </div>
    );
}
