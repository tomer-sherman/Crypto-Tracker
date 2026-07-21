import "./crypto-graph.css"; // Assuming you have a CSS file here

// Clean, simple props!
export type GraphProp = {
    symbol: string;
    price: number;
}

export function CryptoGraph({ symbol, price }: GraphProp) {
    return (
        <div className="CryptoGraph">
            <h3>{symbol}</h3>
            <p>Current Price: ${price}</p>
            {/* You can drop your actual chart library component (like Recharts or Chart.js) in here later! */}
        </div>
    );
}