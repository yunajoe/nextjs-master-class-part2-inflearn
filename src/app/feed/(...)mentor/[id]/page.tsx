import InterceptedMentor from "@/app/feed/(...)mentor/[id]/MentorInterCeptor";
import { Suspense } from "react";

export default function InterceptedMentorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 🚨 아키텍트의 규칙: 껍데기에서는 절대 `await params`를 하지 않고 내부로 위임합니다.
  return (
    <div className="max-w-4xl mx-auto p-8 bg-indigo-50/80 border-l-8 border-indigo-500 rounded-r-3xl my-8 shadow-inner">
      {/* 💡 [Suspense 방호벽] 동적 데이터를 안전하게 격리하여 0초 렌더링을 보장합니다. */}
      <Suspense
        fallback={
          <div className="flex items-center gap-3 animate-pulse">
            <span className="text-2xl">⏳</span>
            <p className="text-indigo-600 font-bold text-lg">
              낚아챈 멘토 요약 화면을 구성 중입니다...
            </p>
          </div>
        }
      >
        <InterceptedMentor paramsPromise={params} />
      </Suspense>
    </div>
  );
}
