import { formatPrice } from "./graph-format";

type GraphReadoutProp = {
    price: number | null;
    changePercent: number;
    trend: string;
}

/* ============================================================================
   Micro comp — the live price readout in a graph header.

   Given a price, a session change and which way it is going, it draws them.
   The `null` price is the state before the first tick has landed.
   ============================================================================ */
export function GraphReadoutMicroComp(props: GraphReadoutProp) {
    return (
        <div className="graph-readout">
            <span className="graph-label">Live market value</span>
            <p className={"graph-price " + props.trend}>$: {props.price === null ? "..." : formatPrice(props.price)}</p>
            <span className={"graph-change " + props.trend}>
                {props.changePercent >= 0 ? "▲" : "▼"} {Math.abs(props.changePercent).toFixed(2)}%
            </span>
        </div>
    );
}
