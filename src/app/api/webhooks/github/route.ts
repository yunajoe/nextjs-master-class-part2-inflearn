import { NextRequest, NextResponse } from "next/server";

interface GitHubStarPayload {
  action: "created" | "deleted";
  repository: {
    full_name: string;
    stargazers_count: number;
  };
  sender: {
    login: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload: GitHubStarPayload = await request.json();
    const { action, repository, sender } = payload;

    if (action === "created") {
      console.log(
        `🎉 [실시간 알림] ${sender.login}님이 ${repository.full_name}에 별을 눌렀습니다!`,
      );
      console.log(
        `⭐ 현재 총 별 개수는 ${repository.stargazers_count}개입니다.`,
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("🔴 웹훅 처리 중 오류 발생:", error);
    return NextResponse.json(
      { message: "잘못된 페이로드 규칙" },
      { status: 400 },
    );
  }
}
