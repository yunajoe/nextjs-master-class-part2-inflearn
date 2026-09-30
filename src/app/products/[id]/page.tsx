// src/app/products/[id]/page.tsx

import LikeButton from "@/app/components/like-button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15+ 환경을 고려하여 params를 비동기로 풀어냅니다.
  const { id } = await params;

  // 실무라면 DB에서 가져왔을 가상의 초기 상태 (기본적으로 좋아요가 안 눌린 상태로 가정합니다)
  const initialLikedFromDB = false;

  return (
    <div className="p-10 font-sans max-w-xl mx-auto mt-10 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="text-sm text-blue-600 font-bold mb-2">
        상품 번호: {id}
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
        아키텍트 최고급 기계식 키보드
      </h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        낙관적 업데이트(Optimistic Update) 테스트를 위한 상품 상세 페이지입니다.
        하트 버튼을 눌러 물리적 지연 시간이 0초로 단축되는 마법을 직접 확인해
        보십시오.
      </p>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
        <span className="font-bold text-xl text-gray-800">250,000원</span>

        {/* 🚨 우리가 만든 낙관적 UI 클라이언트 컴포넌트 탑재 및 초기 진짜 상태 주입 */}
        <LikeButton productId={id} initialLiked={initialLikedFromDB} />
      </div>
    </div>
  );
}
