/*
    This file holds the CryptoCardSkeleton component.
    It draws a grey placeholder shaped like a coin card while the real data loads.
    It is built from small Skeleton blocks for the image, text, switch, and button.
    Showing it keeps the page from jumping around once the coins arrive.
*/

import { Skeleton } from "../skelton/skeleton";
import "./crypto-card-skeleton.css";

// Shows a placeholder card while loading
export function CryptoCardSkeleton() {
    return (
        <div className="CryptoCardSkeleton">
            <div className="skeleton-image-wrapper">
                <Skeleton variant="circular" width="50px" height="50px" />
            </div>

            <div className="skeleton-text-wrapper">
                <Skeleton variant="text" width="60px" height="18px" />
                <Skeleton variant="text" width="120px" height="13px" />
            </div>

            <div className="skeleton-switch-wrapper">
                <Skeleton variant="rectangular" width="54px" height="30px" />
            </div>

            <div className="skeleton-button-wrapper">
                <Skeleton variant="rectangular" width="100%" height="45px" />
            </div>
        </div>
    );
}