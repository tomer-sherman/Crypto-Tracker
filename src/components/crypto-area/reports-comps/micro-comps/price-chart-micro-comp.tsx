import { useId } from "react";
import { Tick } from "../../../../utils/tick-math";
import { formatAxisPrice, formatPrice, formatTime } from "./graph-format";

// How many readings fit on screen. Exported because the comp that collects them
// has to trim its list to exactly the number of slots drawn here. At one reading
// a second this is also the length of the window: a minute of history, scrolling.
export const MAX_TICKS = 60;

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

type PriceChartProp = {
    ticks: Tick[];
    trend: string;
    coinName: string;
}

/* ============================================================================
   Micro comp — the price chart itself.

   No state, no timers, no socket: it is handed a finished list of readings and
   turns it into pixels. Everything below is that translation — the price-to-
   pixel scale, the slot positions, the grid rows and the labels — which is a
   question of how the data is drawn, not of what the data is. It is only ever
   mounted with at least one reading.

   A line and not a candlestick, because there is exactly one price per second
   and nothing else. A candle needs a high and a low inside its period to have
   anything to draw; with a single reading its body is just "last second's price
   to this one" and its wick does not exist, which is a bar chart wearing a
   candlestick's clothes. One value per bucket is a line, so it is drawn as one —
   with a dot on every reading, so a second in which the price held still is
   still visibly a second that was taken.
   ============================================================================ */
export function PriceChartMicroComp(props: PriceChartProp) {

    const ticks = props.ticks;

    // The fill under the line is painted through a gradient, and several of these
    // charts share a page -- a hard-coded id would have every card drawing out of
    // whichever one mounted last.
    const fillId = useId();

    const prices = ticks.map(tick => tick.price);
    const highest = Math.max(...prices);
    const lowest = Math.min(...prices);

    // A flat price would divide by zero, so give it a tiny artificial range.
    const rawRange = highest - lowest;
    const padding = rawRange > 0 ? rawRange * 0.15 : (highest || 1) * 0.001;
    const top = highest + padding;
    const bottom = lowest - padding;
    const range = top - bottom || 1;

    // Price -> pixels. High prices sit near the top, so the axis is flipped.
    const scaleY = (price: number) => PAD_TOP + ((top - price) / range) * PLOT_HEIGHT;

    // Fixed slots, so the line grows from the left one second at a time instead
    // of two readings stretching across the whole card.
    const slotWidth = PLOT_WIDTH / MAX_TICKS;
    const pointX = (index: number) => PAD_LEFT + slotWidth * (index + 0.5);

    // Evenly spaced price labels down the left side. The gap between two of them
    // is what decides how many digits their labels need.
    const gridStep = range / (GRID_LINES - 1);
    const gridRows = Array.from({ length: GRID_LINES }, (_, i) => bottom + gridStep * i);

    // A time label under roughly every tenth reading, otherwise they overlap.
    const timeLabels = ticks.filter((_, i) => i % 10 === 0);

    const points = ticks.map((tick, index) => `${pointX(index)},${scaleY(tick.price)}`).join(" ");

    const last = ticks[ticks.length - 1];
    const lastX = pointX(ticks.length - 1);
    const lastY = scaleY(last.price);

    // The same line dropped to the floor at both ends, which closes it into a
    // shape the fill can be painted inside.
    const floor = VIEW_HEIGHT - PAD_BOTTOM;
    const area = `${pointX(0)},${floor} ${points} ${lastX},${floor}`;

    return (
        <svg className={"graph-svg " + props.trend} viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img"
            aria-label={`Price chart for ${props.coinName}, ${ticks.length} readings, latest ${formatPrice(last.price)} dollars`}>

            <defs>
                {/* Both stops are left to the stylesheet, so the colour of a
                    rising and a falling chart stays beside every other colour
                    decision on this card rather than being set here. */}
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop className="graph-fill-top" offset="0%" />
                    <stop className="graph-fill-bottom" offset="100%" />
                </linearGradient>
            </defs>

            {/* Horizontal grid with its price label */}
            {gridRows.map(price => (
                <g key={price} className="graph-grid-row">
                    <line className="graph-grid-line"
                        x1={PAD_LEFT} y1={scaleY(price)}
                        x2={VIEW_WIDTH - PAD_RIGHT} y2={scaleY(price)} />
                    <text className="graph-axis-text"
                        x={PAD_LEFT - 10} y={scaleY(price)}
                        textAnchor="end" dominantBaseline="middle">
                        {formatAxisPrice(price, gridStep)}
                    </text>
                </g>
            ))}

            {/* Time labels along the bottom */}
            {timeLabels.map(tick => (
                <text key={tick.time} className="graph-axis-text"
                    x={pointX(ticks.indexOf(tick))} y={VIEW_HEIGHT - 10}
                    textAnchor="middle">
                    {formatTime(tick.time)}
                </text>
            ))}

            <polygon className="graph-area" fill={`url(#${fillId})`} points={area} />

            <polyline className="graph-line" points={points} />

            {/* One dot per reading. This is what makes the tick visible: a second
                that repeated the last price draws a flat segment, but it still
                puts a new dot at the end of it. */}
            {ticks.map((tick, index) => (
                <circle key={tick.time} className="graph-point"
                    cx={pointX(index)} cy={scaleY(tick.price)} r={1.8}>
                    <title>{`${formatTime(tick.time)}   $ ${formatPrice(tick.price)}`}</title>
                </circle>
            ))}

            {/* Marker that follows the newest reading */}
            <g className={"graph-live " + props.trend}>
                <line className="graph-live-line"
                    x1={PAD_LEFT} y1={lastY}
                    x2={VIEW_WIDTH - PAD_RIGHT} y2={lastY} />
                <circle className="graph-live-dot" cx={lastX} cy={lastY} r={4} />
            </g>

        </svg>
    );
}
