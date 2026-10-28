import EducationStatus from "@/components/education-status";
import { Suspense } from "react";

function page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
      <div className="p-10 bg-slate-900 text-center">
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">
          🦆 코라파덕 글로벌 성과 대시보드
        </h1>
        <p className="text-slate-400 font-medium">
          이 뼈대(Static Shell)는 서버 통신에 발목 잡히지 않고 번개처럼
          나타납니다.
        </p>
      </div>
      <div>
        <Suspense fallback={<p>로딩중입니다.</p>}>
          <EducationStatus params={params} />
        </Suspense>
      </div>
      <div className="bg-slate-100 p-6 text-center border-t border-slate-200">
        <p className="text-slate-500 text-sm font-bold">
          Data Architecture by Next.js PPR & cacheLife
        </p>
      </div>
    </div>
  );
}

export default page;
