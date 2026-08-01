/*
    This file holds the NavMenu component of the app.
    It shows the links that move between the Home, Reports, Recommendation, and About pages.
    It also holds the coin search box, and every keystroke is saved into the global state.
    Other pages read that saved text so they can filter the coins they show.
*/

import { NavLink } from "react-router-dom";
import "./nav-menu.css";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { ChangeEvent } from "react";
import { searchQuerySlice } from "../../../redux/search-query-slice";
import { store } from "../../../redux/store";




// Shows the page links and search box
export function NavMenu() {
    // Reads the search text from global state
    const currentSearch = useSelector<AppState, string>(state => state.searchQuery);

    // Saves the typed search text to the store
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
