/*
    This file draws the list of AI insight cards on the recommendation page.
    It reads the coins the user is tracking and renders one card for each of them.
    Every card asks the AI on its own, so no data is fetched here.
*/

import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { InsightRendComp } from "./insight-rend-comp";
import "./insight-list-rend-comp.css";

// Lists one AI card per tracked coin
export function InsightListRendComp() {
    // Reads the tracked coins from global state
    const selectedCoins = useSelector<AppState, CoinModel[]>(state=>state.selectedCoins);


    return (
        <div className="AiInsightList">

			{selectedCoins.map(c=> <InsightRendComp key={c.id} coin={c} />)}

        </div>
    );
}
