import { NavLink } from "react-router-dom";
import "./nav-menu.css";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { ChangeEvent } from "react";
import { searchQuerySlice } from "../../../redux/search-query-slice";
import { store } from "../../../redux/store";




export function NavMenu() {
    // Read the current search query from the global state
    const currentSearch = useSelector<AppState, string>(state => state.searchQuery);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        
        const action = searchQuerySlice.actions.updateSearchQuery(event.target.value);
        store.dispatch(action);

    };




    return (
        <div className="NavMenu">


            <NavLink to="/home">Home</NavLink>
            <NavLink to="/reports">Reports</NavLink>
            <NavLink to="/recommendation">Ai Crypto Recommendation</NavLink>
            <NavLink to="/about">About</NavLink>

            <input
                type="text"
                placeholder="COIN SEARCH"
                value={currentSearch} 
                onChange={handleInputChange} 
                maxLength={10}
            />

        </div>
    );
}
