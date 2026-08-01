/*
    This file works out a fake next price for a coin the live socket does not send.
    It takes the price a coin is at now plus the price it started from, and returns
    the next price. The new price is a small random move mixed with a gentle pull
    back toward the starting price, so the chart looks alive without drifting away.
*/

// How big one random price move can be
const STEP = 0.0015;

// How strongly the price is pulled back
const PULL = 0.02;


// Returns the next stand-in price
export function walkPrice(current: number, base: number): number {

    if (!base) return current;

    const step = (Math.random() * 2 - 1) * STEP;
    const pull = ((base - current) / base) * PULL;

    return current * (1 + step + pull);
}
