import "./pagination-menu.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
}

export function PaginationMenu({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // This dynamically creates an array like [1, 2, 3, 4] depending on totalPages
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    // If there is no data yet, don't render the menu
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
                        // Applies the 'active' class only to the button matching the current page
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