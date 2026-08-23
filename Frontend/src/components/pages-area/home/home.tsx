/*
    This file holds the Home page of the crypto tracker app.
    It is the main screen and it puts two pieces together on the page.
    On top it shows the list of coins the user picked, and under it the full
    list of the top 100 coins. The page itself only lays things out.
*/

import { CheckedListRendComp } from "../../crypto-area/home-comps/rendering-comps/checked-list-rend-comp";
import { ListRendComp } from "../../crypto-area/home-comps/rendering-comps/list-rend-comp";
import "./home.css";

// Shows the home page layout
export function Home() {

    return (
        <div className="Home">

            <h1 className="home-title">TOP 100 CRYPTO COINS</h1>

            <div className="checked-list-wrapper">
                <CheckedListRendComp />
            </div>

            <ListRendComp />
        </div>
    );
}
