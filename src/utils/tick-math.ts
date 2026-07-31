/* ============================================================================
   The rolling history a chart is drawn from.

   The feeds only ever send a last price. Once a second the page reads whatever
   the newest one is and adds it here, and this file decides what that does to
   the list — which is arithmetic and nothing else.

   Pure on purpose: same list in, same list out, no timers and no state.
   ============================================================================ */

// One reading: a price, and the second it was taken in. That is the whole of
// what a point on the chart is, so it is the whole of what this holds.
export type Tick = {
    time: number;   // Start of the second this reading belongs to
    price: number;  // The newest price the feed had when that second ended
};


/* Add one reading to the running list.

   Deliberately one price per second rather than everything that arrived during
   it. The feeds push far faster than this — the socket several times a second, a
   stand-in four times — and every one of those in-between values is meant to be
   invisible: the page shows the newest price, once a second, and nothing else.

   A second in which the price did not move still gets its own reading, which is
   what keeps the line stepping to the right through a flat patch instead of
   stalling and leaving a hole in the timeline.

   `bucket` — which second this reading belongs to — is passed in rather than
   read off the clock here, both because the page clock has already decided it
   (and every card on the page has to agree on it) and because a function that
   reads the clock cannot be tested and cannot be reasoned about twice. */
export function appendTick(ticks: Tick[], price: number, bucket: number, maxTicks: number): Tick[] {

    const last = ticks[ticks.length - 1];

    // Two readings inside one second, which a drifting timer can produce. The
    // later one replaces the earlier rather than two points landing on the same
    // slot and the line doubling back on itself.
    if (last && last.time === bucket) {
        return [...ticks.slice(0, -1), { time: bucket, price: price }];
    }

    // Keeping only the newest ones is what makes the chart scroll on its own.
    return [...ticks, { time: bucket, price: price }].slice(-maxTicks);
}
