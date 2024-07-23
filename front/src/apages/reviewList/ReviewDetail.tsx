// ReviewDetail.tsx

import React, { useState, useEffect } from "react";
import {
  privateReviewDetails,
  publicReviewDetails,
  reviewDetailsIncreaseView,
  reviewLike,
  toggleReviewLike,
} from "services/review/reviewService";
import { Review } from "./ReviewType";
import RenderComments from "./CommentList";

interface ReviewDetailProps {
  reviewId: number;
  onClose: () => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ reviewId, onClose }) => {
  const [review, setReview] = useState<Review | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading state
  const isLoggedIn = true; // Replace with your actual login logic

  useEffect(() => {
    const fetchReview = async () => {
      try {
        await reviewDetailsIncreaseView(reviewId.toString()); // Increase view count
        const reviewData = isLoggedIn
          ? await privateReviewDetails(reviewId.toString()) // Fetch private review details if logged in
          : await publicReviewDetails(reviewId.toString()); // Fetch public review details if not logged in
        setReview(reviewData);
        setLoading(false); // Set loading to false once data is fetched

        if (isLoggedIn) {
          const likeStatus = await reviewLike(reviewId.toString()); // Check if user has liked this review
          setIsLiked(likeStatus);
        }
      } catch (error) {
        console.error("Failed to fetch review details.", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchReview();
  }, [reviewId, isLoggedIn]);

  const handleLike = async () => {
    try {
      if (!isLiked) {
        await toggleReviewLike(reviewId.toString()); // Toggle like status if not already liked
        setIsLiked(true); // Update local state to liked
        setReview((prevReview) => ({
          ...prevReview!,
          likeCount: prevReview!.likeCount + 1, // Increment like count locally
        }));
      } else {
        // Handle case for unliking the review (if needed)
      }
    } catch (error) {
      console.error("Failed to toggle like.", error);
    }
  };

  if (loading) return <div className="text-center">로딩 중...</div>; // Show loading state while fetching data

  if (!review) return <div className="text-center">Review not found.</div>; // Handle case where review is not found

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <img
        src={review.musicalImageUrl}
        alt={review.musicalTitle}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{review.title}</h2>
        <p className="text-xl text-gray-700 mb-4">{review.musicalTitle}</p>
        <p className="text-gray-600 mb-2">카테고리: {review.musicalCategory}</p>
        <p className="text-gray-600 mb-2">작성자: {review.nickname}</p>
        <p className="text-gray-600 mb-2">
          작성일: {new Date(review.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-2">
          수정일: {new Date(review.updatedAt).toLocaleDateString()}
        </p>
        <div className="my-6">
          <p className="text-gray-800 whitespace-pre-wrap">{review.content}</p>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded ${
              !isLiked ? "bg-gray-200 text-gray-800" : "bg-red-500 text-white"
            }`}
            disabled={isLiked} // Disable button if already liked
          >
            {isLiked ? "좋아요 취소" : "좋아요"} ({review.likeCount})
          </button>
          <div className="text-gray-600">
            <span className="mr-4">조회수: {review.viewCount}</span>
          </div>
        </div>
        <RenderComments review={review} />
      </div>
    </div>
  );
};

export default ReviewDetail;
