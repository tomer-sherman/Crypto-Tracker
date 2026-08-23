/*
    This file handles the live price data that the reports page runs on. It opens a
    websocket feed for the selected coins and hands every new price back to the page.
    When the live feed does not carry a coin, it starts a fake feed for that coin
    instead. It also reads the starting prices those fake feeds walk away from.
*/

import axios from "axios";
import { CoinModel } from "../models/coin-model";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/store";
import { adaptGraph, GraphModel, GraphSocketData, GraphSource } from "../models/graph-model";
import { adaptCoinBackup, CoinBackupApi, CoinInfoModel } from "../models/coin-info-model";
import { walkPrice } from "../utils/graph/price-walk";


// How often the fake feed pushes a price
const SIM_TICK_MS = 250;

// How long to wait for a live price
const LIVE_GRACE_MS = 4000;


class GraphService {


    // Opens live price feeds for the selected coins
    public subscribeToCoinPrices(coins: CoinModel[], seeds: GraphModel[], onPrice: (graph: GraphModel) => void): () => void {

        if (coins.length === 0) return () => { };

        const streams = coins
            .map(coin => coin.symbol.toLowerCase() + "usdt@ticker")
            .join("/");

        const socket = new WebSocket(appConfig.priceSocketUrl + streams);

        let stopped = false;

        const settled = new Map<string, GraphSource>();

        const lastLive = new Map<string, number>();

        const standIns = new Map<string, number>();

        // Starts a fake price feed for one coin
        const startStandIn = (coin: CoinModel) => {

            if (stopped || standIns.has(coin.id)) return;

            const seed = seeds.find(item => item.coin.id === coin.id);

            const base = lastLive.get(coin.id) ?? seed?.price ?? 0;

            if (!base) {
                settled.set(coin.id, "unavailable");
                onPrice({ coin: coin, price: 0, source: "unavailable" });
                return;
            }

            settled.set(coin.id, "simulated");

            let price = base;

            const timer = window.setInterval(() => {
                price = walkPrice(price, base);
                onPrice({ coin: coin, price: price, source: "simulated" });
            }, SIM_TICK_MS);

            standIns.set(coin.id, timer);

            onPrice({ coin: coin, price: price, source: "simulated" });
        };

        // Reads new live prices from the socket
        socket.onmessage = event => {
            const socketData: GraphSocketData = JSON.parse(event.data);

            const graph = adaptGraph(socketData, coins);
            if (!graph) return;

            lastLive.set(graph.coin.id, graph.price);

            const verdict = settled.get(graph.coin.id);
            if (verdict === "simulated" || verdict === "unavailable") return;

            settled.set(graph.coin.id, "live");

            onPrice(graph);
        };

        let grace = 0;

        // Starts the waiting timer once connected
        socket.onopen = () => {

            if (stopped) return;

            grace = window.setTimeout(() => {
                for (const coin of coins) {
                    if (!settled.has(coin.id)) startStandIn(coin);
                }
            }, LIVE_GRACE_MS);
        };

        // Moves every coin to a fake feed
        const handleDeath = () => {

            if (stopped) return;

            window.clearTimeout(grace);

            for (const coin of coins) {

                if (settled.get(coin.id) === "live") settled.delete(coin.id);

                if (settled.has(coin.id)) continue;

                startStandIn(coin);
            }
        };

        socket.onerror = handleDeath;
        socket.onclose = handleDeath;

        // Stops the feeds and closes the socket
        return () => {
            stopped = true;
            window.clearTimeout(grace);
            for (const timer of standIns.values()) window.clearInterval(timer);
            socket.close();
        };
    }


    // Gets starting prices for the fake feeds
    public async getSeedPrices(coins: CoinModel[]): Promise<GraphModel[]> {

        const storedInfo = store.getState().coinsInfo;

        // Finds a stored dollar price for one coin
        const findStored = (coinId: string) => storedInfo.find(item => item.id === coinId && item.usd);

        const covered = coins.every(coin => findStored(coin.id));

        let backupInfo: CoinInfoModel[] = [];

        if (!covered) {
            const response = await axios.get<CoinBackupApi[]>(appConfig.hundredCoinsBackupUrl);
            backupInfo = adaptCoinBackup(response.data);
        }

        const graphs: GraphModel[] = [];

        for (const coin of coins) {

            const info = findStored(coin.id) ?? backupInfo.find(item => item.id === coin.id);

            if (!info?.usd) continue;

            graphs.push({ coin: coin, price: info.usd, source: "simulated" });
        }

        return graphs;
    }

}

export const graphService = new GraphService();
