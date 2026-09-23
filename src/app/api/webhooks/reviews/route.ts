import { NextRequest, NextResponse } from "next/server";

export interface CourseReview {
  id: number;
  studentName: string;
  courseTitle: string;
  rating: number;
  comment: string;
  timestamp: string;
}

type InputData = Omit<CourseReview, "id">;

const reviews: CourseReview[] = [];
export async function GET() {
  return NextResponse.json(
    { success: true, data: reviews },
    {
      status: 200,
    },
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: InputData = await request.json();
    if (!body.studentName || !body.courseTitle || !body.comment) {
      return NextResponse.json(
        { error: "필수 리뷰 정보가 누락되었습니다." },
        { status: 400 },
      );
    }
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "별점은 1점에서 5점 사이여야 합니다." },
        { status: 400 },
      );
    }

    // timestamp
    reviews.push({
      ...body,
      id: reviews.length + 1,
      timestamp: new Date().toISOString(),
    });
    console.log(
      `🎉 [수강평 수신] ${body.studentName}님이 '${body.courseTitle}'에 ${body.rating}점 리뷰를 남겼습니다!`,
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "시스템 오류",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
