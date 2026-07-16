import { useEffect, useState } from "react";
import { CryptoCard } from "../crypto-card/crypto-card";
import { CryptoCardSkeleton } from "../../shared-area/crypto-card-skeleton/crypto-card-skeleton";
import { PaginationMenu } from "../../shared-area/pagination-menu/pagination-menu";
import "./crypto-list.css";
import { CoinModel } from "../../../models/coin-model";
import { coinService } from "../../../services/coin-service";
import { notify } from "../../../utils/notify";

export function CryptoList() {
    const [coins, setCoins] = useState<CoinModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // 1. Changed to 20 items per page
    const itemsPerPage = 20;

    useEffect(() => {
        coinService.getHundredCoins()
            .then(allCoins => setCoins(allCoins))
            .catch(err => notify.error(err.message || "Failed to fetch coins"))
            .finally(() => { setIsLoading(false); });
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCoins = coins.slice(startIndex, endIndex);
    const totalPages = Math.ceil(coins.length / itemsPerPage);

    return (
        <div className="CryptoList">

            {!isLoading && (
                <PaginationMenu
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <div className="cards-grid">
                {isLoading ?
                    
                    Array(20).fill(0).map((_, index) => (<CryptoCardSkeleton key={index} />)) :
                    currentCoins.map(c => <CryptoCard key={c.id} coin={c} />)
                }
            </div>

        </div>
    );
}