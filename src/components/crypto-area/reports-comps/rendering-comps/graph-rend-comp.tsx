import { CoinModel } from "../../../../models/coin-model";
import { GraphModel } from "../../../../models/graph-model";
import { CoinChipMicroComp } from "../../home-comps/micro-comps/coin-chip-micro-comp";
import { Tick } from "../../../../utils/tick-math";
import { PriceChartMicroComp } from "../micro-comps/price-chart-micro-comp";
import { GraphReadoutMicroComp } from "../micro-comps/graph-readout-micro-comp";
import "./graph-rend-comp.css";


type GraphProps = {

    // Always given, so a card exists for every tracked coin from the moment the
    // page opens rather than appearing once its feed decides to speak.
    coin: CoinModel;

    // The newest price for this coin as of the current second, or null while the
    // feeds are still working out what this coin is.
    graph: GraphModel | null;

    // This coin's history so far, one reading per second. Empty until the feed
    // has produced something worth drawing.
    ticks: Tick[];
}

/* ============================================================================
   Rendering comp — CHILD side. One coin's live price card.

   No state and no timer. The clock, the sampling and the history all live one
   level up, in the comp that owns the feeds, because they are one rhythm for the
   whole page rather than five separate ones — this card is handed a finished
   second and assembles the pieces that draw it.

   It never asks where the price came from. A coin on the socket and a coin on a
   stand-in arrive through the same prop and are drawn the same way; the source
   only changes what the card says it is.
   ============================================================================ */
export function GraphRendComp(props: GraphProps) {

    const source = props.graph?.source ?? null;

    // A coin with no data has a price of 0 that means nothing, so it never
    // becomes a number this card will show.
    const price = props.graph && props.graph.source !== "unavailable" ? props.graph.price : null;

    const ticks = props.ticks;
    const first = ticks[0];
    const last = ticks[ticks.length - 1];

    // How far the coin has moved since this page was opened, which is as far back
    // as the chart goes.
    const changePercent = first && first.price ? ((last.price - first.price) / first.price) * 100 : 0;
    const trend = changePercent >= 0 ? "up" : "down";

    return (
        <div className={"CryptoGraph " + (source ?? "pending")}>

            <div className="graph-header">

                <CoinChipMicroComp coin={props.coin} />

                <GraphReadoutMicroComp price={price} changePercent={changePercent}
                    trend={trend} source={source} />

            </div>

            <div className="graph-chart">

                {/* A coin with nothing to draw is a settled answer, not a wait, so
                    it does not get the pulse the waiting message carries. */}
                {ticks.length === 0 && source === "unavailable" && (
                    <p className="graph-waiting none">No market data for this coin</p>
                )}

                {ticks.length === 0 && source !== "unavailable" && (
                    <p className="graph-waiting">Waiting for the first tick...</p>
                )}

                {ticks.length > 0 && (
                    <PriceChartMicroComp ticks={ticks} trend={trend} coinName={props.coin.name} />
                )}

            </div>

        </div>
    );
}
