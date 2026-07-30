import { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { CoinInfoModel } from "../../../../models/coin-info-model";
import { coinService } from "../../../../services/coin-service";
import { notify } from "../../../../utils/notify";
import { CoinIdentityMicroComp, CoinProp } from "../micro-comps/coin-identity-micro-comp";
import { CoinPricesMicroComp } from "../micro-comps/coin-prices-micro-comp";
import "./coin-rend-comp.css";

/* ============================================================================
   Rendering comp — CHILD side. One tile on the home grid.

   Everything a single tile has to decide for itself lives here and nowhere
   else: whether its price panel is open, fetching that panel's data the first
   time it is asked for, and whether this coin is currently tracked. The two
   micro comps below it just draw what they are handed.
   ============================================================================ */
export function CoinRendComp(props: CoinProp) {

    const [coinInfo, setCoinInfo] = useState<CoinInfoModel>();
    const [flag, setFlag] = useState<boolean>(false);
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);
    const isSelected = selectedCoins.some(c => c.id === props.coin.id);

    async function triggerInfo() {
        const isOpening = !flag;
        setFlag(isOpening);

        if (isOpening && !coinInfo) {
            coinService.getCoinInfo(props.coin.id)
                .then(coinInfo => setCoinInfo(coinInfo))
                .catch(err => notify.error(err.message));
        }
    }

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

            {/* NEW DESIGNED INFO PANEL WITH SMOOTH RESIZE WRAPPER */}
            <CoinPricesMicroComp coinInfo={coinInfo} isOpen={flag} />

            {/* Optional loading state while waiting for the API */}
            {flag && !coinInfo && <span className="loading-text">Fetching data...</span>}
        </div>
    );
}
