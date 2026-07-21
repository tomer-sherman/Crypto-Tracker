import { useState } from "react";
import { useSelector } from "react-redux";
import "./validation-dialog.css";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { SelectedCoinCard } from "../selected-coin-card/selected-coin-card";
import { coinService } from "../../../../services/coin-service";

export function ValidationDialog() {
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);

    // 1. New state to track if the modal is currently animating out
    const [isClosing, setIsClosing] = useState<boolean>(false);

    // 2. New handler that delays the actual unSelect function
    function handleClose(coinId: string) {
        setIsClosing(true); // Triggers the closing CSS class

        // Waits 400ms (the exact length of our CSS animation) before updating Redux
        setTimeout(() => {
            coinService.unSelectOnceCoin(coinId);
        }, 400);
    }

    return (
        /* 3. Apply the 'closing' class dynamically based on state */
        <div className={`validation-backdrop ${isClosing ? 'closing' : ''}`}>
            <div className="ValidationDialog">

                <h1>Maximum Coins Reached</h1>
                <p>You can select up to 5 coins. To add <strong>{selectedCoins[5]?.name}</strong>,</p>
                <p>you need to remove one of the coins below, or go back to the main page.</p>

                <div className="replace-list">
                    {selectedCoins.slice(0, 5).map(c => (
                        <div className="replace-item" key={c.id}>
                            <SelectedCoinCard coin={c} />

                            {/* 4. Point buttons to the new delayed handler */}
                            <button className="replace-btn" onClick={() => handleClose(c.id)}>Remove</button>
                        </div>
                    ))}
                </div>

                {/* 4. Point buttons to the new delayed handler */}
                <button className="back-btn" onClick={() => handleClose(selectedCoins[5]?.id)}>Go Back</button>

            </div>
        </div>
    );
}