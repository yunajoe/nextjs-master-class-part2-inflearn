import { NextRequest, NextResponse } from "next/server";

interface StarEvent {
  sender: { login: string; avatar_url: string };
  repository: { full_name: string };
  starred_at?: string;
}

let starEvents: StarEvent[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: StarEvent = await request.json();

    if (!body.sender.login || !body.repository.full_name) {
      return NextResponse.json(
        { error: "유효하지 않은 데이터 규격입니다." },
        { status: 400 },
      );
    }

    body.starred_at = new Date().toISOString();
    starEvents = [body, ...starEvents].slice(0, 5);

    return NextResponse.json({ message: "시스템 기록 완료" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "시스템 내부 오류" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    events: starEvents,
    updatedAt: new Date().toISOString(),
  });
}
