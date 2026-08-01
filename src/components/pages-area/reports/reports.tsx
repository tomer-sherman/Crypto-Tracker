/*
    This file holds the Reports page of the crypto tracker app.
    It shows a live view of the prices for the coins the user selected.
    The page itself is very small, it just prints a short line about the live
    updates and then renders the graph list component that does the real work.
*/

import { GraphListRendComp } from "../../crypto-area/reports-comps/rendering-comps/graph-list-rend-comp";
import "./reports.css";

// Shows the live reports page
export function Reports() {
    return (
        <div className="Reports">

            <p>Live · one reading every second</p>

            <GraphListRendComp />

        </div>
    );
}
