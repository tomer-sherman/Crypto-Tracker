import { Skeleton } from "../skelton/skeleton"; // Adjust path if needed
import "./crypto-card-skeleton.css";

export function CryptoCardSkeleton() {
    return (
        <div className="CryptoCardSkeleton">
            {/* Image Placeholder */}
            <div className="skeleton-image-wrapper">
                <Skeleton variant="circular" width="50px" height="50px" />
            </div>

            {/* Text Placeholders */}
            <div className="skeleton-text-wrapper">
                <Skeleton variant="text" width="60px" height="18px" />
                <Skeleton variant="text" width="120px" height="13px" />
            </div>

            {/* Toggle Switch Placeholder */}
            <div className="skeleton-switch-wrapper">
                <Skeleton variant="rectangular" width="54px" height="30px" />
            </div>

            {/* Button Placeholder */}
            <div className="skeleton-button-wrapper">
                <Skeleton variant="rectangular" width="100%" height="45px" />
            </div>
        </div>
    );
}