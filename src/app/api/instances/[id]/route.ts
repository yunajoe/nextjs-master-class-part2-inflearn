import { NextResponse } from "next/server";

interface InstanceDetail {
  id: string;
  status: string;
  cpuUsage: number;
  description: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const data: InstanceDetail = {
    id,
    status: "Active",
    cpuUsage: Math.floor(Math.random() * 30) + 10, // 10~40 사이의 랜덤 CPU 값
    description: "보안 구역에서 실시간으로 수집된 무결성 데이터입니다.",
  };
  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-System-Arch": "",
    },
  });
}
