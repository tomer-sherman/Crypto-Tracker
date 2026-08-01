/*
    This file draws one coin tile on the home grid.
    It decides if the price panel is open and picks that coin's prices out of the data already in global state.
    It also shows the checkbox that tracks or untracks the coin.
    The two micro components under it only display what they get.
*/

import { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { CoinInfoModel } from "../../../../models/coin-info-model";
import { coinService } from "../../../../services/coin-service";

import { CoinIdentityMicroComp, CoinProp } from "../micro-comps/coin-identity-micro-comp";
import { CoinPricesMicroComp } from "../micro-comps/coin-prices-micro-comp";
import "./coin-rend-comp.css";

// Draws one coin tile on the grid
export function CoinRendComp(props: CoinProp) {

    // Holds this coin's prices once loaded
    const [coinInfo, setCoinInfo] = useState<CoinInfoModel>();
    // Tells if the price panel is open
    const [flag, setFlag] = useState<boolean>(false);
    // Reads the tracked coins from global state
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);
    const isSelected = selectedCoins.some(c => c.id === props.coin.id);
    // Reads the prices of all hundred coins
    const hundredCoinsInfo = useSelector<AppState, CoinInfoModel[]>(state => state.coinsInfo);

    // Opens or closes the price panel
    async function triggerInfo() {
        const isOpening = !flag;
        setFlag(isOpening);

        if (isOpening && !coinInfo) {

            const singeCoinInfo = hundredCoinsInfo.find(c => c.id === props.coin.id);
            setCoinInfo(singeCoinInfo);
        }
    }

    // Adds or removes this coin from the selection
    async function triggerSelect() {
        isSelected ?
            coinService.unSelectOnceCoin(props.coin.id)
            : coinService.selectOneCoin(props.coin);
    }

    return (
        <div className="CryptoCard">
            <CoinIdentityMicroComp coin={props.coin} />

            <input
                type="checkbox"
                checked={isSelected}
                onChange={triggerSelect}
            />

            <button onClick={triggerInfo}>
                {flag ? "Close" : "More Info"}
            </button>

            <CoinPricesMicroComp coinInfo={coinInfo} isOpen={flag} />

            {flag && !coinInfo && <span className="loading-text">Fetching data...</span>}
        </div>
    );
}
