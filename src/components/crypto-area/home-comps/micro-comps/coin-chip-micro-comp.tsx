import { CoinIdentityMicroComp, CoinProp } from "./coin-identity-micro-comp";
import "./coin-chip-micro-comp.css";

/* ============================================================================
   Micro comp — the compact coin chip.

   The one presentational piece the whole app shares: the tracked-coins dropzone
   on home, the "maximum reached" dialog, every AI insight card and every live
   graph header all mount this exact element. Its stylesheet is anchored to
   those four parents, which is why the root class must stay `.CryptoCard`.
   ============================================================================ */
export function CoinChipMicroComp(props: CoinProp) {
    return (
        <div className="CryptoCard">
            <CoinIdentityMicroComp coin={props.coin} />
        </div>
    );
}
