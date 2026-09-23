import { promptData } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { title, contents } = await request.json();
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "id가 없습니다.",
        },
        { status: 400 },
      );
    }
    const targetData = promptData.find((item) => item.id === Number(id));
    if (!targetData) {
      return NextResponse.json(
        {
          success: false,
          message: "찾는 아이템이 존재 하지 않습니다.",
        },
        { status: 400 },
      );
    }
    const targetIndex = promptData.findIndex((item) => item.id === Number(id));
    promptData.splice(targetIndex, 1);

    const newData = {
      ...targetData,
      title,
      contents,
    };
    promptData.push(newData);

    return NextResponse.json(
      {
        success: true,
        message: "수정되었습니다.",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        error: "알 수 없는 에러",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "id가 없습니다.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "삭제 되었습니다",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        error: "알 수 없는 에러",
      },
      { status: 500 },
    );
  }
}
