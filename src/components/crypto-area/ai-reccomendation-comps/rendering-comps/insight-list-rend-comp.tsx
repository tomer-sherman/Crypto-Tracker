import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { InsightRendComp } from "./insight-rend-comp";
import "./insight-list-rend-comp.css";

/* ============================================================================
   Rendering comp — LIST side. The grid of AI cards.

   It reads the tracked coins and lays out one card per coin. Nothing else:
   each card runs its own request, so there is no shared fetching here.
   ============================================================================ */
export function InsightListRendComp() {
    const selectedCoins = useSelector<AppState, CoinModel[]>(state=>state.selectedCoins);


    return (
        <div className="AiInsightList">

			{selectedCoins.map(c=> <InsightRendComp key={c.id} coin={c} />)}

        </div>
    );
}
