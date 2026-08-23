/*
    This file holds the Header component of the app.
    It draws the strip at the top of every page with the site name on it.
    It only shows text, so there is no state or logic here.
*/

import "./header.css";

// Shows the title bar of the site
export function Header() {
    return (
        <div className="Header">
            

            <p>Crypto Tracker</p>

           

        </div>
    );
}
