import { formatPrice, formatTime } from "./graph-format";

// One bar on the chart. Built on the client, because the socket only sends a
// last price. The comp that assembles these lives one level up, so the type is
// exported from here — the drawing is what defines the shape.
export type Candle = {
    time: number;   // Start of the bucket this candle covers
    open: number;   // First price seen in the bucket
    high: number;   // Highest price seen in the bucket
    low: number;    // Lowest price seen in the bucket
    close: number;  // Last price seen in the bucket
};

// How many candles fit on screen. Exported because the comp that builds them
// has to trim its list to exactly the number of slots drawn here.
export const MAX_CANDLES = 30;

// Drawing surface. Everything below is in these coordinates, the SVG scales itself to the card.
const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 280;
const PAD_LEFT = 66;    // Room for the price labels
const PAD_RIGHT = 14;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;  // Room for the time labels
const PLOT_WIDTH = VIEW_WIDTH - PAD_LEFT - PAD_RIGHT;
const PLOT_HEIGHT = VIEW_HEIGHT - PAD_TOP - PAD_BOTTOM;
const GRID_LINES = 5;

type CandleChartProp = {
    candles: Candle[];
    trend: string;
    coinName: string;
}

/* ============================================================================
   Micro comp — the candlestick chart itself.

   No state, no timers, no socket: it is handed a finished list of candles and
   turns it into pixels. Everything below is that translation — the price-to-
   pixel scale, the slot positions, the grid rows and the labels — which is a
   question of how the data is drawn, not of what the data is. It is only ever
   mounted with at least one candle.
   ============================================================================ */
export function CandleChartMicroComp(props: CandleChartProp) {

    const candles = props.candles;

    // Nothing to scale until the first tick lands.
    const highest = candles.length ? Math.max(...candles.map(c => c.high)) : 0;
    const lowest = candles.length ? Math.min(...candles.map(c => c.low)) : 0;

    // A flat price would divide by zero, so give it a tiny artificial range.
    const rawRange = highest - lowest;
    const padding = rawRange > 0 ? rawRange * 0.15 : (highest || 1) * 0.001;
    const top = highest + padding;
    const bottom = lowest - padding;
    const range = top - bottom || 1;

    // Price -> pixels. High prices sit near the top, so the axis is flipped.
    const scaleY = (price: number) => PAD_TOP + ((top - price) / range) * PLOT_HEIGHT;

    // Fixed slots, so the chart fills from the left instead of stretching two candles across the card.
    const slotWidth = PLOT_WIDTH / MAX_CANDLES;
    const bodyWidth = slotWidth * 0.6;
    const centerX = (index: number) => PAD_LEFT + slotWidth * (index + 0.5);

    // Evenly spaced price labels down the left side.
    const gridRows = Array.from({ length: GRID_LINES }, (_, i) => bottom + (range / (GRID_LINES - 1)) * i);

    // A time label under roughly every sixth candle, otherwise they overlap.
    const timeLabels = candles.filter((_, i) => i % 6 === 0);

    const last = candles[candles.length - 1];

    return (
        <svg className="graph-svg" viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img"
            aria-label={`Candlestick chart for ${props.coinName}`}>

            {/* Horizontal grid with its price label */}
            {gridRows.map(price => (
                <g key={price} className="graph-grid-row">
                    <line className="graph-grid-line"
                        x1={PAD_LEFT} y1={scaleY(price)}
                        x2={VIEW_WIDTH - PAD_RIGHT} y2={scaleY(price)} />
                    <text className="graph-axis-text"
                        x={PAD_LEFT - 10} y={scaleY(price)}
                        textAnchor="end" dominantBaseline="middle">
                        {formatPrice(price)}
                    </text>
                </g>
            ))}

            {/* Time labels along the bottom */}
            {timeLabels.map(candle => (
                <text key={candle.time} className="graph-axis-text"
                    x={centerX(candles.indexOf(candle))} y={VIEW_HEIGHT - 10}
                    textAnchor="middle">
                    {formatTime(candle.time)}
                </text>
            ))}

            {/* The candles themselves, wick first so the body sits on top */}
            {candles.map((candle, index) => {

                const rising = candle.close >= candle.open;
                const bodyTop = scaleY(Math.max(candle.open, candle.close));
                const bodyBottom = scaleY(Math.min(candle.open, candle.close));

                return (
                    <g key={candle.time} className={"graph-candle " + (rising ? "up" : "down")
                        + (index === candles.length - 1 ? " latest" : "")}>
                        <line className="graph-wick"
                            x1={centerX(index)} y1={scaleY(candle.high)}
                            x2={centerX(index)} y2={scaleY(candle.low)} />
                        <rect className="graph-body"
                            x={centerX(index) - bodyWidth / 2}
                            y={bodyTop}
                            width={bodyWidth}
                            // A candle that opened and closed the same would be invisible.
                            height={Math.max(bodyBottom - bodyTop, 1.5)}>
                            <title>{`${formatTime(candle.time)}  O ${formatPrice(candle.open)}  H ${formatPrice(candle.high)}  L ${formatPrice(candle.low)}  C ${formatPrice(candle.close)}`}</title>
                        </rect>
                    </g>
                );
            })}

            {/* Marker that follows the newest close */}
            <g className={"graph-live " + props.trend}>
                <line className="graph-live-line"
                    x1={PAD_LEFT} y1={scaleY(last.close)}
                    x2={VIEW_WIDTH - PAD_RIGHT} y2={scaleY(last.close)} />
                <circle className="graph-live-dot"
                    cx={centerX(candles.length - 1)} cy={scaleY(last.close)} r={4} />
            </g>

        </svg>
    );
}
