/*
    This file holds the Footer component of the app.
    It draws the small bar that sits at the bottom of every page.
    The bar only shows credit lines and a rights notice, so it has no logic.
*/

import "./footer.css";

// Shows the bottom bar of the site
export function Footer() {
    return (
        <div className="Footer">

			<p>All rights reserved ©</p>
			<p>Made By Tomer Sherman designed by gemini</p>

        </div>
    );
}
