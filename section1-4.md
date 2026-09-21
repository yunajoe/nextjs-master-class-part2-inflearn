# 실습 튜토리얼: 외부 연동용 RESTful API 구축 실전 (Postman & UI 연동)

## 1. 프로젝트 폴더 구조 (풀스택 아키텍처)

백엔드 웹훅 수신 API부터 프론트엔드 UI 대시보드까지 유기적으로 연결된 구조입니다.

```text
src/
└── app/
    ├── globals.css              <-- 전역 시스템 스타일링 (다크 테마)
    ├── layout.tsx               <-- 앱 최상위 뼈대 (헤더 포함)
    ├── page.tsx                 <-- 메인 진입점 (대시보드)
    ├── api/
    │   └── webhooks/
    │       └── stars/
    │           └── route.ts     <-- [백엔드] 웹훅 수신(POST) 및 데이터 제공(GET)
    └── notifications/
        └── page.tsx             <-- [프론트엔드] 실시간 알림 피드 화면

```

## 2. 백엔드 아키텍처: 웹훅 수신소 (`route.ts`)

- **위치:** `src/app/api/webhooks/stars/route.ts`
- **주요 역할:** 외부(GitHub 등)에서 보내주는 `POST` 요청을 받아 유효성 검증 후 데이터를 저장하고, 프론트엔드의 `GET` 요청에 최신 이벤트 목록을 제공합니다.
- **아키텍트 방어선:** 메모리 오버플로우(DDoS 등)를 막기 위해 배열 슬라이싱(`slice(0, 5)`)을 적용하여 최대 5개의 데이터만 유지합니다.

```typescript
import { NextRequest, NextResponse } from "next/server";

interface StarEvent {
  sender: { login: string; avatar_url: string };
  repository: { full_name: string };
  starred_at?: string;
}

let starEvents: StarEvent[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: StarEvent = await request.json();

    if (!body.sender?.login || !body.repository?.full_name) {
      return NextResponse.json(
        { error: "유효하지 않은 데이터 규격입니다." },
        { status: 400 },
      );
    }

    body.starred_at = new Date().toISOString();
    starEvents = [body, ...starEvents].slice(0, 5); // 최대 5개 유지

    return NextResponse.json({ message: "시스템 기록 완료" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "시스템 내부 오류" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    events: starEvents,
    updatedAt: new Date().toISOString(),
  });
}
```

## 3. 프론트엔드 아키텍처: 실시간 알림 피드 (`page.tsx`)

- **위치:** `src/app/notifications/page.tsx`
- **핵심 포인트:**
- **서버 컴포넌트 활용:** 브라우저가 아닌 서버 내부에서 렌더링되어 API 호출 로직이 노출되지 않아 보안성이 높습니다.
- **`cache: "no-store"`:** Next.js의 캐시를 파괴하고 매번 신선한 최신 데이터를 가져와 **실시간성**을 보장합니다.

```typescript
interface NotificationData {
  events: {
    sender: { login: string; avatar_url: string };
    repository: { full_name: string };
    starred_at: string;
  }[];
  updatedAt: string;
}

export default async function NotificationsPage() {
  const response = await fetch("http://localhost:3000/api/webhooks/stars", {
    cache: "no-store",
  });

  const data: NotificationData = await response.json();

  return (
    <div style={{ padding: "40px", maxWidth: "700px" }}>
      <h1 style={{ color: "var(--primary)" }}>실시간 GitHub 알림 피드</h1>
      <p style={{ color: "#94a3b8" }}>
        마지막 동기화: <strong>{new Date(data.updatedAt).toLocaleTimeString()}</strong>
      </p>
      <hr style={{ borderColor: "#1e293b", margin: "20px 0" }} />

      {data.events.length === 0 ? (
        <div style={{ padding: "20px", backgroundColor: "#1e293b", borderRadius: "8px" }}>
          <p>⏳ 아직 수신된 알림이 없습니다.</p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {data.events.map((event, index) => (
            <li key={index} style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "15px", padding: "15px", backgroundColor: "#1e293b", borderRadius: "8px" }}>
              <img src={event.sender.avatar_url} alt="profile" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
              <div>
                <strong>{event.sender.login}</strong>님이
                <span style={{ color: "var(--primary)", fontWeight: "bold" }}> {event.repository.full_name}</span> 저장소에 별을 눌렀습니다!
                <br />
                <small style={{ color: "#94a3b8" }}>{new Date(event.starred_at).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

```

## 4. 시스템 검증 테스트 시나리오

1. **초기 상태 점검 (GET UI):** 브라우저에서 `http://localhost:3000/notifications` 접속 시 빈 피드 확인
2. **외부 이벤트 시뮬레이션 (POST):** Postman에서 `POST`, `http://localhost:3000/api/webhooks/stars`로 아래 JSON 페이로드 전송 (`201 Created` 확인)

```json
{
  "sender": {
    "login": "ArchitectUser",
    "avatar_url": "https://avatars.githubusercontent.com/u/9919?v=4"
  },
  "repository": { "full_name": "vercel/next.js" }
}
```

3. **실시간 렌더링 검증:** 브라우저 새로고침 시 알림 피드에 데이터가 즉시 반영되는지 확인
4. **방어선 검증:** 필수 데이터(repository 등)를 고의로 누락하여 전송 시 `400 Bad Request` 에러 및 데이터 오염 방지 확인
