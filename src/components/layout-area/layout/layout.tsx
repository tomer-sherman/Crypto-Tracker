/*
    This file holds the Layout component, which is the main frame of the app.
    It puts the header, the page content, and the footer on the screen in order.
    It also runs a timer that refreshes the coin prices once a minute.
    It watches the scroll position so a floating nav menu appears further down the page.
*/

import { useEffect, useState } from "react";
import { Footer } from "../footer/footer";
import { Header } from "../header/header";
import { NavMenu } from "../nav-menu/nav-menu";
import { Routing } from "../routing/routing";
import { store } from "../../../redux/store";
import { coinService } from "../../../services/coin-service";
import { notify } from "../../../utils/notify";
import "./layout.css";

// Builds the main frame of the app
export function Layout() {
    // Holds whether the floating nav is visible
    const [showNav, setShowNav] = useState(false);

    // Refreshes the coin prices every minute
    useEffect(() => {
        const timer = setInterval(() => {

            const coinIds = store.getState().hundredCoins.map(c => c.id).join(",");

            if (!coinIds) return;

            coinService.initCoinInfo(coinIds).catch(err => notify.error(err.message));
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    // Shows or hides the nav on scroll
    const handleScroll = (e: any) => {
        const threshold = window.innerHeight * 0.75;

        if (e.currentTarget.scrollTop > threshold) {
            setShowNav(true);
        } else {
            setShowNav(false);
        }
    };

    return (
        <div className="Layout" onScroll={handleScroll}>

            <nav className={`floating-nav ${showNav ? 'active' : ''}`}>
                <NavMenu />
            </nav>

            <header><Header /></header>

            <main><Routing /></main>

            <footer><Footer /></footer>

        </div>
    );
}