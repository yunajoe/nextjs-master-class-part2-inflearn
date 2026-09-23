import { NextResponse } from "next/server";

export interface DATA {
  id: number;
  studentName: string;
  courseTitle: string;
  rating: number;
  comment: string;
}

type InputData = Omit<DATA, "id">;

const data: DATA[] = [];
export async function GET() {
  return NextResponse.json(
    { success: true, data },
    {
      status: 200,
    },
  );
}

export async function POST(request: Request) {
  const body: InputData = await request.json();
  const { studentName, courseTitle, rating } = body;
  data.push({
    id: data.length + 1,
    ...body,
  });

  console.log(
    `[수강평 수신] ${studentName}이 ${courseTitle}에 ${rating}점 리뷰를 남겼습니다`,
  );
  return NextResponse.json({ success: true }, { status: 201 });
}
