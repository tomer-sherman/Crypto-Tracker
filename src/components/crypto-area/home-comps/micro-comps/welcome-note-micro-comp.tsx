/* ============================================================================
   Micro comp — the welcome copy shown in the dropzone while nothing is tracked.

   Static text, so it takes no props. The double `.empty-state-wrapper` nesting
   is kept exactly as it was: checked-list-rend-comp.css is written around this
   markup, and its `:nth-child` stagger counts these five paragraphs.
   ============================================================================ */
export function WelcomeNoteMicroComp() {
    return (
        // ADDED CLASS HERE
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
