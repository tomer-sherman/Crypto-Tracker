import { GraphSource } from "../../../../models/graph-model";
import { formatPrice } from "./graph-format";

type GraphReadoutProp = {
    price: number | null;
    changePercent: number;
    trend: string;

    // Null while the feed is still being worked out, which is the state a card
    // opens in and stays in for a few seconds.
    source: GraphSource | null;
}

// What each kind of feed calls its number, and the badge that goes under it.
// Both spelled out per source rather than derived, because the whole point of
// the badge is that a user reads it and knows exactly what they are looking at.
const LABELS: Record<GraphSource, string> = {
    live: "Live market value",
    simulated: "Simulated market value",
    unavailable: "No market value"
};

const BADGES: Record<GraphSource, string> = {
    live: "Real data",
    simulated: "Mock data",
    unavailable: "No data"
};

/* ============================================================================
   Micro comp — the live price readout in a graph header.

   Given a price, a session change, which way it is going and where any of it
   came from, it draws them. The `null` price is the state before the first
   reading has landed.

   Every card carries a badge, including the real ones. Marking only the
   simulated cards would leave "this is real market data" as something the user
   has to infer from the absence of a warning, and a number a user is going to
   read as real should have to say so.
   ============================================================================ */
export function GraphReadoutMicroComp(props: GraphReadoutProp) {

    const source = props.source;

    return (
        <div className="graph-readout">

            <span className="graph-label">{source ? LABELS[source] : "Connecting"}</span>

            <p className={"graph-price " + props.trend}>$: {props.price === null ? "..." : formatPrice(props.price)}</p>

            <div className="graph-readout-tags">

                {/* Nothing has been drawn yet, so there is no change to report --
                    a 0.00% here would read as a measurement rather than a blank. */}
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
