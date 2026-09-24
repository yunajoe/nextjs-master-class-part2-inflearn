# HTML 폼 전송의 역사와 RPC의 부활

## 1. RPC (Remote Procedure Call)

### 정의

- 원격 서버의 함수를 로컬 함수처럼 호출하는 기술
- 네트워크 통신의 복잡성을 추상화하여 개발자가 비즈니스 로직에 집중하도록 함

### 작동 원리

1. Client Stub이 함수와 인자를 직렬화(Marshalling)
2. 네트워크를 통해 서버로 전송
3. Server Skeleton이 데이터를 역직렬화(Unmarshalling)
4. 서버에서 실제 함수 실행 후 결과 반환

### 장단점

- **장점:** 네트워크 통신 추상화, 개발 생산성 향상
- **단점:** 네트워크 지연·장애 파악이 어려울 수 있으며, 클라이언트와 서버 간 결합도가 높아질 수 있음

> RPC는 네트워크 통신을 없애는 것이 아니라, 함수 호출 형태로 추상화하는 방식이다.

## 2. 웹 Mutation 아키텍처의 진화

| 시대     | 방식           | 특징                                      | 한계                                  |
| -------- | -------------- | ----------------------------------------- | ------------------------------------- |
| 1990년대 | HTML Form      | 브라우저가 폼 데이터를 인코딩해 POST 요청 | 전체 페이지 새로고침                  |
| 2010년대 | SPA + AJAX     | 비동기 요청으로 새로고침 없이 화면 갱신   | 통신 관련 보일러플레이트 증가         |
| 현대     | Server Actions | 서버 함수를 직접 호출하는 RPC 방식        | 네트워크·보안·검증 처리는 여전히 필요 |

### HTML Form

- `action`에 요청 경로, `method`에 HTTP 메서드 지정
- JavaScript 없이 폼 데이터 전송 가능
- 단점: 전체 페이지 새로고침 발생

### SPA + AJAX

- `event.preventDefault()`로 기본 제출 동작 방지
- 폼 데이터 수집 후 `fetch()`로 API 요청
- 장점: 새로고침 없는 UX
- 단점: 데이터 직렬화, 요청, 로딩 및 에러 처리 코드 증가

## 3. Next.js Server Actions

### 정의

- RPC 원리를 활용해 서버 함수를 클라이언트에서 호출할 수 있도록 하는 기능
- `'use server'` 지시어로 서버에서 실행될 함수 선언

### 핵심 특징

- `<form action={saveUser}>` 형태로 서버 함수 연결
- Next.js가 함수 호출을 위한 네트워크 통신과 데이터 직렬화를 처리
- 내부적으로 POST 요청을 통해 실행
- `revalidatePath()` 등을 활용해 데이터 변경 후 캐시 갱신 가능

### 주의사항

- 네트워크 통신 자체가 제거되는 것은 아님
- 인증, 권한 검증, 데이터 유효성 검사는 직접 구현해야 함
- 타입 공유가 런타임 데이터 검증을 대체하지 않음

## 4. Route Handler vs Server Actions

| 구분          | Route Handler (REST API)                  | Server Actions                          |
| ------------- | ----------------------------------------- | --------------------------------------- |
| 엔드포인트    | 개발자가 URL 설계                         | 프레임워크가 내부 호출 처리             |
| 호출 방식     | `fetch()` / `axios`                       | 서버 함수 호출                          |
| 데이터 직렬화 | 직접 처리하거나 라이브러리 활용           | 프레임워크가 처리                       |
| 타입 안정성   | 별도 타입 공유·검증 필요                  | 함수 타입을 클라이언트 코드와 공유 가능 |
| 캐시 갱신     | 클라이언트에서 별도 처리 가능             | `revalidatePath()` 등과 통합            |
| 주요 용도     | 외부 API, 모바일 앱, 공개 HTTP 인터페이스 | 웹 앱 내부의 데이터 변경                |

## 5. 핵심 정리

- **RPC:** 원격 서버 함수를 로컬 함수처럼 호출하는 아키텍처
- **HTML Form:** 브라우저 기본 기능을 통한 전통적인 폼 전송 방식
- **SPA + AJAX:** 비동기 통신으로 UX를 개선했지만 통신 코드 증가
- **Server Actions:** HTML Form의 단순함과 RPC의 함수 호출 모델을 현대 Next.js에 통합
- **Route Handler:** 명시적인 HTTP API가 필요한 경우 활용
- **Server Actions:** 웹 앱 내부의 서버 데이터 변경을 간결하게 구현할 때 활용

> **핵심 관점:** Server Actions는 네트워크 통신을 없애는 기술이 아니라, 통신의 복잡성을 프레임워크에 위임하고 서버 함수 중심으로 개발할 수 있게 하는 RPC 기반 추상화다.

# Server Actions & Modern Mutation

## 1. RPC (Remote Procedure Call)

### 정의

- RPC(원격 프로시저 호출)는 원격 서버의 함수를 마치 로컬 함수처럼 호출하는 기술이다.
- 네트워크 통신의 복잡성을 추상화하여 개발자가 비즈니스 로직에 집중할 수 있도록 한다.

### 작동 원리

1. 클라이언트에서 원격 함수를 호출
2. Client Stub이 함수와 인자를 직렬화(Marshalling)
3. 네트워크를 통해 서버로 요청 전송
4. Server Skeleton이 데이터를 역직렬화(Unmarshalling)
5. 서버에서 실제 함수를 실행하고 결과 반환

### 장단점

| 구분 | 설명                                                 |
| ---- | ---------------------------------------------------- |
| 장점 | 네트워크 통신의 복잡성을 추상화하여 개발 생산성 향상 |
| 단점 | 네트워크 지연 및 장애가 감춰질 수 있음               |
| 단점 | 클라이언트와 서버 간 결합도가 높아질 수 있음         |

> RPC는 네트워크 통신을 없애는 기술이 아니라, 원격 함수 호출을 로컬 함수처럼 추상화하는 기술이다.

---

## 2. 웹 Mutation 아키텍처의 진화

웹에서 서버 데이터를 변경하는 방식은 HTML Form에서 SPA + AJAX를 거쳐 Server Actions로 발전했다.

| 시대     | 방식           | 특징                                         | 한계                                  |
| -------- | -------------- | -------------------------------------------- | ------------------------------------- |
| 1990년대 | HTML Form      | 브라우저가 폼 데이터를 인코딩해 POST 요청    | 전체 페이지 새로고침                  |
| 2010년대 | SPA + AJAX     | 비동기 요청으로 새로고침 없는 UX 제공        | 통신 관련 보일러플레이트 증가         |
| 현대     | Server Actions | 서버 함수를 직접 호출하는 RPC 기반 개발 모델 | 네트워크·보안·검증 처리는 여전히 필요 |

### HTML Form

- `action`에 요청 경로, `method`에 HTTP 메서드를 지정
- JavaScript 없이 폼 데이터를 서버로 전송 가능
- 브라우저가 폼 데이터 인코딩과 요청을 처리
- 단점: 전체 페이지가 새로고침됨

### SPA + AJAX

- `event.preventDefault()`로 기본 폼 제출 동작 방지
- 폼 데이터를 수집해 `fetch()` 등으로 API 요청
- 새로고침 없는 동적인 UI 구현 가능
- 단점: 요청 구성, 데이터 직렬화, 로딩 및 에러 처리 코드 증가

---

## 3. Next.js Server Actions와 RPC

### 정의

- Server Actions는 서버에서 실행되는 함수를 클라이언트에서 호출할 수 있도록 하는 Next.js 기능이다.
- RPC의 함수 호출 모델을 활용하며, 데이터 변경(Mutation)에 적합하다.
- `'use server'` 지시어를 사용해 서버에서 실행할 함수를 선언한다.

### 기본 구현

```tsx
// actions.ts
"use server";

export async function createUser(formData: FormData) {
  const username = formData.get("username");

  await db.user.create({
    data: { name: String(username) },
  });
}
```

```tsx
// page.tsx
import { createUser } from "./actions";

export default function Page() {
  return (
    <form action={createUser}>
      <input name="username" />
      <button type="submit">저장</button>
    </form>
  );
}
```

### 작동 흐름

```text
[Client Component]
       │
       │ createUser()
       ▼
[Next.js Client Runtime]
       │
       │ 함수 식별 및 인자 직렬화
       ▼
[HTTP POST Request]
       │
       ▼
[Next.js Server Runtime]
       │
       │ Server Action 실행
       ▼
[Database 변경]
       │
       ▼
[결과 반환 및 UI 갱신]
```

### 핵심 특징

- 클라이언트에서 서버 함수를 직접 호출하는 형태로 작성
- Next.js가 함수 호출에 필요한 네트워크 통신과 직렬화를 처리
- HTML Form의 `action`에 Server Action을 연결 가능
- `revalidatePath()` 등을 활용해 데이터 변경 후 캐시 갱신 가능

> Server Actions는 네트워크 통신을 제거하는 것이 아니라, 통신 계층의 상당 부분을 프레임워크가 추상화하는 기술이다.

## 4. REST API와 Server Actions의 차이

### REST API를 사용하는 `createUser()`

REST API를 사용하더라도 `createUser()`라는 함수를 만들 수 있다.

```ts
// lib/api.ts
export async function createUser(name: string) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return response.json();
}
```

이때 `createUser()`는 REST API를 호출하는 **클라이언트 함수(Wrapper)** 이다.

```text
createUser("Alice")
       ↓
fetch('/api/users')
       ↓
REST API
       ↓
서버에서 사용자 생성
```

### Server Actions의 `createUser()`

```ts
// actions.ts
"use server";

export async function createUser(name: string) {
  await db.user.create({
    data: { name },
  });
}
```

이때 `createUser()`는 REST API를 호출하는 함수가 아니라, **서버에서 직접 실행되는 Server Action**이다.

```text
createUser("Alice")
       ↓
Next.js가 관리하는 POST 요청
       ↓
Server Action 실행
       ↓
DB에 사용자 생성
```

### 핵심 비교

| 구분        | REST API Wrapper                | Server Action               |
| ----------- | ------------------------------- | --------------------------- |
| 함수의 역할 | REST API 호출                   | 서버에서 비즈니스 로직 실행 |
| 호출 방식   | `fetch()` 등으로 HTTP 요청      | 서버 함수 호출 형태         |
| 엔드포인트  | 개발자가 설계                   | Next.js가 내부 호출 처리    |
| 직렬화      | 직접 처리하거나 라이브러리 활용 | 프레임워크가 처리           |
| 실행 위치   | 클라이언트                      | 서버                        |

**중요:** `createUser()`라는 함수 이름만으로 REST API인지 Server Action인지 구분할 수 없다. 함수의 실행 위치와 서버 기능을 호출하는 방식이 핵심이다.

---

## 5. Server Actions 내부에서 REST API를 호출한다면?

Server Action 내부에서 기존 REST API를 호출하는 것도 가능하다.

```ts
// actions.ts
"use server";

export async function createUser(name: string) {
  const response = await fetch("https://example.com/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return response.json();
}
```

이 경우 구조는 다음과 같다.

```text
[Client]
    │
    │ 1. Server Action 호출
    ▼
[Next.js Server Action]
    │
    │ 2. fetch()로 REST API 요청
    ▼
[Backend REST API]
    │
    ▼
[Database]
```

### 특징

- 클라이언트 → Server Action: Next.js가 처리하는 네트워크 요청
- Server Action → REST API: 개발자가 작성한 HTTP 요청
- 총 두 번의 네트워크 통신이 발생할 수 있음
- REST API 호출에 필요한 URL, HTTP 메서드, 헤더, 데이터 직렬화는 여전히 필요

즉, Server Action을 사용한다고 해서 내부 REST API 통신까지 자동으로 추상화되는 것은 아니다.

---

## 6. 그렇다면 왜 Server Action 내부에서 REST API를 호출할까?

핵심은 **서버를 중간 계층(BFF)으로 활용할 필요가 있는가**이다.

### Server Action을 경유하는 이유

| 이유             | 설명                                           |
| ---------------- | ---------------------------------------------- |
| 인증 정보 보호   | 서버에 보관된 비밀 키나 백엔드 인증 토큰 활용  |
| 인증·권한 검증   | 서버에서 사용자 인증 및 권한 확인              |
| 데이터 검증·가공 | 백엔드에 전달하기 전 데이터 검증 및 변환       |
| API 조합         | 여러 백엔드 API 호출을 하나의 서버 함수로 통합 |
| 응답 가공        | 백엔드 응답을 클라이언트에 필요한 형태로 변환  |

### 반대로, 굳이 사용할 필요가 없는 경우

- 클라이언트에서 REST API를 직접 호출해도 문제가 없는 경우
- 서버에서 별도로 처리할 인증·검증·가공 로직이 없는 경우
- Server Action이 단순히 REST API 호출만 전달하는 래퍼인 경우

이때는 클라이언트에서 REST API를 직접 호출하는 편이 더 단순할 수 있다.

> Server Action 내부에서 REST API를 호출하는 것은 가능하지만, 별도의 서버 계층이 필요한 이유가 없다면 불필요한 네트워크 왕복과 복잡성만 추가될 수 있다.

---

## 7. Route Handler vs Server Actions

| 구분        | Route Handler (REST API)         | Server Actions                    |
| ----------- | -------------------------------- | --------------------------------- |
| 목적        | HTTP API 제공                    | 서버 함수 호출                    |
| 엔드포인트  | 개발자가 직접 설계               | Next.js가 내부 호출 처리          |
| 호출 방식   | `fetch()` / `axios`              | 함수 호출 형태                    |
| 주요 사용처 | 외부 시스템, 모바일 앱, 공개 API | Next.js 웹 앱 내부의 데이터 변경  |
| 캐시 갱신   | API 응답 후 별도 처리 가능       | `revalidatePath()` 등과 통합 가능 |

### 선택 기준

| 상황                                       | 적합한 방식               |
| ------------------------------------------ | ------------------------- |
| 외부 시스템이나 모바일 앱에 API 제공       | Route Handler             |
| 명시적인 HTTP 인터페이스 필요              | Route Handler             |
| Next.js 서버에서 DB 직접 변경              | Server Actions            |
| 서버에서 인증·검증·가공 후 백엔드 API 호출 | Server Actions + REST API |
| 클라이언트에서 API를 직접 호출해도 충분함  | Client → REST API         |

## 8. 최종 핵심 정리

1. **RPC**는 원격 서버 함수를 로컬 함수처럼 호출하는 아키텍처다.
2. **Server Actions**는 RPC의 원리를 Next.js에 통합한 서버 함수 호출 기능이다.
3. Server Actions도 내부적으로 HTTP POST 요청과 데이터 직렬화를 사용한다.
4. REST API에서도 `createUser()` 같은 클라이언트 Wrapper 함수를 만들 수 있다.
5. Server Action은 REST API를 호출하는 함수가 아니라, 서버에서 실행되는 함수다.
6. Server Action 내부에서 REST API를 호출할 수 있지만, 이 경우 추가적인 네트워크 왕복이 발생한다.
7. 서버 계층이 필요한 이유가 없다면 클라이언트에서 REST API를 직접 호출해도 된다.
8. Server Actions는 REST API를 완전히 대체하는 기술이 아니라, 서버 함수 중심으로 데이터 변경을 간결하게 구현하는 대안이다.

> **아키텍처의 핵심은 기술을 무조건 사용하는 것이 아니라, 해당 계층이 필요한 이유를 이해하고 선택하는 것이다.**

# Server Actions vs RPC

## 1. 클라이언트가 서버를 호출하는 방식은 대부분 비슷

### REST API 방식

```ts
await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Yuna",
  }),
});
```

클라이언트가 HTTP 요청을 직접 구성하고, 서버의 특정 URL과 HTTP 메서드를 호출해.

### RPC 스타일 방식

```ts
await createUser({
  name: "Yuna",
});
```

겉으로 보면 그냥 함수를 호출하는 것 같지만, 실제로는 네트워크를 통해 서버의 `createUser` 기능을 실행하는 거야.

즉, RPC는 **원격 서버의 기능을 로컬 함수를 호출하듯 사용할 수 있도록 추상화하는 방식**이라고 이해하면 돼.

## 2. 그렇다면 REST API도 RPC 아닌가?

엄밀히 말하면 REST와 RPC는 서로 다른 설계 스타일이야.

| 구분                   | REST API          | RPC                   |
| ---------------------- | ----------------- | --------------------- |
| 중심 개념              | 리소스(Resource)  | 기능·메서드(Function) |
| 호출 방식              | HTTP 메서드 + URL | 원격 함수·메서드 호출 |
| 예시                   | `POST /users`     | `createUser()`        |
| 개발자가 인식하는 방식 | 리소스에 요청     | 서버 기능을 호출      |

물론 실제 서비스에서는 둘의 경계가 명확하지 않을 수 있어. REST API도 서버 기능을 실행하니까, 넓은 의미에서 원격 프로시저 호출이라고 표현할 수는 있지.

하지만 **REST API를 모두 RPC라고 부르는 것은 일반적인 분류 방식은 아니야.**

## 3. Next.js Server Actions가 RPC 스타일인 이유

```tsx
"use server";

export async function createUser(name: string) {
  // 서버에서 DB에 사용자 저장
}
```

```tsx
"use client";

import { createUser } from "./actions";

await createUser("Yuna");
```

클라이언트 코드에서는 일반 함수를 호출하는 것처럼 보이지만, 실제 실행은 서버에서 이루어져.

Next.js가 함수 호출을 네트워크 요청으로 처리해 주기 때문에 개발자가 직접 `fetch`, URL, HTTP 메서드 등을 작성하지 않아도 되는 거야.

그래서 Server Actions를 **RPC 스타일의 서버 함수 호출 방식**이라고 설명할 수 있어.

### 핵심 정리

- 클라이언트가 서버에 요청하는 것은 웹 개발에서 매우 일반적인 구조야.
- 하지만 모든 클라이언트-서버 통신을 엄밀한 의미의 RPC라고 부르지는 않아.
- **RPC는 원격 서버의 기능을 함수 호출처럼 추상화하는 방식**이고, REST는 리소스를 중심으로 API를 설계하는 방식이야.
- Next.js Server Actions는 서버 함수를 클라이언트에서 직접 호출하는 것처럼 사용할 수 있게 해주는 RPC 스타일의 기능이야.
