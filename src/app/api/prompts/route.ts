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
    id: promptData.length + 1,
    ...payload,
    updatedAt: new Date().toLocaleString(),
  });

  return NextResponse.json(
    {
      success: true,
    },
    { status: 201 },
  );
}
