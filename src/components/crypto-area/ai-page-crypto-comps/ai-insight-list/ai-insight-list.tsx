import { useSelector } from "react-redux";
import "./ai-insight-list.css";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { AiInsightCard } from "../ai-insight-card/ai-insight-card";

export function AiInsightList() {
    const selectedCoins = useSelector<AppState, CoinModel[]>(state=>state.selectedCoins);


    return (
        <div className="AiInsightList">

			{selectedCoins.map(c=> <AiInsightCard key={c.id} coin={c} />)}

        </div>
    );
}
