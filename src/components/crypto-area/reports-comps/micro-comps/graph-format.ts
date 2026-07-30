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

// 1761557400000 -> "09:45:00"
export function formatTime(time: number): string {
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}
