/*
    This file holds the PaginationMenu component.
    It shows Back and Next buttons plus one button for every page number.
    The parent page tells it the current page and how many pages there are.
    When a button is clicked it calls back to the parent so the page can change.
*/

import "./pagination-menu.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
}

// Shows the page buttons under a list
export function PaginationMenu({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    if (totalPages === 0) return null;

    return (
        <div className="PaginationMenu">
            <button
                className="nav-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Back
            </button>

            <div className="page-numbers">
                {pages.map(page => (
                    <button
                        key={page}
                        className={`number-btn ${page === currentPage ? "active" : ""}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                className="nav-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}