/*
    This file holds the small Skeleton component used all over the app.
    It draws one grey shimmering block that stands in for content that is still loading.
    The caller picks the width, the height, and whether the shape is text, a circle, or a rectangle.
    Bigger placeholders are built by putting several of these blocks together.
*/

import "./skeleton.css";

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    variant?: "text" | "circular" | "rectangular";
}

// Draws one grey loading placeholder block
export function Skeleton({ width, height, variant = "text" }: SkeletonProps) {
    const classNames = `skeleton skeleton-${variant}`;

    return (
        <div
            className={classNames}
            style={{ width, height }}
        />
    );
}