import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const targetIndex = db.prompts.findIndex((item) => item.id === id);
  if (targetIndex === -1) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  db.prompts[targetIndex] = {
    ...db.prompts[targetIndex],
    title: body.title || db.prompts[targetIndex].title,
    content: body.content || db.prompts[targetIndex].title,
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(db.prompts[targetIndex]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const targetIndex = db.prompts.findIndex((p) => p.id === id);
  if (targetIndex === 1) {
    return NextResponse.json({ error: "Not Found" }, { status: 400 });
  }
  db.prompts.splice(targetIndex, 1);

  return NextResponse.json({ message: "삭제 완료" });
}
