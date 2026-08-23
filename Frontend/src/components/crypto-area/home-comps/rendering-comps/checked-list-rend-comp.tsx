/*
    This file draws the area that holds the coins the user is tracking.
    It reads the selection from global state and shows either the welcome text or a row of coin chips.
    When a sixth coin is picked it also puts the maximum reached dialog on screen.
*/

import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { CoinChipMicroComp } from "../micro-comps/coin-chip-micro-comp";
import { WelcomeNoteMicroComp } from "../micro-comps/welcome-note-micro-comp";
import { ValidationDialogRendComp } from "./validation-dialog-rend-comp";
import "./checked-list-rend-comp.css";

// Shows the coins the user is tracking
export function CheckedListRendComp() {
    // Reads the tracked coins from global state
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);
    const count = selectedCoins.length;

    return (
        <div className="CheckedCoinList">

            {count === 6 && <ValidationDialogRendComp />}

            <div className="coins-dropzone">


                <div className="cards-inner-layout">
                    {count === 0 ? (
                        <WelcomeNoteMicroComp />
                    ) : (
                        selectedCoins.map(coin => <CoinChipMicroComp key={coin.id} coin={coin} />)
                    )}
                </div>

                <p className="limit-warning">👾 You can only select 5 crypto coins !!!</p>
            </div>

        </div>
    );
}
