/*
    This file draws the price card for a single coin on the reports page. It
    puts together the coin chip, the price readout and the chart, and works out
    how far the price has moved since the page was opened. It holds no state and
    no timer, everything it draws is handed to it by the list comp above.
*/

import { CoinModel } from "../../../../models/coin-model";
import { GraphModel } from "../../../../models/graph-model";
import { CoinChipMicroComp } from "../../home-comps/micro-comps/coin-chip-micro-comp";
import { Tick } from "../../../../utils/graph/tick-math";
import { PriceChartMicroComp } from "../micro-comps/price-chart-micro-comp";
import { GraphReadoutMicroComp } from "../micro-comps/graph-readout-micro-comp";
import "./graph-rend-comp.css";


type GraphProps = {

    coin: CoinModel;

    graph: GraphModel | null;

    ticks: Tick[];
}

// Draws one coin's live price card
export function GraphRendComp(props: GraphProps) {

    const source = props.graph?.source ?? null;

    const price = props.graph && props.graph.source !== "unavailable" ? props.graph.price : null;

    const ticks = props.ticks;
    const first = ticks[0];
    const last = ticks[ticks.length - 1];

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
