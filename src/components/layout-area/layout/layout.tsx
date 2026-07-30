import { useEffect, useState } from "react";
import { Footer } from "../footer/footer";
import { Header } from "../header/header";
import { NavMenu } from "../nav-menu/nav-menu";
import { Routing } from "../routing/routing";
import { store } from "../../../redux/store";
import { coinService } from "../../../services/coin-service";
import { notify } from "../../../utils/notify";
import "./layout.css";

export function Layout() {
    const [showNav, setShowNav] = useState(false);

    // The app's clock. Layout never unmounts, so this one interval runs for the
    // whole session and keeps every page's currency values fresh.
    useEffect(() => {
        const timer = setInterval(() => {

            // Read at tick time, not render time -- always the current 100 coins.
            const coinIds = store.getState().hundredCoins.map(c => c.id).join(",");

            // Home hasn't loaded them yet -- skip this tick and try again in a minute.
            if (!coinIds) return;

            coinService.initCoinInfo(coinIds).catch(err => notify.error(err.message));
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    // This listens to the scroll position of the .Layout div
    const handleScroll = (e: any) => {
        // Calculate 75% of the user's screen height
        const threshold = window.innerHeight * 0.75;

        if (e.currentTarget.scrollTop > threshold) {
            setShowNav(true);
        } else {
            setShowNav(false);
        }
    };

    return (
        <div className="Layout" onScroll={handleScroll}>

            {/* The wrapper gets the 'active' class only when showNav is true */}
            <nav className={`floating-nav ${showNav ? 'active' : ''}`}>
                <NavMenu />
            </nav>

            <header><Header /></header>

            <main><Routing /></main>

            <footer><Footer /></footer>

        </div>
    );
}