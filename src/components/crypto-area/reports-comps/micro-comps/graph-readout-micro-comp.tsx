/*
    This file draws the price readout inside a graph card header. It shows the
    current price, how far it has moved since the page opened, and a badge
    saying whether the number is real, simulated or missing. A null price means
    the first reading has not landed yet, so it shows dots instead.
*/

import { GraphSource } from "../../../../models/graph-model";
import { formatPrice } from "./graph-format";

type GraphReadoutProp = {
    price: number | null;
    changePercent: number;
    trend: string;

    source: GraphSource | null;
}

// Label text for each price source
const LABELS: Record<GraphSource, string> = {
    live: "Live market value",
    simulated: "Simulated market value",
    unavailable: "No market value"
};

// Badge text for each price source
const BADGES: Record<GraphSource, string> = {
    live: "Real data",
    simulated: "Mock data",
    unavailable: "No data"
};

// Draws the live price readout
export function GraphReadoutMicroComp(props: GraphReadoutProp) {

    const source = props.source;

    return (
        <div className="graph-readout">

            <span className="graph-label">{source ? LABELS[source] : "Connecting"}</span>

            <p className={"graph-price " + props.trend}>$: {props.price === null ? "..." : formatPrice(props.price)}</p>

            <div className="graph-readout-tags">

                {props.price !== null && (
                    <span className={"graph-change " + props.trend}>
                        {props.changePercent >= 0 ? "▲" : "▼"} {Math.abs(props.changePercent).toFixed(2)}%
                    </span>
                )}

                {source && <span className={"graph-source " + source}>{BADGES[source]}</span>}

            </div>

        </div>
    );
}
