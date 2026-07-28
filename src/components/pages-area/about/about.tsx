import "./about.css";
import profilePic from "../../../assets/me.jpeg";

export function About() {
    return (
        <div className="About">

            {/* ---------- Part 1: what this application is ---------- */}
            <h1>About This App</h1>

            <p className="lead">
                Crypto Tracker is a simple dashboard for following the cryptocurrency market.
                It shows the top 100 coins, lets you pick the ones you actually care about,
                watch their prices move live, and ask an AI what it thinks about them.
            </p>

            <div className="feature-grid">

                <div className="feature-card">
                    <span className="feature-icon">📈</span>
                    <h3>Top 100 Coins</h3>
                    <p>
                        The home page loads the 100 largest coins on the market. Every card can be
                        expanded to reveal live pricing in USD, EUR and ILS, and there is a search
                        box in the navigation bar for jumping straight to a specific coin.
                    </p>
                </div>

                <div className="feature-card">
                    <span className="feature-icon">✅</span>
                    <h3>Pick Up To 5</h3>
                    <p>
                        You choose which coins to track by toggling them on. The app keeps a maximum
                        of five at a time, so when you try to add a sixth one a dialog opens and asks
                        you which of the current five you would like to drop.
                    </p>
                </div>

                <div className="feature-card">
                    <span className="feature-icon">⚡</span>
                    <h3>Live Reports</h3>
                    <p>
                        The reports page opens a WebSocket connection to Binance and draws your
                        selected coins on a graph that updates the moment the price changes -- no
                        refreshing, no polling, just a continuous stream of real prices.
                    </p>
                </div>

                <div className="feature-card">
                    <span className="feature-icon">🤖</span>
                    <h3>AI Insights</h3>
                    <p>
                        The recommendation page sends your selected coins to an AI model and returns
                        a short analysis for each one. It is meant as information and perspective
                        only -- never as financial advice.
                    </p>
                </div>

            </div>

            {/* ---------- Technology stack ---------- */}
            <div className="tech-stack">
                <p className="tech-title"><strong>Technology Stack</strong></p>

                <div className="tech-list">
                    <span className="tech-item">React</span>
                    <span className="tech-item">TypeScript</span>
                    <span className="tech-item">Redux Toolkit</span>
                    <span className="tech-item">React Router</span>
                    <span className="tech-item">Axios</span>
                    <span className="tech-item">WebSockets</span>
                    <span className="tech-item">Vite</span>
                    <span className="tech-item">CSS3</span>
                </div>
            </div>

            {/* ---------- Part 2: about me ---------- */}
            <div className="section-divider" />

            <h2>About Me</h2>

            <div className="profile-card">

                <div className="profile-photo">
                    <img src={profilePic} alt="Tomer Sherman" />
                </div>

                <h3 className="profile-name">Tomer Sherman</h3>
                <p className="profile-role">John Bryce Student · Learning To Code</p>

                <p className="profile-text">
                    I am currently a student at John Bryce, learning coding. I genuinely enjoy it --
                    not just getting something to run, but figuring out why it runs.
                </p>

                <p className="profile-text">
                    When it comes to code, I care much more about understanding than about
                    memorizing. Syntax is something you can always look up; what interests me is
                    reading complex code and making sense of it, and understanding how an
                    architecture is put together and why it was built that way. And above all of
                    that, I love working with AI.
                </p>

                <p className="profile-text">
                    Outside of the keyboard I like working out, and staying generally healthy and
                    ready. And I drink a serious amount of coffee.
                </p>

                <div className="tag-list">
                    <span className="tag">Coding</span>
                    <span className="tag">Working Out</span>
                    <span className="tag">Health &amp; Readiness</span>
                    <span className="tag">A Lot Of Coffee</span>
                    <span className="tag">Understanding &gt; Memorizing</span>
                    <span className="tag">Code Architecture</span>
                    <span className="tag">AI</span>
                </div>
            </div>

        </div>
    );
}
