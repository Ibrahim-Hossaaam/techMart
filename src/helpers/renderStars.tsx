import { Star } from "lucide-react";

export const renderStars = (rating: number) => {
  // 3.6
  const stars = []; // 4
  const fullStars = Math.floor(rating); // 3
  const hasHalfStar = rating % 1 !== 0; // true

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <Star
        key="half"
        className="h-4 w-4 fill-yellow-400/50 text-yellow-400"
      />
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
    );
  }

  return stars;
};