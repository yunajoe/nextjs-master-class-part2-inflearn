import { db, Prompt } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(db.prompts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: "데이터가 누락 되었습니다" },
      { status: 400 },
    );
  }

  const newPrompt: Prompt = {
    id: Date.now().toString(),
    title: body.title,
    content: body.content,
    updatedAt: new Date().toISOString(),
  };
  db.prompts.unshift(newPrompt);

  return NextResponse.json(newPrompt, { status: 20 });
}
