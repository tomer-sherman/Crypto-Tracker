import { CoinInfoModel } from "../../../../models/coin-info-model";

type CoinPricesProp = {
    coinInfo: CoinInfoModel | undefined;
    isOpen: boolean;
}

/* ============================================================================
   Micro comp — the three-currency price panel of a grid tile.

   Purely how a CoinInfoModel is shown. It owns no state and fetches nothing:
   the tile above it decides when to open and hands the data down.

   No stylesheet of its own — the panel is styled from coin-rend-comp.css, which
   anchors these classes to `.CryptoList .CryptoCard` so they cannot leak.
   ============================================================================ */
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
