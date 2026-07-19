import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { CoinModel } from "../../../models/coin-model";
import { coinService } from "../../../services/coin-service";
import { notify } from "../../../utils/notify";
import { filterCoinsBySearch } from "../../../utils/filter-coins";
import { CryptoCard } from "../crypto-card/crypto-card";
import { CryptoCardSkeleton } from "../../shared-area/crypto-card-skeleton/crypto-card-skeleton";
import { PaginationMenu } from "../../shared-area/pagination-menu/pagination-menu";
import "./crypto-list.css";
import { paginateCoins } from "../../../utils/pagination-page-math";

export function CryptoList() {
    const [coins, setCoins] = useState<CoinModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // 1. New state to track which direction the grid should swipe
    const [slideDirection, setSlideDirection] = useState<string>("slide-forward");

    const currentSearch = useSelector<AppState, string>(state => state.searchQuery);
    const itemsPerPage = 20;

    // --- Side Effects ---
    useEffect(() => {
        coinService.getHundredCoins()
            .then(setCoins)
            .catch(err => notify.error(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [currentSearch]);


    // --- Data Processing util ---
    const filteredCoins = useMemo(() => filterCoinsBySearch(coins, currentSearch), [coins, currentSearch]);

    // --- Pagination math util --
    const { currentCoins, totalPages, hasResults } = paginateCoins(filteredCoins, currentPage, itemsPerPage);


    // 2. Custom function to calculate the swipe direction before updating the page
    const handlePageChange = (newPage: number) => {
        if (newPage > currentPage) {
            setSlideDirection("slide-forward"); // Moving forward: slides in from the right
        } else {
            setSlideDirection("slide-backward"); // Moving backward: slides in from the left
        }
        setCurrentPage(newPage);
    };


    const renderGridContent = () => {
        if (isLoading) return Array(itemsPerPage).fill(0).map((_, i) => <CryptoCardSkeleton key={i} />);
        if (!hasResults) return <p className="no-results">No coins found matching "{currentSearch}"</p>;
        return currentCoins.map(c => <CryptoCard key={c.id} coin={c} />);
    };

    return (
        <div className="CryptoList">
            {/* Changed totalPages > 1 to totalPages > 0 */}
            {!isLoading && totalPages > 0 && (
                <PaginationMenu
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            <div className="cards-grid-wrapper">
                <div className={`cards-grid ${slideDirection}`} key={currentPage}>
                    {renderGridContent()}
                </div>
            </div>
        </div>
    );
}