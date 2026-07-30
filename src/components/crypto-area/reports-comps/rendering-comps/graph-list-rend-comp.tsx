import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { useEffect, useState } from "react";
import { GraphModel } from "../../../../models/graph-model";
import { GraphRendComp } from "./graph-rend-comp";
import { coinService } from "../../../../services/coin-service";
import "./graph-list-rend-comp.css";


/* ============================================================================
   Rendering comp — LIST side. The reports page body.

   Owns the one socket the page runs on: it opens a subscription for whatever
   is currently tracked, keeps the newest price per coin, and tears the
   subscription down again the moment the selection changes. Each card it
   renders then handles its own chart.
   ============================================================================ */
export function GraphListRendComp() {

    const selectedCoins = useSelector<AppState, CoinModel[]>(state=> state.selectedCoins);
    const [graph , setGraph] = useState<GraphModel[]>([]);

    useEffect(()=>{

        // Prices from the old socket belong to the old coins, so drop them.
        setGraph([]);

        const unsubscribe = coinService.subscribeToCoinPrices(selectedCoins, incoming => {

            // Callback form, because pushes arrive far faster than React re-renders --
            // reading `graph` directly here would work off a stale array.
            setGraph(current => {
                const index = current.findIndex(g => g.coin.id === incoming.coin.id);
                if (index < 0) return [...current, incoming];

                const next = [...current];
                next[index] = incoming;
                return next;
            });
        });

        // Runs on unmount, and before the effect re-runs when selectedCoins changes.
        return unsubscribe;

    },[selectedCoins])

    // Rendering function to handle the conditional logic
    const rendering = ()=> {

        if (selectedCoins.length === 0) {
            return (
                <p className="graph-empty-state">
                    You haven't selected any coins yet. Please go back to the home page and select coins to use this Reports page feature.
                    Every coin you select gets a live graph here, updating in real time with its current market value.
                </p>
            );
        }

        return (
            <>
                <p className="graph-instruction-text">
                    Below are live graphs for your selected coins. Each graph updates automatically as new market values arrive.
                </p>
                {graph.map(g=> <GraphRendComp key={g.coin.id} graph={g} />)}
            </>
        );
    }

    return (
        <div className="CryptoGraphList">

            <h1>Reports - current market value graphs</h1>

            {/* Implementing the rendering function */}
            {rendering()}

        </div>
    );
}
