/*
    This file is the body of the reports page. It opens the price feeds for the
    selected coins, keeps the newest price of each coin in a ref, and once a
    second takes a snapshot and adds one point to every coin's chart. It also
    works out which coins are live, simulated or unavailable, and renders one
    graph card per selected coin.
*/

import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { useEffect, useRef, useState } from "react";
import { GraphModel, GraphSource } from "../../../../models/graph-model";
import { GraphRendComp } from "./graph-rend-comp";
import { GraphNoticeMicroComp } from "../micro-comps/graph-notice-micro-comp";
import { MAX_TICKS } from "../micro-comps/price-chart-micro-comp";
import { appendTick, Tick } from "../../../../utils/graph/tick-math";
import { graphService } from "../../../../services/graph-service";
import { notify } from "../../../../utils/notify";
import "./graph-list-rend-comp.css";


// How often the page reads and draws
const TICK_MS = 1000;


// Shows all the graph cards of the page
export function GraphListRendComp() {

    // Reads the selected coins from global state
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);

    // Holds the newest price per coin
    const latest = useRef(new Map<string, GraphModel>());

    // Holds the prices the cards show now
    const [graphs, setGraphs] = useState<GraphModel[]>([]);

    // Holds each coin's chart history
    const [ticks, setTicks] = useState(new Map<string, Tick[]>());

    // Opens the feeds and runs the clock
    useEffect(() => {

        let cancelled = false;
        // Placeholder until the feeds open
        let unsubscribe = () => { };

        // Reads seed prices then opens the feeds
        const start = async () => {

            let seeds: GraphModel[] = [];

            try {
                seeds = await graphService.getSeedPrices(selectedCoins);
            }
            catch (err: any) {
                notify.error(err);
            }

            if (cancelled) return;

            unsubscribe = graphService.subscribeToCoinPrices(selectedCoins, seeds, incoming => {
                latest.current.set(incoming.coin.id, incoming);
            });
        };

        start();

        const clock = window.setInterval(() => {

            const snapshot = selectedCoins
                .map(coin => latest.current.get(coin.id))
                .filter((graph): graph is GraphModel => !!graph);

            const bucket = Math.floor(Date.now() / TICK_MS) * TICK_MS;

            setTicks(current => {

                const next = new Map<string, Tick[]>();

                for (const coin of selectedCoins) {

                    const history = current.get(coin.id) ?? [];
                    const graph = snapshot.find(item => item.coin.id === coin.id);

                    if (!graph || graph.source === "unavailable" || !graph.price || isNaN(graph.price)) {
                        next.set(coin.id, history);
                        continue;
                    }

                    next.set(coin.id, appendTick(history, graph.price, bucket, MAX_TICKS));
                }

                return next;
            });

            setGraphs(snapshot);

        }, TICK_MS);

        return () => {
            cancelled = true;
            window.clearInterval(clock);
            unsubscribe();
        };

    }, [selectedCoins]);


    // Picks the selected coins with one source
    const inBucket = (source: GraphSource) => selectedCoins.filter(coin =>
        graphs.find(graph => graph.coin.id === coin.id)?.source === source);

    const live = inBucket("live");
    const simulated = inBucket("simulated");
    const unavailable = inBucket("unavailable");

    const ready = selectedCoins.length > 0
        && selectedCoins.every(coin => graphs.some(graph => graph.coin.id === coin.id));


    return (
        <div className="CryptoGraphList">

            <h1>Reports - current market value graphs</h1>

            <GraphNoticeMicroComp selected={selectedCoins} ready={ready}
                live={live} simulated={simulated} unavailable={unavailable} />

            {ready && selectedCoins.map(coin => (
                <GraphRendComp key={coin.id} coin={coin} ticks={ticks.get(coin.id) ?? []}
                    graph={graphs.find(graph => graph.coin.id === coin.id) ?? null} />
            ))}

        </div>
    );
}
