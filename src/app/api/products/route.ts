import { NextResponse } from "next/server";

interface Product {
  id: number;
  name: string;
  price: number;
}

/**
 *  인메모리 스토리지 (In-memory DB)
 */

const products: Product[] = [
  { id: 1, name: "초경량 노트북", price: 1200000 },
  { id: 2, name: "무소음 키보드", price: 185000 },
];

/**
 *  GET 메서드 핸들러
 * 통제 지시: 함수명은 반드시 대문자 'GET'이어야 합니다.
 */

export async function GET() {
  console.log("LOG: 상품 데이터 조회 요청 수신");
  return NextResponse.json(products);
}

/**
 * 4. POST 메서드 핸들러
 * 🚨 통제 지시: 함수명은 반드시 대문자 'POST'이어야 합니다.
 */

export async function POST(request: Request) {
  try {
    const body: Partial<Product> = await request.json();

    // [단계 2] 1차 방어선 구축 (Validation)
    // 필수 데이터가 누락되었다면 시스템은 즉시 요청을 반려합니다.
    if (!body.name || !body.price) {
      return NextResponse.json(
        {
          error: "상품 명칭 또는 가격 정보가 누락되었습니다.",
        },
        { status: 400 },
      );
    }

    const newProduct = {
      id: products.length + 1,
      name: body.name,
      price: Number(body.price),
    };
    products.push(newProduct);

    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "서버 내부에서 요청을 처리하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}
