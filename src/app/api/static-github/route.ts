// 실무에서 ORM(Prisma)이나 외부 SDK를 사용하여 fetch 옵션을 쓸 수 없을 때, 파일 통째로 캐시 방어막을 치는 방법입니다.

import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const data = await res.json();
  return NextResponse.json({
    title: "60초 글로벌 캐싱된 GitHub 리포트",
    stars: data.stargazers_count,
    generatedAt: new Date().toISOString(),
  });
}
