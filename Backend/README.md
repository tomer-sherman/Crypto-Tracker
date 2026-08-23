# 🪙 CryptoTracker — Backend

## 🧠 The Mental Model

That is essentially what I want to build here in this server:

```mermaid
sequenceDiagram
    participant F as 🖥️ FRONTEND
    participant B as ⚙️ BACKEND
    participant O as 🤖 OPENAI API
    participant M as 🛠️ YOUR MCP SERVER

    F->>B: 1️⃣ POST /chat<br/>{ "question": "Compare BTC and SOL" }
    B->>O: 2️⃣ Controller
    Note over O: 🔌 MCP connection configured<br/>server_url = your MCP server
    O->>M: 3️⃣ MCP tool calls
    Note over M: 📊 get_market_overview() → cache / CoinGecko<br/>🔍 get_coin() → deep-dive cache / CoinGecko<br/>⚖️ compare_coins() → cache / CoinGecko<br/>🎯 screen_coins() → cached 100 coins<br/>📈 get_market_movers() → cached 100 coins
    M-->>O: 4️⃣ MCP tool results
    Note over O: 🧠 AI interprets tool results<br/>✍️ generates final answer
    O-->>B: 5️⃣ final answer
    B-->>F: 6️⃣ return string
```

### 📄 Plain-text version

```text
🖥️  FRONTEND
   │
   │  1️⃣  POST /chat
   │      { "question": "Compare BTC and SOL" }
   ▼
⚙️  BACKEND
   │
   │  2️⃣  Controller
   ▼
🤖 OPENAI API
   │
   │  🔌 MCP connection configured
   │     server_url = your MCP server
   ▼
🛠️  YOUR MCP SERVER
   │
   ├── 📊 get_market_overview()
   │        └── cache / CoinGecko
   │
   ├── 🔍 get_coin()
   │        └── deep-dive cache / CoinGecko
   │
   ├── ⚖️ compare_coins()
   │        └── cache / CoinGecko
   │
   ├── 🎯 screen_coins()
   │        └── cached 100 coins
   │
   └── 📈 get_market_movers()
            └── cached 100 coins
   │
   │  4️⃣  MCP tool results
   ▼
🤖 OPENAI API
   │
   │  🧠 AI interprets tool results
   │  ✍️ generates final answer
   ▼
⚙️  BACKEND
   │
   │  5️⃣  return string
   ▼
🖥️  FRONTEND
```

## 🔄 The Data Flow

```mermaid
flowchart TD
    CG["🦎 CoinGecko"] --> MD["📊 Market data<br/>(100 coins)"]
    CG --> DD["🔍 Coin deep dive<br/>(1 specific coin)"]
    MD --> SC1["📦 Server cache"]
    DD --> SC2["📦 Server cache"]
    SC1 --> MCP["🛠️ MCP tools"]
    SC2 --> MCP
    MCP --> AI["🧠 AI"]
    AI --> C["💬 Conversation"]
```

### 📄 Plain-text version

```text
                🦎 CoinGecko
                    │
          ┌─────────┴─────────┐
          │                   │
    📊 Market data       🔍 Coin deep dive
      (100 coins)         (1 specific coin)
          │                   │
          ▼                   ▼
    📦 Server cache      📦 Server cache
          │                   │
          └────────┬──────────┘
                   ▼
               🛠️ MCP tools
                   │
                   ▼
                 🧠 AI
                   │
                   ▼
             💬 Conversation
```
