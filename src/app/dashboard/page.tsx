// 브라우저 환경과 달리 Node.js 서버 환경(Next.js 서버)에서는 fetch 요청 시 도메인 정보가 포함된 절대 경로

import { DATA } from "@/app/api/webhooks/reviews/route";

async function page() {
  const response = await fetch("http://localhost:3000/api/webhooks/reviews", {
    cache: "no-store",
  });
  const jsonData = await response.json();
  if (!jsonData.success || !jsonData.data) throw new Error("불러오는데 실패");
  if (jsonData.data.length === 0) return <h1>아직 데이터가 없습니다.</h1>;
  return (
    <div>
      <h1>👨‍🏫 실시간 수강평 모니터링 대시보드</h1>
      <h1>시스템 마지막 동기화: </h1>
      <div>
        {jsonData.data.map((item: DATA) => (
          <div key={item.id}>
            <div className="flex gap-4">
              <p>{item.rating}</p>
              <p>{item.courseTitle}</p>
            </div>
            <p>
              {item.comment} - {item.studentName} 수강생{" "}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;

// # 2. 강사용 내부 프론트엔드 대시보드 화면 (/dashboard 접속)
// ========================================
// 👨‍🏫 실시간 수강평 모니터링 대시보드
// ========================================
// 시스템 마지막 동기화: 오후 3:45:12
// ----------------------------------------
// ⭐⭐⭐⭐⭐ [5.0] Next.js 마스터 클래스
// "최고의 강의!" - 김개발 수강생 (오후 3:45:10)
// 💡 🌟 만점 리뷰 (조건부 UI 뱃지 렌더링)
// ----------------------------------------
