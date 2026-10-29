"use server";

import { cacheTag, revalidatePath, revalidateTag, updateTag } from "next/cache";


let mockReviews = [
  {
    id: "1",
    productId: "123",
    content: "정말 훌륭한 상품입니다!",
    author: "김유저",
  },
  {
    id: "2",
    productId: "123",
    content: "정말 최악의 쓰레기 상품이네요! (악성 리뷰)",
    author: "악플러",
  },
];

let mockReviews2 = [
  {
    id: "1",
    content: "디자인이 정말 아름답네요. 문제 해결의 정수가 담겨있습니다.",
    author: "Stella",
  },
  {
    id: "2",
    content: "음질이 끔찍하네요! 당장 환불해주세요!!! (악성 리뷰)",
    author: "Oliver",
  },
  { id: "3", content: "배송도 빠르고 기술력이 돋보입니다.", author: "Chloe" },
  { id: "4", content: "최고의 사용자 경험입니다.", author: "Noah" },
  { id: "5", content: "아키텍처 설계가 예술의 경지네요.", author: "Leo" },
  {
    id: "6",
    content: "모든 컴포넌트가 유기적으로 연결되어 있습니다.",
    author: "Elena",
  },
];

let db = [{
  reviews: 
}];
export async function getReviews(productId: string) {
  await new Promise((res) => setTimeout(res, 500));
  return mockReviews.filter((r) => r.productId === productId);
}

export async function deleteReviewAction(reviewId: string, productId: string) {
  try {
    mockReviews = mockReviews.filter((r) => r.id !== reviewId);
    console.log(`🗑️ [DB 갱신] 리뷰 ${reviewId} 영구 삭제`);
    revalidatePath(`/product/${productId}`);
    console.log(`🔥 [캐시 파괴] /product/${productId} 최신화 완료`);
  } catch (error) {
    console.error("삭제 실패", error);
  }
}

export async function getReviews2() {
  await new Promise((res) => setTimeout(res, 500));
  return mockReviews2;
}

//  방식 1: 부드러운 백그라운드 갱신 (비동기적 접근법)
export async function deleteReviewSoftAction(reviewId: string) {
  console.log("reivewId 1111", reviewId);
  mockReviews2 = mockReviews2.filter((r) => r.id != reviewId);
  // 'global-reviews' 캐시가 낡았으니 시간 날 때 교체해 달라고 마킹합니다.
  revalidateTag("global-reviews", "max");
}

export async function deleteReviewInstantAction(reviewId: string) {
  console.log("reivewId 22222", reviewId);
  mockReviews2 = mockReviews2.filter((r) => r.id != reviewId);
  // 경로가 어디든 상관없이 'global-reviews' 태그를 가진 모든 캐시를 지금 당장 파괴합니다!
  updateTag("global-reviews");
}

export async function getReview(id: string) {
  "use cache";

  cacheTag(`review-${id}`, `product-123-reviews`);

  const res = await fetch(`https://api.example.com/reviews/${id}`);
  return res.json();
}

export async function deleteReviewAction2(reviewId: string) {

  await db.review.delete({ where: { id: reviewId } });
  updateTag(`review-${reviewId}`);
}
