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
    </div>
  );
}

export default page;
