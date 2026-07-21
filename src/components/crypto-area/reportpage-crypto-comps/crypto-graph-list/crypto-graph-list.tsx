import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { coinService } from "../../../../services/coin-service";
import { notify } from "../../../../utils/notify";
import { CryptoGraph } from "../crypto-graph/crypto-graph";
import "./crypto-graph-list.css";
import { appConfig } from "../../../../utils/app-config";

// The shape of the raw object coming from the API
export type CoinCurrencyGraphModel = {
    [coinSymbol: string]: {
        USD: number;
    }
}

export function CryptoGraphList() {
    // Start with an empty object, not an array!
    const [graphs, setGraphs] = useState<CoinCurrencyGraphModel>({});

    // Pull the user's selections from global state
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);

    useEffect(() => {
        if (selectedCoins.length === 0) return;

        // Build the string: "BTC,ETH,BNB"
        const symbolString = selectedCoins.map(c => c.symbol).join(",");

        coinService.getCoinGraph(appConfig.selectedCoinsValueUrl+symbolString)
            .then(graphsObject => setGraphs(graphsObject))
            .catch(err => notify.error(err.message));

    }, []); // Runs exactly once when this view loads!

    return (
        <div className="CryptoGraphList">
            {/* Object.entries breaks the main object down so React can render multiple graphs */}
            {Object.entries(graphs).map(([symbol, value]) => (
                <CryptoGraph
                    key={symbol}
                    symbol={symbol}
                    price={value.USD}
                />
            ))}
        </div>
    );
}