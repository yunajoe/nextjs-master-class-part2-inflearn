import InterceptedDetail from "@/app/feed/(...)photo/[id]/InterceptedDetail";
import { Suspense } from "react";

function InterceptedPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  // 🚨 아키텍트의 규칙: 껍데기에서는 절대 await params를 하지 않고 내부로 위임합니다.

  return (
    <Suspense fallback={<p className="text-blu-500 font-bold"></p>}>
      <InterceptedDetail paramsPromise={params} />
    </Suspense>
  );
}

export default InterceptedPhotoPage;
