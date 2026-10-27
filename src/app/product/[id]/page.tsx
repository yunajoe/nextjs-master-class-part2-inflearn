import HeavyProductDescription from "@/components/heavy-product-description";
import ProductReview from "@/components/product-review";
import RealTimeCart from "@/components/real-time-cart";
import { Suspense } from "react";

function page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="max-w-3xl mx-auto p-10 bg-white shadow-xl mt-10 rounded-2xl">
      <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tighter">
        프리미엄 무선 헤드폰
      </h1>

      <Suspense
        fallback={
          <p className="text-blue-500 font-bold p-6">
            🛒 실시간 장바구니 로딩중...
          </p>
        }
      >
        <RealTimeCart paramsPromise={params} />
      </Suspense>
      <Suspense
        fallback={
          <p className="text-red-500 font-bold p-8">
            ❄️ 무거운 상품 설명 로딩중...
          </p>
        }
      >
        <HeavyProductDescription paramsPromise={params} />
      </Suspense>
      <Suspense
        fallback={
          <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-red-500 font-bold animate-pulse">
            ⏳ 리뷰 데이터를 불러오는 중입니다...
          </div>
        }
      >
        <ProductReview paramsPromise={params} />
      </Suspense>
    </div>
  );
}

export default page;
