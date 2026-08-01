/*
    This file shows the block of text that sits above the graphs on the reports
    page. It is handed the coins split into live, simulated and unavailable
    groups, and writes that split out in plain sentences. If nothing is selected
    it asks the user to pick coins, and while the feeds are still deciding it
    shows a single waiting line instead.
*/

import { CoinModel } from "../../../../models/coin-model";
import { joinNames } from "./graph-format";

type GraphNoticeProp = {

    selected: CoinModel[];

    ready: boolean;

    live: CoinModel[];
    simulated: CoinModel[];
    unavailable: CoinModel[];
}

// Writes the notice text above the graphs
export function GraphNoticeMicroComp(props: GraphNoticeProp) {

    if (props.selected.length === 0) {
        return (
            <p className="graph-empty-state">
                Before you can use this page you need to select at least one coin.
                Head back to the home page, pick up to five of them, and each one gets its own
                graph here — ticking once a second with its current market value.
            </p>
        );
    }

    if (!props.ready) {
        return (
            <p className="graph-notice-loading">
                Fetching coin data — working out which of your coins the live market feed carries.
                Every graph appears at once, the moment all of them have answered.
            </p>
        );
    }

    // Joins coin names into one list
    const names = (coins: CoinModel[]) => joinNames(coins.map(coin => coin.name));

    const oneLive = props.live.length === 1;
    const oneMock = props.simulated.length === 1;
    const oneGone = props.unavailable.length === 1;

    return (
        <div className="graph-notice">

            <p className="graph-notice-lead">
                Each graph below is read once a second and its line steps one place to the right. A
                second in which nothing moved still gets its own point, so every coin ticks on the
                same beat whether its price changed or not.
            </p>

            <p className="graph-notice-body">

                {props.live.length > 0 && (
                    <>
                        <span className="graph-name live">{names(props.live)}</span>{" "}
                        {oneLive ? "is" : "are"} priced straight off the live market feed, so
                        {oneLive ? " that graph is" : " those graphs are"} real market data.{" "}
                    </>
                )}

                {props.simulated.length > 0 && (
                    <>
                        The live feed doesn't carry{" "}
                        <span className="graph-name simulated">{names(props.simulated)}</span>, so
                        {oneMock ? " that graph starts" : " those graphs start"} from the last market
                        price the app has and {oneMock ? "moves" : "move"} on a simulated price
                        fluctuation — {oneMock ? "it is" : "they are"} there for display only and
                        {oneMock ? " is" : " are"} not real market data.{" "}
                    </>
                )}

                {props.unavailable.length > 0 && (
                    <>
                        <span className="graph-name unavailable">{names(props.unavailable)}</span>{" "}
                        {oneGone ? "is" : "are"} not carried by the feed and {oneGone ? "has" : "have"}{" "}
                        no saved price to fall back on, so
                        {oneGone ? " its graph cannot be drawn" : " their graphs cannot be drawn"}.
                    </>
                )}

            </p>

        </div>
    );
}
