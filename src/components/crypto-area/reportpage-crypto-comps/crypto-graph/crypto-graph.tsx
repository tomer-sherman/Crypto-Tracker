import { useEffect, useRef, useState } from "react";
import { GraphModel } from "../../../../models/graph-model";
import { SelectedCoinCard } from "../../homepage-crypto-comps/selected-coin-card/selected-coin-card";
import "./crypto-graph.css";


type GraphProps = {
    graph: GraphModel
}

// One bar on the chart. Built here on the client, because the socket only sends a last price.
type Candle = {
    time: number;   // Start of the bucket this candle covers
    open: number;   // First price seen in the bucket
    high: number;   // Highest price seen in the bucket
    low: number;    // Lowest price seen in the bucket
    close: number;  // Last price seen in the bucket
};

// How much time each candle covers, and how many we keep on screen.
const BUCKET_MS = 10000;
const MAX_CANDLES = 30;

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

// Coins range from 60,000 to 0.000004, so the decimals have to follow the size.
function formatPrice(value: number): string {
    if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (value >= 1) return value.toFixed(3);
    if (value >= 0.01) return value.toFixed(5);
    return value.toFixed(7);
}

// 1761557400000 -> "09:45:00"
function formatTime(time: number): string {
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

export function CryptoGraph(props: GraphProps) {

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

    const first = candles[0];
    const last = candles[candles.length - 1];
    const changePercent = first && first.open ? ((last.close - first.open) / first.open) * 100 : 0;
    const trend = changePercent >= 0 ? "up" : "down";

    return (
        <div className="CryptoGraph">

            <div className="graph-header">

                <SelectedCoinCard coin={props.graph.coin} />

                <div className="graph-readout">
                    <span className="graph-label">Live market value</span>
                    <p className={"graph-price " + trend}>$: {price === null ? "..." : formatPrice(price)}</p>
                    <span className={"graph-change " + trend}>
                        {changePercent >= 0 ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
                    </span>
                </div>

            </div>

            <div className="graph-chart">

                {candles.length === 0 && (
                    <p className="graph-waiting">Waiting for the first live tick...</p>
                )}

                {candles.length > 0 && (
                    <svg className="graph-svg" viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img"
                        aria-label={`Candlestick chart for ${props.graph.coin.name}`}>

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
                        <g className={"graph-live " + trend}>
                            <line className="graph-live-line"
                                x1={PAD_LEFT} y1={scaleY(last.close)}
                                x2={VIEW_WIDTH - PAD_RIGHT} y2={scaleY(last.close)} />
                            <circle className="graph-live-dot"
                                cx={centerX(candles.length - 1)} cy={scaleY(last.close)} r={4} />
                        </g>

                    </svg>
                )}

            </div>

        </div>
    );
}
