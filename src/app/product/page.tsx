"use cache";
import { getReviews2 } from "@/app/actions";
import DeleteButton from "@/components/delete-button";
import { cacheTag } from "next/cache";

export default async function page() {
  // 💡 두 번째: 아키텍트의 이름표를 부여합니다.
  // 이 화면에서 소비되는 얼어붙은 데이터 겉면에 'global-reviews'라는 대리 키를 달아 색인 장부에 기록합니다.
  cacheTag("global-reviews");

  const reviews = await getReviews2();
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 className="text-3xl font-black mb-4">프리미엄 헤드폰 상세 페이지</h1>
      <hr className="my-6 border-gray-200" />

      <h3 className="text-xl font-bold mb-4">⭐ 전 세계 고객 리뷰</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {reviews.map((review) => (
          <li
            key={review.id}
            style={{
              marginBottom: "15px",
              padding: "15px",
              background: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid #eee",
            }}
          >
            <strong>{review.author}</strong>은(는) 다음과 같이 평가했습니다.{" "}
            <br />
            <span className="text-gray-700">{review.content}</span>
            <div className="mt-3">
              <DeleteButton reviewId={review.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
