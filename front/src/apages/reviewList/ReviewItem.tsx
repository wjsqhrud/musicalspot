import React from 'react';
import { Link } from 'react-router-dom';

interface ReviewItemProps {
  review: {
    id: string;
    title: string;
    nickname: string;
    createdAt: string;
    likeCount: number;
    viewCount: number;
    musicalTitle: string;
  };
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <div className="review-item">
      <Link to={`/review/${review.id}`}>
        <h3>{review.title}</h3>
      </Link>
      <p>뮤지컬: {review.musicalTitle}</p>
      <p>작성자: {review.nickname}</p>
      <p>작성일: {new Date(review.createdAt).toLocaleDateString()}</p>
      <p>좋아요: {review.likeCount} | 조회수: {review.viewCount}</p>
    </div>
  );
};

export default ReviewItem;