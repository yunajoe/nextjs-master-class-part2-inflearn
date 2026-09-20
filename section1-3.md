# 07강. 이벤트 기반 아키텍처(EDA)와 웹훅(Webhook)

## 1. 전통적인 방식의 한계와 폴링 (Polling)

- **동기식 구조의 한계:** 기존의 Request-Response 구조는 클라이언트가 먼저 요청해야만 서버가 응답하는 수동적인 방식이므로, 실시간 웹 환경에는 부적합합니다.
- **폴링(Polling)이란?:** 클라이언트가 서버 상태 변화를 주기적으로 찔러보며 확인하는 방식 (예: 1초마다 GitHub API로 "별 눌렸어?"라고 묻기)
- **폴링의 문제점:**
- 변화가 없어도 불필요한 네트워크 커넥션과 TCP 핸드셰이크가 반복됨.
- 서버 CPU 부하 및 **막대한 인프라 비용(네트워크 대역폭) 낭비**를 초래하는 최악의 안티 패턴.

## 2. 이벤트 기반 아키텍처(EDA)와 웹훅(Webhook)

- **개념:** 시스템 컴포넌트가 강하게 결합되지 않고, '사건(Event)'이 발생했을 때 이를 구독(Subscribe)한 대상에게 방송(Publish)하는 구조.
- **웹훅(Web + Hook):** 웹 생태계에서 이벤트 기반 아키텍처를 구현하는 강력한 도구. (사용자 정의 HTTP 콜백)
- **역할의 역전:**
- 평소에는 우리 서버가 클라이언트이지만, **이벤트 발생 순간(예: GitHub에 별이 눌림) 외부 서버가 HTTP 클라이언트로 변신**하여 미리 약속된 우리 서버의 주소로 `POST` 요청을 보냄.
- 네트워크 낭비가 0%에 수렴하며 실시간성 보장.

## 3. Next.js 실무 아키텍처 구현 (`route.ts`)

- **위치:** `src/app/api/webhooks/github/route.ts`

```typescript
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

    // 핵심: 재시도 폭격 방지를 위한 신속한 200 응답
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("🔴 웹훅 처리 중 오류 발생:", error);
    return NextResponse.json(
      { message: "잘못된 페이로드 규격입니다." },
      { status: 400 },
    );
  }
}
```

## 4. 핵심 실무 포인트

1. **엄격한 타입 규격:** 외부에서 들어오는 데이터이므로 TypeScript 인터페이스를 통해 필요한 데이터(`action`, `repository`, `sender`)만 정밀하게 추출.
2. **신속한 수신 확인 (`status: 200`):**

- 웹훅 발송 서버는 응답이 늦거나 에러(500)가 나면 전송 실패로 간주해 동일한 데이터를 계속 재전송(재시도 폭격)함.
- 따라서 **즉시 `status: 200`을 반환**하고, 무거운 비즈니스 로직(메일 발송, DB 저장 등)은 응답 후 백그라운드에서 처리하는 것이 정석.

3. **보안 (심화):** 해커의 위장 웹훅을 막기 위해 **HMAC 서명 검증** 단계가 필수적으로 동반되어야 함.

## 5. Postman을 이용한 로컬 테스트 방법

- **메서드 & 주소:** `POST`, `http://localhost:3000/api/webhooks/github` (실제 외부 연동 시에는 `ngrok` 같은 로컬 터널링 도구 필요)
- **Request Body (JSON):**

```json
{
  "action": "created",
  "repository": {
    "full_name": "master-class/nextjs",
    "stargazers_count": 999
  },
  "sender": {
    "login": "super-developer"
  }
}
```
