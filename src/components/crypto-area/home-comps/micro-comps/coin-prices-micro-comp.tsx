/*
    This file shows the price panel of a coin tile.
    It prints the same coin's value in dollars, euros and shekels.
    It holds no state and fetches nothing, the tile above it decides when to open and passes the data down.
*/

import { CoinInfoModel } from "../../../../models/coin-info-model";

type CoinPricesProp = {
    coinInfo: CoinInfoModel | undefined;
    isOpen: boolean;
}

// Shows one coin's price in three currencies
export function CoinPricesMicroComp(props: CoinPricesProp) {
    return (
        <div className={`coin-info-wrapper ${props.isOpen && props.coinInfo ? "open" : ""}`}>
            <div className="coin-info-panel">
                <div className="coin-info-content">
                    {props.coinInfo && (
                        <>
                            <div className="price-row">
                                <span className="currency">$</span>
                                <span className="value">{props.coinInfo.usd.toLocaleString()}</span>
                            </div>
                            <div className="price-row">
                                <span className="currency">€</span>
                                <span className="value">{props.coinInfo.eur.toLocaleString()}</span>
                            </div>
                            <div className="price-row">
                                <span className="currency">₪</span>
                                <span className="value">{props.coinInfo.ils.toLocaleString()}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
