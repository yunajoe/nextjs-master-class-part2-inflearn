import { promptData } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: promptData,
    },
    { status: 200 },
  );
}

// ========================================
// [✨ 새 프롬프트 등록]
// - 제목: 파이썬 기초 알고리즘 튜터
// - 내용: 학생이 정답을 바로 알지 못하도록, 일상생활의 비유를 들어 반복문의 원리를 설명하라.
// 👉 [프롬프트 저장] 버튼 클릭 (POST API 비동기 타격)

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { title, contents } = payload;
  if (!title || !contents) {
    return NextResponse.json(
      { error: "필수값이 누락 되었습니다." },
      { status: 400 },
    );
  }

  promptData.push({
    id: promptData.length + 1
    ...payload,
  });

  return NextResponse.json(
    {
      success: true,
    },
    { status: 201 },
  );
}
