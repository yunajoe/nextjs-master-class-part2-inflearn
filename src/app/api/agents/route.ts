import { NextResponse } from "next/server";

interface Data {
  id: number;
  name: string;
  role: string;
}

const agentsData: Data[] = [
  { id: 1, name: "CodeReviewBot", role: "코드 리뷰 및 최적화" },
  { id: 2, name: "DocuSummarizer", role: "긴 문서 요약" },
];

export async function GET() {
  console.log("LOG: AGENTS 데이터 조회 요청 수신");
  return NextResponse.json(agentsData);
}

export async function POST(request: Request) {
  console.log("LOG: AGENTS 데이터 생성 요청 수신");
  try {
    const bodyData: Partial<Data> = await request.json();
    if (!bodyData.name || !bodyData.role) {
      return NextResponse.json(
        { error: "에이전트 이름 또는 역할 정보가 누락되었습니다." },
        { status: 400 },
      );
    }
    const newData = {
      id: agentsData.length + 1,
      name: bodyData.name,
      role: bodyData.role,
    };
    agentsData.push(newData);
    return NextResponse.json(newData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 내부에서 요청을 처리하지 못했습니다." },
      { status: 500 },
    );
  }
}
