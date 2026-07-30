import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { useEffect, useState } from "react";
import { GraphModel } from "../../../../models/graph-model";
import { GraphRendComp } from "./graph-rend-comp";
import { coinService } from "../../../../services/coin-service";
import { notify } from "../../../../utils/notify";
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

    // Whether what's on screen came out of the saved file instead of the live feed.
    const [isBackup, setIsBackup] = useState(false);

    useEffect(()=>{

        // Prices from the old socket belong to the old coins, so drop them.
        setGraph([]);
        setIsBackup(false);

        // The effect can be torn down while the backup fetch is still in the air.
        let cancelled = false;

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

        }, async () => {

            // No live feed. Rather than leave the page empty, fill it from the saved
            // file -- one static price per coin, so the cards still have something to draw.
            try {
                const backup = await coinService.getBackupPrices(selectedCoins);
                if (cancelled) return;

                setGraph(backup);
                setIsBackup(true);
                notify.error("Live price feed is unavailable, showing saved prices instead.");
            }
            catch (err: any) {
                if (!cancelled) notify.error(err);
            }
        });

        // Runs on unmount, and before the effect re-runs when selectedCoins changes.
        return ()=> {
            cancelled = true;
            unsubscribe();
        };

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
                {isBackup && (
                    <p className="graph-backup-notice">
                        The live price feed couldn't be reached, so these graphs are drawn from the last saved market values in US dollars.
                        They won't move until the connection is back — reload the page to try again.
                    </p>
                )}

                {!isBackup && (
                    <p className="graph-instruction-text">
                        Below are live graphs for your selected coins. Each graph updates automatically as new market values arrive.
                    </p>
                )}

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
