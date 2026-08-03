/*
    This file holds the Pag404 component, the page shown when an address does not exist.
    It keeps the crypto theme of the site and treats the missing page as a coin that crashed.
    A fake price falls to zero on a timer, and a small chart draws the fall next to it.
    One button at the bottom sends the user back to the home page.
*/

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./pag404.css";

// The price the lost page coin starts at
const START_PRICE = 404;

// Builds the points of the small crashing chart
function buildCrashChart() {
    const points = [];

    for (let i = 0; i < 32; i++) {
        const x = (i / 31) * 300;
        const fall = 14 + Math.pow(i / 31, 1.8) * 76;
        const jitter = Math.sin(i * 2.7) * 4;

        points.push({ x, y: Math.min(97, Math.max(4, fall + jitter)) });
    }

    const line = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

    return { line, area: `0,100 ${line} 300,100`, last: points[points.length - 1] };
}

// The line is the same on every visit, so it is built one time only
const CRASH_CHART = buildCrashChart();

// Joke coins for the scrolling ticker tape
const TICKER_COINS = [
    { symbol: "LOST", change: "-100.00%" },
    { symbol: "OOPS", change: "-87.42%" },
    { symbol: "NULL", change: "-100.00%" },
    { symbol: "VOID", change: "-76.30%" },
    { symbol: "TYPO", change: "-93.11%" },
    { symbol: "DEADLINK", change: "-100.00%" },
    { symbol: "BACKBTN", change: "+404.00%" },
];

// Shows the page not found screen
export function Pag404() {
    // Reads the address the user tried to open
    const location = useLocation();

    // Sends the user to a real page
    const navigate = useNavigate();

    // Holds the falling price of the lost page coin
    const [price, setPrice] = useState(START_PRICE);

    // Drops the price on a timer until it reaches zero
    useEffect(() => {
        const timer = setInterval(() => {
            setPrice(current => {
                if (current <= 0) return 0;

                const wobble = (Math.sin(current * 7.7) + 1) * 0.9;
                const next = current * 0.78 - wobble;

                return next <= 0.01 ? 0 : next;
            });
        }, 420);

        return () => clearInterval(timer);
    }, []);

    const change = ((price - START_PRICE) / START_PRICE) * 100;
    const dead = price <= 0;

    return (
        <div className="Pag404">

            <div className="glitch" data-text="404">404</div>

            <h1>Page Not Found</h1>

            <p className="lead">
                You just tried to open a coin that was never listed. There is no chart for it,
                no market cap, and not a single holder. Even our AI refused to comment.
            </p>

            <div className="ticket">

                <div className="ticket-head">
                    <span className="coin-name">
                        <span className="coin-logo">?</span>
                        Lost Page Token
                        <span className="coin-symbol">ERR</span>
                    </span>

                    <span className={`status ${dead ? "flat" : ""}`}>
                        <span className="dot" />
                        {dead ? "Flatlined" : "Live"}
                    </span>
                </div>

                <div className="ticket-body">

                    <div className="price-block">
                        <span className="price">${price.toFixed(2)}</span>

                        <span className="change">
                            ▼ {change.toFixed(2)}%
                        </span>

                        <span className="price-note">
                            All time high ${START_PRICE.toFixed(2)} · {dead ? "no bids left" : "still falling"}
                        </span>
                    </div>

                    <svg className="crash-chart" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <polygon className="crash-area" points={CRASH_CHART.area} />
                        <polyline className="crash-line" points={CRASH_CHART.line} pathLength={1} />
                        <circle className="crash-dot" cx={CRASH_CHART.last.x} cy={CRASH_CHART.last.y} r="3.5" />
                    </svg>

                </div>

                <div className="stat-grid">

                    <div className="stat">
                        <span className="stat-label">Market Cap</span>
                        <span className="stat-value">$0.00</span>
                    </div>

                    <div className="stat">
                        <span className="stat-label">Volume 24h</span>
                        <span className="stat-value">0 ERR</span>
                    </div>

                    <div className="stat">
                        <span className="stat-label">Holders</span>
                        <span className="stat-value">1</span>
                    </div>

                    <div className="stat">
                        <span className="stat-label">Rank</span>
                        <span className="stat-value">#404</span>
                    </div>

                </div>

                <div className="verdict">
                    <span className="verdict-label">Analyst Verdict</span>
                    <span className="verdict-value">Strong Sell</span>
                </div>

                <div className="request-line">
                    <span className="method">GET</span>
                    <span className="path">{location.pathname}</span>
                    <span className="code">404 Not Found</span>
                </div>

            </div>

            <div className="actions">

                <button className="action" onClick={() => navigate("/home")}>
                    Back To Home Page
                </button>

            </div>

            <div className="ticker">
                <div className="ticker-track">
                    {[...TICKER_COINS, ...TICKER_COINS].map((coin, index) => (
                        <span className="ticker-item" key={index}>
                            <span className="ticker-symbol">{coin.symbol}</span>
                            <span className={`ticker-change ${coin.change.startsWith("+") ? "up" : ""}`}>
                                {coin.change}
                            </span>
                        </span>
                    ))}
                </div>
            </div>

        </div>
    );
}
