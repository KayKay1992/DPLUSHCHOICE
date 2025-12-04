import React from "react";

const StarRating = ({ rating, maxStars = 5, starSize = 24 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  const renderStar = (type, key) => {
    const fill =
      type === "full" ? "#FFD700" : type === "half" ? "url(#half)" : "#E0E0E0";
    const className = type === "full" ? "animate-pulse" : "";
    return (
      <svg
        key={key}
        width={starSize}
        height={starSize}
        viewBox="0 0 24 24"
        fill={fill}
        className={`transition-all duration-300 ${className}`}
      >
        <defs>
          <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  };

  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[...Array(fullStars)].map((_, i) => renderStar("full", `full-${i}`))}
      {hasHalfStar && renderStar("half", "half")}
      {[...Array(emptyStars)].map((_, i) => renderStar("empty", `empty-${i}`))}
      <span className="ml-2 text-sm text-gray-600 font-medium">({rating})</span>
    </div>
  );
};

export default StarRating;
