/*
    This file draws one coin's price chart as an SVG. It is handed a finished
    list of readings and turns them into a line, a filled area under it, grid
    lines and axis labels. It holds no state and runs no timers, it only decides
    where each reading lands on screen.
*/

import { useId } from "react";
import { Tick } from "../../../../utils/graph/tick-math";
import { formatAxisPrice, formatPrice, formatTime } from "./graph-format";

// How many readings fit on one chart
export const MAX_TICKS = 60;

// Size of the drawing surface
const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 280;
const PAD_LEFT = 66;
const PAD_RIGHT = 14;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;
const PLOT_WIDTH = VIEW_WIDTH - PAD_LEFT - PAD_RIGHT;
const PLOT_HEIGHT = VIEW_HEIGHT - PAD_TOP - PAD_BOTTOM;
const GRID_LINES = 5;

type PriceChartProp = {
    ticks: Tick[];
    trend: string;
    coinName: string;
}

// Draws the price chart for one coin
export function PriceChartMicroComp(props: PriceChartProp) {

    const ticks = props.ticks;

    const fillId = useId();

    const prices = ticks.map(tick => tick.price);
    const highest = Math.max(...prices);
    const lowest = Math.min(...prices);

    const rawRange = highest - lowest;
    const padding = rawRange > 0 ? rawRange * 0.15 : (highest || 1) * 0.001;
    const top = highest + padding;
    const bottom = lowest - padding;
    const range = top - bottom || 1;

    // Turns a price into a vertical position
    const scaleY = (price: number) => PAD_TOP + ((top - price) / range) * PLOT_HEIGHT;

    const slotWidth = PLOT_WIDTH / MAX_TICKS;
    // Turns a slot number into a horizontal position
    const pointX = (index: number) => PAD_LEFT + slotWidth * (index + 0.5);

    const gridStep = range / (GRID_LINES - 1);
    const gridRows = Array.from({ length: GRID_LINES }, (_, i) => bottom + gridStep * i);

    const timeLabels = ticks.filter((_, i) => i % 10 === 0);

    const points = ticks.map((tick, index) => `${pointX(index)},${scaleY(tick.price)}`).join(" ");

    const last = ticks[ticks.length - 1];
    const lastX = pointX(ticks.length - 1);
    const lastY = scaleY(last.price);

    const floor = VIEW_HEIGHT - PAD_BOTTOM;
    const area = `${pointX(0)},${floor} ${points} ${lastX},${floor}`;

    return (
        <svg className={"graph-svg " + props.trend} viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img"
            aria-label={`Price chart for ${props.coinName}, ${ticks.length} readings, latest ${formatPrice(last.price)} dollars`}>

            <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop className="graph-fill-top" offset="0%" />
                    <stop className="graph-fill-bottom" offset="100%" />
                </linearGradient>
            </defs>

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

            {timeLabels.map(tick => (
                <text key={tick.time} className="graph-axis-text"
                    x={pointX(ticks.indexOf(tick))} y={VIEW_HEIGHT - 10}
                    textAnchor="middle">
                    {formatTime(tick.time)}
                </text>
            ))}

            <polygon className="graph-area" fill={`url(#${fillId})`} points={area} />

            <polyline className="graph-line" points={points} />

            {ticks.map((tick, index) => (
                <circle key={tick.time} className="graph-point"
                    cx={pointX(index)} cy={scaleY(tick.price)} r={1.8}>
                    <title>{`${formatTime(tick.time)}   $ ${formatPrice(tick.price)}`}</title>
                </circle>
            ))}

            <g className={"graph-live " + props.trend}>
                <line className="graph-live-line"
                    x1={PAD_LEFT} y1={lastY}
                    x2={VIEW_WIDTH - PAD_RIGHT} y2={lastY} />
                <circle className="graph-live-dot" cx={lastX} cy={lastY} r={4} />
            </g>

        </svg>
    );
}
