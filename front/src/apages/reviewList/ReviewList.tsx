import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReviewItem from './ReviewItem';
import { reviewRecent40 } from 'services/review/reviewService';

interface Review {
  id: string;
  title: string;
  content: string;
  nickname: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  musicalTitle: string;
}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastReviewElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewRecent40(page);
      if (data.length < 40) {
        setHasMore(false);
      }
      setReviews(prevReviews => [...prevReviews, ...data]);
    } catch (error) {
      console.error('리뷰 로딩 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-list">
      <h2>최근 리뷰</h2>
      {reviews.map((review, index) => (
        <div key={review.id} ref={index === reviews.length - 1 ? lastReviewElementRef : null}>
          <ReviewItem review={review} />
        </div>
      ))}
      {loading && <p>로딩 중...</p>}
      {!hasMore && <p>더 이상 리뷰가 없습니다.</p>}
    </div>
  );
};

export default ReviewList;