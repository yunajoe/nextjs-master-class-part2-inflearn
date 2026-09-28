"use client";

import { createMentoring } from "@/app/action";
import { useActionState } from "react";

// # 1. 멘토링 신청 화면 진입 (/korapaduck/apply)
// ========================================
// 🦆 멘토링 신청소
// ========================================
// 학생 이름: 홍길동
// 학습 주제: (빈칸으로 둔 채 🚨 에러 유발)
// 👉 [🚀 멘토링 신청하기] 클릭

// # 2. 버튼 클릭 직후 (UI 물리적 락킹)
// [ 📡 시스템 전송 중... ] ⬅️ 1.5초간 버튼 비활성화 (다중 클릭 원천 차단)

// # 3. 실시간 서버 피드백 렌더링 (useActionState 작동)
// ----------------------------------------
// ❌ 이름과 학습 주제를 모두 입력해야 합니다.
// (시도: 1회)
// ----------------------------------------

// # 4. 성공 시나리오 및 캐시 파괴 (Mutation)
// 학생 이름: 홍길동
// 학습 주제: Next.js 정적 캐시 파괴 메커니즘
// 👉 [🚀 멘토링 신청하기] 다시 클릭

// 👇 (1.5초 DB 통신 후 /korapaduck 대기열 화면으로 강제 Redirect 발동!)
// ========================================
// 🦆 Korapaduck 멘토링 대기열 (Cache Rebuilt)
// ========================================
// 교육의 평등, 기술로 실현합니다.
// ----------------------------------------
// [NEW] Next.js 정적 캐시 파괴 메커니즘
// 🙋‍♂️ 백종휘 학생
// ----------------------------------------
// (빌드 타임에 굳어있던 정적 HTML 스냅샷이 산산조각 나고,
//  방금 신청한 최신 멘토링 데이터가 성공적으로 렌더링 됨!)

const initialState = {
  success: false,
  message: "",
  attemptCount: 0,
};

function page() {
  const [state, formAction, pending] = useActionState(
    createMentoring,
    initialState,
  );
  return (
    <div className="flex flex-col max-w-3xl mx-auto gap-8">
      <h1 className="text-3xl">멘토링 신청소</h1>
      {/* onSubmit: 브라우저 이벤트 핸들러라서 event(SubmitEvent)를 받습니다. */}
      {/* action: Next.js/React의 Server Action용이라서 FormData를 받습니다. */}
      <form action={formAction} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="학생 이름"
          name="name"
          className="p-2"
        />
        <input
          type="text"
          placeholder="학습 주제"
          name="subject"
          className="p-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="p-2 border border-blue-700"
        >
          멘토링 신청하기
        </button>
      </form>
      {state.message && <p>{state.message}</p>}
      시도 {state.attemptCount}회
    </div>
  );
}

export default page;
