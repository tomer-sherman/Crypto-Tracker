import { CoinModel } from "../../../../models/coin-model";
import { joinNames } from "./graph-format";

type GraphNoticeProp = {

    // Every coin the page is tracking, in selection order. Only its length is
    // read — it is what tells "nothing picked yet" apart from "still deciding".
    selected: CoinModel[];

    // Whether every selected coin has a verdict. False means the buckets below
    // are still half empty and nothing about them is worth saying out loud yet.
    ready: boolean;

    live: CoinModel[];
    simulated: CoinModel[];
    unavailable: CoinModel[];
}

/* ============================================================================
   Micro comp — the copy above the charts.

   Given the split the selection fell into, it says so in words. That is the
   whole job: it never asks a feed anything, it is handed the answer already
   worked out and turns it into sentences.

   Three states and no more, because this block used to rewrite itself several
   times on the way in — a line per coin arriving, a "checking" line coming and
   going — and a paragraph that reflows five times in four seconds is unreadable
   whatever it says. So it waits. Nothing selected keeps the same invitation it
   always had, a live selection shows one settled line while the feeds decide,
   and the verdict is written once, in one paragraph, when there is nothing left
   to decide.

   It is here rather than inline in the list comp because it is the one piece of
   the page that has to be right in prose — a card can be told apart by its
   colour, but "which of these numbers are real" is a sentence, and it is the
   only thing standing between a simulated price and a user who believes it.
   ============================================================================ */
export function GraphNoticeMicroComp(props: GraphNoticeProp) {

    // Nothing tracked yet, so there is nothing to explain except the one thing
    // the page needs before it can do anything at all.
    if (props.selected.length === 0) {
        return (
            <p className="graph-empty-state">
                Before you can use this page you need to select at least one coin.
                Head back to the home page, pick up to five of them, and each one gets its own
                graph here — ticking once a second with its current market value.
            </p>
        );
    }

    /* Still deciding. The feed never refuses a coin outright, it just stays
       quiet, so silence is the only signal there is and it takes a few seconds
       to be sure of — this line is that wait, said once instead of narrated
       coin by coin. */
    if (!props.ready) {
        return (
            <p className="graph-notice-loading">
                Fetching coin data — working out which of your coins the live market feed carries.
                Every graph appears at once, the moment all of them have answered.
            </p>
        );
    }

    const names = (coins: CoinModel[]) => joinNames(coins.map(coin => coin.name));

    // Every clause below is about either one coin or several, and every verb in
    // it has to agree. Worked out once here rather than at each verb.
    const oneLive = props.live.length === 1;
    const oneMock = props.simulated.length === 1;
    const oneGone = props.unavailable.length === 1;

    // The {" "} written out below is there because JSX drops the whitespace that
    // follows a tag sitting on its own line, and without it a coin name and the
    // word after it run together for anyone copying the text or hearing it read.

    return (
        <div className="graph-notice">

            <p className="graph-notice-lead">
                Each graph below is read once a second and its line steps one place to the right. A
                second in which nothing moved still gets its own point, so every coin ticks on the
                same beat whether its price changed or not.
            </p>

            {/* One paragraph, written once. The names carry the colour of the
                cards they belong to, so the sentence and the card border say the
                same thing twice. */}
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
