// 아키텍트의 안전장치: 현재 URL에 맞는 부품을 찾지 못했을 때 띄워줄 플랜 B 화면입니다.
export default function AnalyticsDefault() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📊 통계 요약 (기본값)
      </h2>
      <p className="text-gray-500">
        현재 선택된 상세 데이터가 없습니다. 기본 통계를 안전하게 유지합니다.
        (default.tsx 가동)
      </p>
    </div>
  );
}
