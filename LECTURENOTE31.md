# 병렬 라우트(Parallel Routes)와 `default.tsx` 정리

## 1. 구조

```
src/app/portal/
├── layout.tsx            ← 슬롯 3개를 조립 (children, notifications, qa)
├── page.tsx              ← children 슬롯 (/portal)
├── default.tsx           ← children 슬롯의 대체 화면
├── @notifications/
│   ├── page.tsx          ← /portal
│   ├── loading.tsx
│   ├── default.tsx
│   └── history/page.tsx  ← /portal/history (이 슬롯에만 존재)
└── @qa/
    ├── page.tsx          ← /portal
    ├── loading.tsx
    └── default.tsx
```

- `@폴더명`은 슬롯이고, `layout.tsx`에 **같은 이름의 props**로 주입됩니다.
- 레이아웃은 슬롯 내부가 어떻게 동작하는지 몰라도 되고, 배치만 담당합니다.

## 2. 각 파일의 역할

| 파일          | 역할                                                                     |
| ------------- | ------------------------------------------------------------------------ |
| `page.tsx`    | URL에 매칭될 때 슬롯이 보여줄 실제 화면                                  |
| `loading.tsx` | 해당 슬롯을 자동으로 `<Suspense>`로 감싸 독립 로딩 화면 제공 (장애 격리) |
| `default.tsx` | **하드 네비게이션 때 매칭되는 `page.tsx`가 없는 슬롯**의 대체 화면       |

## 3. 소프트 vs 하드 네비게이션

| 구분                             | 동작                                   | 매칭 안 된 슬롯                |
| -------------------------------- | -------------------------------------- | ------------------------------ |
| 소프트 (`<Link>`, `router.push`) | 클라이언트가 슬롯별 상태를 기억        | **이전 화면 유지**             |
| 하드 (F5, 주소창 입력)           | 상태가 사라지고 서버가 URL로 새로 결정 | **`default.tsx`** (없으면 404) |

## 4. 핵심 원리

- 각 슬롯은 같은 URL을 **자기 폴더 기준으로 독립적으로 매칭**합니다.
- `/portal/history`로 이동하면 `@notifications/history/page.tsx`만 존재하므로 **왼쪽만** 바뀌고, 나머지는 소프트에서는 유지, 하드에서는 `default.tsx`로 대체됩니다.
- 링크가 어느 슬롯 안에 있든 상관없습니다. URL이 모든 슬롯을 동시에 결정할 뿐입니다.

## 5. 올바른 테스트 방법

1. `/portal` 접속 → 슬롯별 독립 로딩 확인 (알림 1초, Q&A 2초)
2. `📜 알림 히스토리 보기` 클릭 → `/portal/history`, **왼쪽만 교체**, 나머지 유지 (소프트)
3. 그 상태에서 **F5** → 가운데와 오른쪽이 `default.tsx`로 전환 (하드)
4. `/portal`에서 F5 → `default.tsx` 안 보임 (정상)

## 7. `/portal/history`에서 404가 날 때 체크리스트

1. `portal/default.tsx` 존재 여부 (가장 흔한 원인)
2. `@qa/default.tsx` 존재 여부
3. `history/page.tsx` 위치가 `@notifications/history/page.tsx`인지
4. `.next` 삭제 후 `npm run dev` 재시작
5. 프로젝트 루트에 `app/`과 `src/app/`이 **중복**되지 않는지
6. 파일이 `export default function`으로 내보내고 있는지, 확장자가 `.tsx`인지

## 한 줄 결론

> `default.tsx`는 "하드 네비게이션 + 해당 슬롯에 매칭되는 page가 없을 때"만 보이는 대체 화면이고, `/portal` 자체에서는 절대 보이지 않는다.
