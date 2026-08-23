/*
    This file holds the dialog that appears when the user picks a sixth coin.
    It lists the five coins already tracked and lets the user drop one of them or go back.
    The removal is delayed by the length of the closing animation, so the dialog can finish sliding away before the state changes.
*/

import { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { coinService } from "../../../../services/coin-service";
import { CoinChipMicroComp } from "../micro-comps/coin-chip-micro-comp";
import "./validation-dialog-rend-comp.css";

// Shows the maximum coins reached dialog
export function ValidationDialogRendComp() {
    // Reads the tracked coins from global state
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);

    // Tells if the dialog is animating out
    const [isClosing, setIsClosing] = useState<boolean>(false);

    // Closes the dialog then removes the coin
    function handleClose(coinId: string) {
        setIsClosing(true);

        setTimeout(() => {
            coinService.unSelectOnceCoin(coinId);
        }, 400);
    }

    return (
        <div className={`validation-backdrop ${isClosing ? 'closing' : ''}`}>
            <div className="ValidationDialog">

                <h1>Maximum Coins Reached</h1>
                <p>You can select up to 5 coins. To add <strong>{selectedCoins[5]?.name}</strong>,</p>
                <p>you need to remove one of the coins below, or go back to the main page.</p>

                <div className="replace-list">
                    {selectedCoins.slice(0, 5).map(c => (
                        <div className="replace-item" key={c.id}>
                            <CoinChipMicroComp coin={c} />

                            <button className="replace-btn" onClick={() => handleClose(c.id)}>Remove</button>
                        </div>
                    ))}
                </div>

                <button className="back-btn" onClick={() => handleClose(selectedCoins[5]?.id)}>Go Back</button>

            </div>
        </div>
    );
}
