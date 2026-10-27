import HeavyProductDescription from "@/components/heavy-product-description";
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
    </div>
  );
}

export default page;
