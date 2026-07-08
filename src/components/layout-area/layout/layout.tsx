import { useState } from "react";
import { Footer } from "../footer/footer";
import { Header } from "../header/header";
import { NavMenu } from "../nav-menu/nav-menu";
import { Routing } from "../routing/routing";
import "./layout.css";

export function Layout() {
    const [showNav, setShowNav] = useState(false);

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