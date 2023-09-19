import { Review } from "@prisma/client";

export function calculateReviewAvarage(review: Review[]) {
  if(!review.length) return 0;
  // sum of all reviews / total review
  return (
    review.reduce((sum, review) => {
      return sum + review.rating;
    }, 0) / review.length
  );
}
