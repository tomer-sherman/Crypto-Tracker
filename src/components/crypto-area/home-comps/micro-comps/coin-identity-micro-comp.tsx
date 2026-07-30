import { CoinModel } from "../../../../models/coin-model";

/* The prop shape every coin-driven component in this app takes. It is declared
   here because this is the smallest thing in the tree that reads a CoinModel,
   so everything above it imports the type from this file instead of each
   component re-declaring its own copy. */
export type CoinProp = {
    coin: CoinModel;
}

/* ============================================================================
   Micro comp — a coin's mark, ticker and name. Nothing else, no state.

   It returns a fragment on purpose. Both cards that use it — the grid tile in
   coin-rend-comp and the chip in coin-chip-micro-comp — style these three
   elements as their own DIRECT children (`.CryptoCard img`,
   `.CryptoCard span:nth-of-type(1)` and so on), so a wrapper element here would
   quietly break the layout of both.
   ============================================================================ */
export function CoinIdentityMicroComp(props: CoinProp) {
    return (
        <>
            <img src={props.coin.image} alt={props.coin.name} />
            <span>{props.coin.symbol.toUpperCase()}</span>
            <span>{props.coin.name}</span>
        </>
    );
}
