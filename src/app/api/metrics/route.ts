import { NextResponse } from "next/server";

export const revalidate = 60; // 1분 마다 갱신
export async function GET() {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const data = await res.json();
  return NextResponse.json({
    title: "60초 글로벌 캐싱된 리포트",
    stars: data.stargazers_count,
    generatedAt: new Date().toISOString(),
  });
}
