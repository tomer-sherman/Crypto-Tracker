/*
    Small helper functions for turning raw values into text for the reports page.
    It formats prices for cards and for chart axis labels, turns a timestamp into
    a clock time, and joins coin names into a readable sentence. These helpers
    only decide how a value is shown, never what the value is.
*/

// Formats one price with fitting decimals
export function formatPrice(value: number): string {
    if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (value >= 1) return value.toFixed(3);
    if (value >= 0.01) return value.toFixed(5);
    return value.toFixed(7);
}

// Formats a price for an axis label
export function formatAxisPrice(value: number, step: number): string {

    if (!value || !step || !isFinite(step)) return formatPrice(value);

    const digits = Math.ceil(Math.log10(Math.abs(value) / step)) + 1;

    return value.toLocaleString(undefined, {
        maximumSignificantDigits: Math.min(10, Math.max(3, digits))
    });
}

// Turns a timestamp into a clock time
export function formatTime(time: number): string {
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

// Joins coin names into one sentence
export function joinNames(names: string[]): string {
    if (names.length === 0) return "";
    if (names.length === 1) return names[0];
    return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
}
