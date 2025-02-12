import React from "react";
import "../StarRating.css";  // Import your CSS file

const StarRating = ({ rating,classes }) => {
  const renderStars = () => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (rating >= i + 1) {
        stars.push(<span key={i} className="star full">★</span>);  // Full star
      } else if (rating > i && rating < i + 1) {
        stars.push(<span key={i} className="star half">★</span>);  // Half star
      } else {
        stars.push(<span key={i} className="star empty">★</span>);  // Empty star
      }
    }
    return stars;
  };

  return <div className={`star-rating ${classes}`}>{renderStars()}</div>;
};

export default StarRating;
