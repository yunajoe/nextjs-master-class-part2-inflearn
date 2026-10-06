import { ProposalData } from "@/lib/proposal-db";
import Link from "next/link";

async function page() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl">환영합니다! 실시간 제안서 피드</h1>
      <Link
        href="/proposal/new"
        className="p-3 bg-blue-500 max-w-3xl cursor-pointer"
      >
        새 제안서 작성하러 가기
      </Link>
      <div className="border-2 border-white w-3xl">
        {ProposalData.map((item) => (
          <div key={item.id} className="p-2 flex gap-4 items-center">
            <span className="text-3xl">{item.title}</span>
            <span className="text-xl">좋아요 갯수: {item.likeCount}개</span>
            <button>[투표하기 버튼]</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
