/* ============================================================================
   The number formatting the report micro comps draw with.

   It lives beside them rather than in the rendering comps because it is purely
   a question of how a value is shown, never of what the value is.
   ============================================================================ */

// Coins range from 60,000 to 0.000004, so the decimals have to follow the size.
export function formatPrice(value: number): string {
    if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (value >= 1) return value.toFixed(3);
    if (value >= 0.01) return value.toFixed(5);
    return value.toFixed(7);
}

/* The price labels down the side of a chart.

   formatPrice fixes its decimals to the size of the number, which is right for
   one price on a card but wrong for an axis. A coin that barely moves puts all
   five grid lines inside a thousandth of a dollar, they all round to the same
   string, and the axis prints the same number five times over.

   What an axis label needs is enough digits to tell it apart from the line above
   it, and that is a question of the gap between them rather than of how big the
   number is. `step` is that gap. */
export function formatAxisPrice(value: number, step: number): string {

    if (!value || !step || !isFinite(step)) return formatPrice(value);

    // How many digits it takes to get down to the gap, plus one more so the last
    // of them is actually the one that differs.
    const digits = Math.ceil(Math.log10(Math.abs(value) / step)) + 1;

    return value.toLocaleString(undefined, {
        maximumSignificantDigits: Math.min(10, Math.max(3, digits))
    });
}

// 1761557400000 -> "09:45:00"
export function formatTime(time: number): string {
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

// ["Filecoin", "GHO", "Lighter"] -> "Filecoin, GHO and Lighter".
// The copy above the charts names coins mid-sentence, so they have to be joined
// the way a sentence joins them rather than with a bare comma between each.
export function joinNames(names: string[]): string {
    if (names.length === 0) return "";
    if (names.length === 1) return names[0];
    return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
}
