# RESTful APID와 HTTP 메서드의 본질

## 1. API (시스템 간의 소통 규격)

클라이언트와 서버가 정확한 데이터를 주고받기 위해 합의한 엄격한 계약서로, 데이터 타입이 하나만 달라도 에러를 발생시킵니다.

- **예시:** 모바일 앱이 서버에 가격 데이터를 요청할 때 문자가 아닌 숫자를 보내야 하며, 규격이 틀리면 서버는 `400 Bad Request` 에러를 반환합니다.

## 2. RESTful API의 두 원칙

URL 주소는 자원을 나타내는 **명사**(`products`)로만 구성하고, 처리 목적은 HTTP 메서드(동사)에 온전히 위임합니다.

- `GET`: 데이터 열람 — **예시:** `GET /products` (상품 목록을 가져옴)
- `POST`: 데이터 등록 — **예시:** `POST /products` (새로운 상품을 등록함)
- `PATCH`: 데이터 일부 수정 (실무 선호) — **예시:** `PATCH /products/1` (1번 상품의 가격만 일부 변경함)
- `PUT`: 데이터 전체 덮어씌우기 — **예시:** `PUT /products/1` (1번 상품의 전체 정보를 새 데이터로 덮어씌움)
- `DELETE`: 데이터 폐기 — **예시:** `DELETE /products/1` (1번 상품을 삭제함)

## 3. JSON (기계들의 공용어)

네트워크 전송 비용을 낮추기 위한 가볍고 순수한 키-값 형태의 텍스트 포맷이며, 큰따옴표와 쉼표 등의 문법을 엄격하게 지켜야 합니다.

- **예시:**

```json
{
  "id": 1,
  "name": "초경량 노트북",
  "price": 1200000,
  "inStock": true
}
```

## Next.js에서의 역할

Next.js는 단순한 화면 렌더링 도구를 넘어, Route Handlers(`route.ts`)를 통해 순수한 JSON 데이터를 발행하는 백엔드 API 서버를 직접 구축할 수 있습니다.

- **예시:** 프론트엔드 프로젝트 내부에서 별도의 백엔드 서버 구축 없이 직접 `/api/products` 형태의 API 엔드포인트를 만들어 데이터 처리를 수행할 수 있습니다.

# URL vs URI, Path Variable과 Query String

## 1. URI vs URL 구조 이해

주소창은 단순한 문자열이 아닌 **구조화된 시스템**입니다.

- **URL (Uniform Resource Locator):** 자원이 물리적으로 어디에 있는지 위치를 나타냅니다. (예: `[https://www.mystore.com](https://www.mystore.com)`)
- **URI (Uniform Resource Identifier):** 주소창 전체를 아우르며 인터넷상의 자원을 정확히 식별합니다.

> **💡 주소창 해부도 예시**
> `[https://www.mystore.com/api/products/1?category=laptop&sort=price](https://www.mystore.com/api/products/1?category=laptop&sort=price)`
>
> - **Scheme:** 통신 규약 (`https`)
> - **Host:** 물리적 위치 (`[www.mystore.com](https://www.mystore.com)`)
> - **Path:** 자원의 식별 (`/api/products/1`)
> - **Query String:** 부가적인 조건 (`?category=laptop&sort=price`)

## 2. 데이터를 싣는 두 가지 핵심 아키텍처

RESTful 설계 철학에 따라 목적에 맞게 구분하여 사용합니다.

- **Path Variable (경로 변수) — 대상 확정 (`What`)**
- 수많은 데이터 중 **특정 단 하나**를 타겟팅할 때 사용합니다.
- Next.js 구현: 폴더명을 대괄호로 감싸 표현 (`app/api/products/[id]/route.ts`)
- 호출 예시: `GET /api/products/1` (1번 상품 조회)

- **Query String (쿼리 스트링) — 조건 부여 (`How`)**
- 대상을 필터링하거나 정렬하는 등 **가공 옵션**을 줄 때 사용합니다 (`?`로 시작).
- 호출 예시: `GET /api/products?category=laptop&sort=price`

## 3. NextRequest와 nextUrl을 통한 요청 해독

Next.js는 서버로 들어온 요청을 프레임워크 전용 객체로 안전하게 파싱해 줍니다.

```typescript
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // nextUrl을 통해 복잡한 파싱 없이 쿼리 스트링 추출 가능
  const searchParams = request.nextUrl.searchParams;
  const sortOption = searchParams.get("sort"); // 'price' 추출
}
```

- **NextRequest:** 표준 Request 객체를 확장한 **요청 명세서** (헤더, 쿠키, 본문 등 포함)
- **nextUrl:** URL을 미리 분해해 둔 속성으로, `.searchParams.get()` 등을 통해 안전하게 값을 추출할 수 있습니다.

## 4. NextResponse를 활용한 응답 통제

서버의 처리 결과를 클라이언트에 전달할 때는 **NextResponse**를 사용합니다.

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const responseData = { message: "데이터 등록 성공" };

  return NextResponse.json(responseData, {
    status: 201, // 엄격한 상태 코드 제어 (Created)
    headers: {
      "Content-Type": "application/json",
      "X-System-Arch": "MasterClass", // 시스템 추적을 위한 커스텀 헤더
    },
  });
}
```

- **NextResponse.json:** JSON 데이터 규격 포장, 쿠키 제어, 리다이렉트 등 응답을 통제합니다.
- **Status Code (예: 201 Created):** 단순 성공(200)을 넘어 데이터가 성공적으로 생성되었음을 명확히 알립니다.
- **Custom Headers (`X-`):** 대규모 서비스 환경에서 시스템 추적(Tracing) 및 모니터링을 위해 활용하는 고급 통제 기술입니다.

# Next.js 풀스택 데이터 파이프라인 실습 가이드

## 1. 프로젝트 폴더 구조

프론트엔드 UI와 백엔드 API, 최상단 레이아웃이 정확한 위치에 연결되어야 시스템이 정상 작동합니다.

```text
src/
└── app/
    ├── layout.tsx               <-- 앱의 최상위 HTML 뼈대
    ├── page.tsx                 <-- 메인 진입점 화면
    ├── api/
    │   └── products/
    │       └── [id]/            <-- 동적 API 경로
    │           └── route.ts     <-- 동적 API 엔드포인트 파일
    └── products/
        └── [id]/                <-- 동적 UI 경로
            └── page.tsx         <-- 프론트엔드 UI 화면 파일

```

## 2. 최상위 뼈대와 진입점 구축 (Root Layout & Page)

- **루트 레이아웃 (`src/app/layout.tsx`)**
- `metadata`: 브라우저 탭 제목 및 메타 설명 정의
- `RootLayout`: 모든 하위 페이지(`children`)가 렌더링되는 최상위 부모 컴포넌트 (`<html>`, `<body>` 포함)

- **진입점 화면 (`src/app/page.tsx`)**
- 사용자가 처음 접속하는 기본 화면 (`localhost:3000`)
- `Link` 컴포넌트를 통해 `/products/777` 경로로 이동하는 테스트 버튼 제공

## 3. 동적 라우트 핸들러 구축 (Backend API)

특정 상품 정보를 타겟팅하여 반환하는 백엔드 API 엔드포인트(`src/app/api/products/[id]/route.ts`)입니다.

```typescript
import { NextResponse } from "next/server";

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  description: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // Next.js 15+ 비동기 파라미터 제어

  const product: ProductDetail = {
    id,
    name: `${id}번 상품`,
    price: 50000,
    description: "시스템 통제 센터에서 발행한 안전한 데이터입니다.",
  };

  return NextResponse.json(product);
}
```

> **💡 핵심 포인트:** Next.js 15 버전부터는 `params`를 처리할 때 반드시 `await`를 사용하여 비동기로 해독해야 크래시를 방지할 수 있습니다.

## 4. 서버 컴포넌트 데이터 렌더링 (Frontend UI)

API를 호출해 최신 데이터를 확보하고 브라우저 화면을 조립하는 프론트엔드 화면(`src/app/products/[id]/page.tsx`)입니다.

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // cache: "no-store"를 통해 항상 최신 데이터를 보장
  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });

  const product: Product = await response.json();

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", marginTop: "20px" }}>
      <h1>상품 상세 제어소</h1>
      <hr />
      <p><strong>상품 식별자:</strong> {product.name}</p>
      <p><strong>측정 가치:</strong> {product.price.toLocaleString()}원</p>
      <p><strong>시스템 로그:</strong> {product.description}</p>
      <p><small style={{ color: "gray" }}>요청된 타겟 ID: {id}</small></p>
    </div>
  );
}

```

## 5. 시스템 작동 검증 (타격 테스트)

개발 서버(`npm run dev`) 가동 후 다음 두 가지 방식으로 검증을 진행합니다.

- **테스트 1 (풀스택 파이프라인):** `http://localhost:3000` 접속 ➡️ `[777번 상품 데이터 타격 테스트]` 버튼 클릭 ➡️ `/products/777` 경로로 이동 및 상품 데이터 렌더링 확인
- **테스트 2 (API 직접 타격):** 주소창에 `http://localhost:3000/api/products/999` 입력 ➡️ 화면 없이 순수한 JSON 데이터(`{"id":"999", ...}`) 출력 확인
