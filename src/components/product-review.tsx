"use cache";
import { cacheLife } from "next/cache";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 부모로부터 문자열(string)이 아닌 Promise 자체를 넘겨받습니다.
export default async function ProductReview({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  // 💡 방호벽 내부의 안전지대: 여기서 비로소 동적 데이터를 해제(await)합니다.
  const resolvedParams = await paramsPromise;

  // 💡 [아키텍트의 정밀 수명 제어]
  // 'minutes' 프로필을 적용합니다. (stale: 5분, revalidate: 1분)
  cacheLife("minutes");

  // 무거운 데이터베이스 연산 시뮬레이션 (최초 1회 3초 소요)
  await delay(3000);
  const renderTime = new Date().toLocaleTimeString();

  return (
    <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
      <h3 className="text-xl font-bold mb-2">⭐ 실시간 구매 리뷰</h3>
      <p className="text-gray-700">
        정말 훌륭한 상품({resolvedParams.id})입니다! Suspense 방호벽 덕분에
        껍데기가 0초 만에 떴군요.
      </p>

      <div className="mt-4 p-3 bg-white rounded-lg inline-block shadow-sm">
        <p className="text-blue-700 font-mono text-sm">
          마지막 서버 동기화 시간:{" "}
          <span className="font-bold">{renderTime}</span>
        </p>
      </div>
    </div>
  );
}
