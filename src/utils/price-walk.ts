/* ============================================================================
   The movement behind a stand-in price.

   The socket does not carry every coin the list offers. A coin it refuses still
   needs a price that moves, otherwise its card draws one flat line while the
   cards beside it climb and fall. This is the arithmetic that moves it.

   Pure on purpose: it is handed a price and returns the next one. Where the
   starting price came from, and what pushes these values on a timer, is the
   service's job -- this file never fetches and never schedules.
   ============================================================================ */

// How far a single step is allowed to move the price, as a fraction of it.
// Small, because steps land several times a second and they compound.
const STEP = 0.0015;

// How hard the price is pulled back toward where it started. Without this a walk
// left running for minutes wanders off and never comes back, and the card ends up
// showing a number nowhere near what the coin is worth.
const PULL = 0.02;


/* Given where the price is now and where it began, produce the next one.

   Two forces, added together and applied at once: a random step in either
   direction, which is what makes the chart jagged, and a nudge back toward the
   base, which is what keeps it honest. The nudge is proportional to how far off
   the price has drifted, so it is almost nothing near the base and grows the
   further out the walk goes. */
export function walkPrice(current: number, base: number): number {

    // A base of zero has nothing to drift from, and would divide by zero below.
    if (!base) return current;

    const step = (Math.random() * 2 - 1) * STEP;
    const pull = ((base - current) / base) * PULL;

    return current * (1 + step + pull);
}
