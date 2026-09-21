# 이벤트 기반 아키텍처(EDA)와 웹훅(Webhook)

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

## 6. Postman의 역할

웹훅 강의에서 Postman(포스트맨)은 "가짜 GitHub 서버 역할(시뮬레이터)"을 하는 도구입니다.

조금 더 쉽게 설명해 드릴게요!

### Postman이 필요한 이유

1. **외부망과 내 컴퓨터의 차이**

- 우리가 만든 Next.js 서버는 현재 내 컴퓨터(`localhost:3000`)에서만 돌아가고 있습니다.
- 진짜 GitHub 서버는 인터넷상에 떠 있는 외부 서버이기 때문에, 내 컴퓨터 안으로 직접 들어와서 "별이 눌렸다!" 하고 POST 요청을 쏠 수 없습니다. (실제 서비스를 배포하기 전까지는 외부에서 접근이 불가능하죠.)

2. **기다리지 않고 직접 테스트하기 위해**

- 실제로 GitHub에 들어가서 누군가 내 레포지토리에 별을 누를 때까지 기다릴 수는 없겠죠?
- 그래서 **"내가 마치 GitHub 서버인 것처럼"** 가짜 데이터(JSON)를 만들어서 내 로컬 서버(`localhost:3000/api/webhooks/github`)로 직접 쏘아주는 **테스트용 발사대**가 필요한데, 그 역할을 해주는 프로그램이 바로 **Postman**입니다.

### 요약하자면

- **평소(실서비스 운영 시):** 진짜 GitHub 서버가 우리 서버로 웹훅을 쏨
- **개발 중 테스트 시:** Postman이 GitHub 서버인 척하며 우리 서버로 테스트 데이터를 쏨 (`POST` 요청 전송)

즉, "내가 만든 웹훅 코드가 데이터를 잘 받아서 처리하는지 내 손으로 직접 검증해 보는 도구"라고 이해하시면 됩니다!

## 7. 서버가 클라이언트 역할을 한다는 의미?

- "누가 먼저 HTTP 요청(Request)을 보내느냐"에 따라 클라이언트와 서버의 역할이 순간적으로 뒤바뀌기 때문입니다.

- 네트워크 세상에서 클라이언트와 서버의 고정된 직함은 없습니다. **요청을 보내는 쪽이 클라이언트, 요청을 받아서 응답을 주는 쪽이 서버**가 될 뿐입니다.

### 역할이 역전되는 과정

1. **평소의 관계 (우리가 클라이언트)**

- 우리가 GitHub에 코드를 올리거나 레포지토리 정보를 조회할 때, **우리 서버가 먼저** GitHub에게 HTTP 요청을 보냅니다. 이때는 우리 서버가 **클라이언트**, GitHub가 **서버**입니다.

2. **웹훅이 발생했을 때 (GitHub이 클라이언트)**

- 누군가 내 레포지토리에 '별(Star)'을 누르는 순간, GitHub 서버 내부에서 사건(Event)이 일어납니다.
- GitHub은 이 사실을 **우리 서버에게 알려주어야** 합니다.
- 그러려면 가만히 기다릴 게 아니라, GitHub 측에서 먼저 **우리 서버의 주소로 HTTP POST 요청을 쏘아 보내야** 합니다.
- 이렇게 **요청을 직접 생성해서 쏘아 보내는 주체**가 되었기 때문에, 이 순간만큼은 GitHub이 '클라이언트'가 되고, 그 요청을 받아먹는 우리의 Next.js 서버가 '서버'가 되는 것입니다.

### 📦 아주 쉬운 비유로 이해하기

- **평소 (우리가 클라이언트):**
  우리가 피자 가게(GitHub)에 전화해서 _"피자 한 판 배달해 주세요!"_ 하고 먼저 주문(요청)하는 상황입니다. (우리가 손님=클라이언트)
- **웹훅 (GitHub이 클라이언트):**
  피자 가게에 새로운 신메뉴가 나왔을 때, 피자 가게(GitHub) 직원분이 우리 집 현관문 앞에 찾아와서 띵동 하고 **신메뉴 전단지(데이터)를 툭 던져주고 가는** 상황입니다.
