/*
    This file draws the paged grid of the top hundred coins on the home page.
    It loads the coins once, filters them by the search text kept in global state, and splits the result into pages.
    It also chooses the slide direction between pages and shows skeletons while loading or a message when nothing matches.
*/

import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { coinService } from "../../../../services/coin-service";
import { notify } from "../../../../utils/notify";
import { filterCoinsBySearch } from "../../../../utils/filter-coins";
import { CoinRendComp } from "./coin-rend-comp";
import { CryptoCardSkeleton } from "../../../shared-area/crypto-card-skeleton/crypto-card-skeleton";
import { PaginationMenu } from "../../../shared-area/pagination-menu/pagination-menu";
import "./list-rend-comp.css";
import { paginateCoins } from "../../../../utils/pagination-page-math";

// Draws the paged grid of coins
export function ListRendComp() {
    // Holds the hundred coins that were loaded
    const [coins, setCoins] = useState<CoinModel[]>([]);
    // Tells if the coins are still loading
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // Holds the page the user is on
    const [currentPage, setCurrentPage] = useState<number>(1);
    // Holds the direction the grid slides
    const [slideDirection, setSlideDirection] = useState<string>("slide-forward");

    // Reads the search text from global state
    const currentSearch = useSelector<AppState, string>(state => state.searchQuery);
    const itemsPerPage = 20;

    // Loads the hundred coins on first render
    useEffect(() => {
        coinService.getHundredCoins()
            .then(setCoins)
            .catch(err => notify.error(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    // Resets to page one on new search
    useEffect(() => {
        setCurrentPage(1);
    }, [currentSearch]);

    // Holds the coins matching the search
    const filteredCoins = useMemo(() => filterCoinsBySearch(coins, currentSearch), [coins, currentSearch]);

    const { currentCoins, totalPages, hasResults } = paginateCoins(filteredCoins, currentPage, itemsPerPage);


    // Sets the slide direction and the page
    const handlePageChange = (newPage: number) => {
        if (newPage > currentPage) {
            setSlideDirection("slide-forward");
        } else {
            setSlideDirection("slide-backward");
        }
        setCurrentPage(newPage);
    };


    // Picks skeletons, a message or the tiles
    const renderGridContent = () => {
        if (isLoading) return Array(itemsPerPage).fill(0).map((_, i) => <CryptoCardSkeleton key={i} />);
        if (!hasResults) return <p className="no-results">No coins found matching "{currentSearch}"</p>;
        return currentCoins.map(c => <CoinRendComp key={c.id} coin={c} />);
    };

    return (
        <div className="CryptoList">
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
