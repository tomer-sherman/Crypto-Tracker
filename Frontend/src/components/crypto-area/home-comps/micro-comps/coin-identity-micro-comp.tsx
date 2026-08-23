/*
    This file shows the basic identity of one coin: its logo, its symbol and its name.
    It also declares the CoinProp type that every coin component in the app uses.
    It returns a fragment instead of a wrapper, because the cards around it style these elements as their own direct children.
*/

import { CoinModel } from "../../../../models/coin-model";

export type CoinProp = {
    coin: CoinModel;
}

// Shows a coin logo, symbol and name
export function CoinIdentityMicroComp(props: CoinProp) {
    return (
        <>
            <img src={props.coin.image} alt={props.coin.name} />
            <span>{props.coin.symbol.toUpperCase()}</span>
            <span>{props.coin.name}</span>
        </>
    );
}
