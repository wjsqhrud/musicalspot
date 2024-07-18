export interface Review {
  id: number; // ID가 숫자로 정의되어 있는 것을 반영
  title: string;
  content: string;
  musicalId: number; // musicalId로 변경
  musicalTitle: string; // musicalTitle 추가
  createdAt: string;
  likeCount: number;
  viewCount: number;
  nickname: string; // 작성자의 닉네임 추가
  musicalImageUrl: string;
}
