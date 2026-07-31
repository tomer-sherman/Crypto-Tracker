import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { useEffect, useRef, useState } from "react";
import { GraphModel, GraphSource } from "../../../../models/graph-model";
import { GraphRendComp } from "./graph-rend-comp";
import { GraphNoticeMicroComp } from "../micro-comps/graph-notice-micro-comp";
import { MAX_TICKS } from "../micro-comps/price-chart-micro-comp";
import { appendTick, Tick } from "../../../../utils/tick-math";
import { coinService } from "../../../../services/coin-service";
import { notify } from "../../../../utils/notify";
import "./graph-list-rend-comp.css";


// How often the page reads the feeds and draws, which is also how much time one
// point on a chart covers. One number, because "a reading a second" and "a point
// a second" are the same statement.
const TICK_MS = 1000;


/* ============================================================================
   Rendering comp — LIST side. The reports page body.

   Owns two things: the feeds, and the clock.

   The feeds it opens through the service — it reads the starting prices, hands
   them over, and takes back a stream of prices for whatever is currently
   tracked, tearing the whole thing down again when the selection changes.

   The clock is the reason this comp exists in this shape. The feeds push far
   faster than anything needs to be drawn, and pushing every one of those
   straight into state would re-render five charts twenty times a second to show
   movement no one asked to see. So prices land in a ref, which does not
   re-render, and once a second the clock takes a snapshot of it and grows every
   coin's chart by one point. Everything between two snapshots is dropped unread.
   That is both the throttle and the feature: the page shows the newest price,
   once a second, and nothing else.

   One clock rather than one per card, so every chart lands on the same second
   and the stack reads as one moment rather than five that drifted apart. The
   cards below hold no state and run no timers at all — they are handed a
   finished list of readings and draw it.

   Which coins ended up on the live feed and which fell back to a stand-in is the
   service's business, not this comp's. All this side does is notice how the
   split came out and hand it to the copy above the cards.
   ============================================================================ */
export function GraphListRendComp() {

    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);

    // Every price the feeds push, newest per coin. A ref and not state on purpose:
    // writing to it does NOT re-render, so the flood of pushes stays invisible.
    const latest = useRef(new Map<string, GraphModel>());

    // What the readouts show: a snapshot of the map above, replaced once a second.
    // Nothing else on this page re-renders on a timer.
    const [graphs, setGraphs] = useState<GraphModel[]>([]);

    // What the charts draw: one rolling history per coin, grown by the same clock
    // that takes the snapshot, so a card's number and the head of its line are
    // always the same reading.
    const [ticks, setTicks] = useState(new Map<string, Tick[]>());

    useEffect(() => {

        // The effect can be torn down while the seed fetch is still in the air, so
        // both the fetch and the subscription that follows it need something to check.
        let cancelled = false;
        let unsubscribe = () => { };

        const start = async () => {

            // Read the starting prices before opening anything. A coin the feed
            // turns out to refuse needs its price the instant that becomes clear,
            // and fetching it only once that happens would leave the card blank
            // through the round trip.
            let seeds: GraphModel[] = [];

            try {
                seeds = await coinService.getSeedPrices(selectedCoins);
            }
            catch (err: any) {
                // Seeds are the last line of defence, so a failure here only costs
                // the coins the feed refuses -- the rest still go live.
                notify.error(err);
            }

            if (cancelled) return;

            // Straight into the ref. Nothing re-renders here; the clock below is
            // what decides when any of this reaches the screen.
            unsubscribe = coinService.subscribeToCoinPrices(selectedCoins, seeds, incoming => {
                latest.current.set(incoming.coin.id, incoming);
            });
        };

        start();

        const clock = window.setInterval(() => {

            const snapshot = selectedCoins
                .map(coin => latest.current.get(coin.id))
                .filter((graph): graph is GraphModel => !!graph);

            // Which second every card on the page is about to draw. Worked out once
            // here so they cannot land in different buckets.
            const bucket = Math.floor(Date.now() / TICK_MS) * TICK_MS;

            setTicks(current => {

                // Rebuilt from the selection rather than edited in place, so a coin
                // the user has since dropped takes its history with it.
                const next = new Map<string, Tick[]>();

                for (const coin of selectedCoins) {

                    const history = current.get(coin.id) ?? [];
                    const graph = snapshot.find(item => item.coin.id === coin.id);

                    // Nothing usable this second: the feed has not spoken yet, or it
                    // has said there is no price to be had. The history is carried
                    // over untouched rather than dropped.
                    if (!graph || graph.source === "unavailable" || !graph.price || isNaN(graph.price)) {
                        next.set(coin.id, history);
                        continue;
                    }

                    // A reading whether the price moved or not -- a second that
                    // repeats the last number is still a second that happened.
                    next.set(coin.id, appendTick(history, graph.price, bucket, MAX_TICKS));
                }

                return next;
            });

            // Set alongside the readings, so a card never shows a new number
            // against a chart that has not caught up with it.
            setGraphs(snapshot);

        }, TICK_MS);

        // Runs on unmount, and before the effect re-runs when selectedCoins changes.
        return () => {
            cancelled = true;
            window.clearInterval(clock);
            unsubscribe();
        };

    }, [selectedCoins]);


    /* How the selection split. Read off the prices the cards are actually drawing
       rather than tracked alongside them, so the sentence above the stack can
       never claim something the charts below it contradict.

       Filtered out of selectedCoins rather than out of the prices, so the names
       are listed in the order the cards are stacked in — the arrival order the
       feeds produce them in is meaningless to anyone reading the page. */
    const inBucket = (source: GraphSource) => selectedCoins.filter(coin =>
        graphs.find(graph => graph.coin.id === coin.id)?.source === source);

    const live = inBucket("live");
    const simulated = inBucket("simulated");
    const unavailable = inBucket("unavailable");

    /* Whether every tracked coin has been judged yet — the one condition the
       whole page waits on.

       The feeds settle coins one at a time over the first few seconds, and the
       page used to show each one the instant it landed: a card appearing on its
       own and shoving the rest down, the copy above them rewriting itself on
       every arrival. Nothing there was wrong, it just never held still long
       enough to be read.

       So nothing is shown until everything can be. The wait is bounded by the
       service — a coin the feed stays quiet about is written off and moved onto
       a stand-in rather than left hanging, so this always comes true. */
    const ready = selectedCoins.length > 0
        && selectedCoins.every(coin => graphs.some(graph => graph.coin.id === coin.id));


    return (
        <div className="CryptoGraphList">

            <h1>Reports - current market value graphs</h1>

            <GraphNoticeMicroComp selected={selectedCoins} ready={ready}
                live={live} simulated={simulated} unavailable={unavailable} />

            {/* All of them or none of them, drawn in selection order. Held back
                as one block rather than per card, so the stack arrives already
                complete instead of building itself down the page. */}
            {ready && selectedCoins.map(coin => (
                <GraphRendComp key={coin.id} coin={coin} ticks={ticks.get(coin.id) ?? []}
                    graph={graphs.find(graph => graph.coin.id === coin.id) ?? null} />
            ))}

        </div>
    );
}
