/*
    This file builds the list of price readings that a coin chart is drawn from.
    Each reading is one price and the second it belongs to, and the app adds one
    reading per second. If a reading for that second already exists it is replaced,
    and only the newest readings are kept so the chart keeps scrolling along.
*/

export type Tick = {
    time: number;
    price: number;
};


// Adds one price reading to the list
export function appendTick(ticks: Tick[], price: number, bucket: number, maxTicks: number): Tick[] {

    const last = ticks[ticks.length - 1];

    if (last && last.time === bucket) {
        return [...ticks.slice(0, -1), { time: bucket, price: price }];
    }

    return [...ticks, { time: bucket, price: price }].slice(-maxTicks);
}
