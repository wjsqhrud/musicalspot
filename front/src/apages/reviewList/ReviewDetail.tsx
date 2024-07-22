import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { privateReviewDetails, publicReviewDetails, reviewDetailsIncreaseView, toggleReviewLike } from 'services/review/reviewService';

interface ReviewDetail {
  id: string;
  title: string;
  content: string;
  nickname: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
  musicalTitle: string;
}

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewDetails();
    checkLoginStatus();
    incrementViewCount();
  }, [id]);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  };

  const fetchReviewDetails = async () => {
    try {
      const data = isLoggedIn 
        ? await privateReviewDetails(id as string)
        : await publicReviewDetails(id as string);
      setReview(data);
    } catch (error) {
      console.error('리뷰 상세 정보 로딩 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    try {
      await reviewDetailsIncreaseView(id as string);
    } catch (error) {
      console.error('조회수 증가 중 오류 발생:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      await toggleReviewLike(id as string);
      fetchReviewDetails();
    } catch (error) {
      console.error('좋아요 토글 중 오류 발생:', error);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (!review) return <p>리뷰를 찾을 수 없습니다.</p>;

  return (
    <div className="review-detail">
      <h2>{review.title}</h2>
      <p>뮤지컬: {review.musicalTitle}</p>
      <p>작성자: {review.nickname}</p>
      <p>작성일: {new Date(review.createdAt).toLocaleDateString()}</p>
      <p>좋아요: {review.likeCount} | 조회수: {review.viewCount}</p>
      <button onClick={handleLikeToggle}>
        {review.isLiked ? '좋아요 취소' : '좋아요'}
      </button>
      <div>{review.content}</div>
      <CommentList reviewId={id as string} />
      {isLoggedIn && <CommentForm reviewId={id as string} />}
    </div>
  );
};

export default ReviewDetail;