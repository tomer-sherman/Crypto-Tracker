import { useEffect, useRef, useState } from "react";
import { GraphModel } from "../../../../models/graph-model";
import { CoinChipMicroComp } from "../../home-comps/micro-comps/coin-chip-micro-comp";
import { Candle, CandleChartMicroComp, MAX_CANDLES } from "../micro-comps/candle-chart-micro-comp";
import { GraphReadoutMicroComp } from "../micro-comps/graph-readout-micro-comp";
import "./graph-rend-comp.css";


type GraphProps = {
    graph: GraphModel
}

// How much time each candle covers.
const BUCKET_MS = 10000;

/* ============================================================================
   Rendering comp — CHILD side. One coin's live candlestick card.

   All the heavy work of the reports page sits in here: swallowing a socket
   feed that pushes far faster than React can render, turning it into one
   sample a second, and folding those samples into candles. What the finished
   candles look like is not this comp's problem — that belongs to the chart
   micro comp below it, which is handed a list and draws it.
   ============================================================================ */
export function GraphRendComp(props: GraphProps) {

    const [candles, setCandles] = useState<Candle[]>([]);

    // The price actually shown on screen. Only the timer below is allowed to change it.
    const [price, setPrice] = useState<number | null>(null);

    // Every socket push is parked here. A ref and not state on purpose --
    // writing to it does NOT re-render, so the flood of pushes stays invisible.
    const pushedPrices = useRef<number[]>([]);

    useEffect(() => {

        const incoming = props.graph.price;
        if (!incoming || isNaN(incoming)) return;

        pushedPrices.current.push(incoming);

    }, [props.graph]);


    useEffect(() => {

        // Once a second we look at what the socket collected and take the newest value.
        const timer = setInterval(() => {

            const buffer = pushedPrices.current;
            const latest = buffer[buffer.length - 1];

            // Nothing has ever arrived yet, so there is nothing to draw.
            if (!latest) return;

            // Drop everything we already used, but keep the newest one:
            // if the next second brings no push at all, this is still the current price.
            pushedPrices.current = [latest];

            setPrice(latest);

            // Which 10 second slot this sample belongs to.
            const bucket = Math.floor(Date.now() / BUCKET_MS) * BUCKET_MS;

            setCandles(current => {

                const last = current[current.length - 1];

                // Same slot as the previous sample, so the candle grows instead of a new one appearing.
                if (last && last.time === bucket) {
                    const updated: Candle = {
                        ...last,
                        high: Math.max(last.high, latest),
                        low: Math.min(last.low, latest),
                        close: latest
                    };
                    return [...current.slice(0, -1), updated];
                }

                // New slot. It opens where the previous candle closed, so the chart has no gaps.
                const fresh: Candle = {
                    time: bucket,
                    open: last ? last.close : latest,
                    high: latest,
                    low: latest,
                    close: latest
                };

                // Keeping only the newest ones makes the chart scroll on its own.
                return [...current, fresh].slice(-MAX_CANDLES);
            });

        }, 1000);

        // Without this the timer would survive the unmount and keep setting state.
        return () => clearInterval(timer);

    }, []);


    const first = candles[0];
    const last = candles[candles.length - 1];
    const changePercent = first && first.open ? ((last.close - first.open) / first.open) * 100 : 0;
    const trend = changePercent >= 0 ? "up" : "down";

    return (
        <div className="CryptoGraph">

            <div className="graph-header">

                <CoinChipMicroComp coin={props.graph.coin} />

                <GraphReadoutMicroComp price={price} changePercent={changePercent} trend={trend} />

            </div>

            <div className="graph-chart">

                {candles.length === 0 && (
                    <p className="graph-waiting">Waiting for the first live tick...</p>
                )}

                {candles.length > 0 && (
                    <CandleChartMicroComp candles={candles} trend={trend} coinName={props.graph.coin.name} />
                )}

            </div>

        </div>
    );
}
