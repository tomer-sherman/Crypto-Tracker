import { CheckedListRendComp } from "../../crypto-area/home-comps/rendering-comps/checked-list-rend-comp";
import { ListRendComp } from "../../crypto-area/home-comps/rendering-comps/list-rend-comp";
import "./home.css";

export function Home() {

    return (
        <div className="Home">

            {/* Added a class name to the header */}
            <h1 className="home-title">TOP 100 CRYPTO COINS</h1>

            {/* Wrapped the list so we can scale it down cleanly.
                The dropzone also owns the "maximum reached" dialog now. */}
            <div className="checked-list-wrapper">
                <CheckedListRendComp />
            </div>

            <ListRendComp />
        </div>
    );
}
