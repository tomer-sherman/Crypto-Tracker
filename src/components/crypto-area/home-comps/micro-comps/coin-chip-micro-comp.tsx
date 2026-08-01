/*
    This file holds the small coin chip used all around the app.
    It just wraps the coin identity part in a card element.
    The tracked coins area, the maximum reached dialog and the AI cards all reuse it.
*/

import { CoinIdentityMicroComp, CoinProp } from "./coin-identity-micro-comp";
import "./coin-chip-micro-comp.css";

// Shows a small card for one coin
export function CoinChipMicroComp(props: CoinProp) {
    return (
        <div className="CryptoCard">
            <CoinIdentityMicroComp coin={props.coin} />
        </div>
    );
}
