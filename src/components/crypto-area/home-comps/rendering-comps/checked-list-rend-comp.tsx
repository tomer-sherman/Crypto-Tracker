import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { CoinChipMicroComp } from "../micro-comps/coin-chip-micro-comp";
import { WelcomeNoteMicroComp } from "../micro-comps/welcome-note-micro-comp";
import { ValidationDialogRendComp } from "./validation-dialog-rend-comp";
import "./checked-list-rend-comp.css";

/* ============================================================================
   Rendering comp — LIST side. The tracked-coins dropzone.

   Owns the selection itself: it reads the tracked coins out of Redux, decides
   between the welcome copy and a row of chips, and — because the sixth coin is
   a fact about this selection and nothing else — it is also what puts the
   "maximum reached" dialog on screen. The page above no longer has to know that
   the limit exists.

   The dialog is a `position: fixed` element, so mounting it here does not add a
   flex item to this row and nothing shifts. Nothing on the path down to it
   carries a transform, a filter or a backdrop-filter, which is what keeps its
   full-screen backdrop measured against the viewport.
   ============================================================================ */
export function CheckedListRendComp() {
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);
    const count = selectedCoins.length;

    return (
        <div className="CheckedCoinList">

            {count === 6 && <ValidationDialogRendComp />}

            <div className="coins-dropzone">


                <div className="cards-inner-layout">
                    {count === 0 ? (
                        <WelcomeNoteMicroComp />
                    ) : (
                        selectedCoins.map(coin => <CoinChipMicroComp key={coin.id} coin={coin} />)
                    )}
                </div>

                <p className="limit-warning">👾 You can only select 5 crypto coins !!!</p>
            </div>

        </div>
    );
}
