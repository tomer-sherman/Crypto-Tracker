/*
    This file holds the welcome text shown in the tracked coins area.
    It appears while the user has not picked any coin yet.
    The text is static, so the component takes no props and holds no state.
*/

// Shows the welcome text for new users
export function WelcomeNoteMicroComp() {
    return (
        <div className="empty-state-wrapper">
            <div className="empty-state-wrapper">
                <p className="empty-text">WELCOME TO CRYPTO TRACKER</p>
                <p className="empty-text">1. Your selected coins will appear in this section.</p>
                <p className="empty-text">2. Clicking on the more info button, gives you the real time coin's value in the market in (USD,EUR,ILS).</p>
                <p className="empty-text">3. Each selected coin generates a real-time graph on the Reports page, tracking its value every second.</p>
                <p className="empty-text">4. Visit the AI Recommendation page to analyze your coins and receive personalized buying advice.</p>
            </div>
        </div>
    );
}
