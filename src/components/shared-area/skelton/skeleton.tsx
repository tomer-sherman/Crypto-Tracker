import "./skeleton.css";

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ width, height, variant = "text" }: SkeletonProps) {
    const classNames = `skeleton skeleton-${variant}`;

    return (
        <div
            className={classNames}
            style={{ width, height }}
        />
    );
}