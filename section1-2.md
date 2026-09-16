# [CS 아키텍처] 메모이제이션(Memoization)과 HTTP 캐시 제어

실제 서비스 운영 환경에서 서버 과부하를 막고 응답 속도를 높이기 위한 두 가지 핵심 최적화 기법(메모이제이션, HTTP 캐시)을 다룹니다.

## 1. 짧은 기억의 마법: 메모이제이션 (Memoization)

- **개념**: 동일한 계산을 반복해야 할 때, 이전에 계산한 결과값을 메모리에 저장(포스트잇 개념)해 두었다가 동일한 요청이 오면 연산을 생략하고 즉시 반환하는 최적화 기법입니다.
- **작동 원리 (콘솔 테스트 흐름)**:
- **Cache Miss**: 캐시에 데이터가 없으면 무거운 연산(DB 조회 등)을 수행하고 결과를 메모리에 저장합니다.
- **Cache Hit**: 캐시에 데이터가 존재하면 연산 과정을 통째로 건너뛰고 즉시 값을 반환하여 속도를 극대화합니다.

- **한계점**: Next.js의 요청 메모이제이션 등은 **하나의 페이지 렌더링 사이클 내에서만 유효**하며, 렌더링이 끝나면 데이터가 사라집니다.

```javascript
/**
 * 메모이제이션의 아키텍처 원리를 보여주는 개념적 코드 및 테스트
 */
const memoCache: Record<string, any> = {}; // 시스템의 임시 메모리 (포스트잇)

function expensiveCalculation(input: string): string {
  // [Step 1] 캐시 히트(Cache Hit) 검증
  if (memoCache[input]) {
    console.log(`🟢 [Cache Hit] '${input}'에 대한 캐시된 정답을 메모리에서 발견! 즉시 반환합니다.`);
    return memoCache[input]; // 무거운 연산 과정을 통째로 건너뜀
  }

  // [Step 2] 캐시 미스(Cache Miss) 처리 및 무거운 연산 수행
  console.log(`🔴 [Cache Miss] '${input}' 데이터가 없습니다. 데이터베이스를 조회하여 새롭게 연산 중입니다...`);
  const result = `결과값: ${input} 처리 완료`;

  // [Step 3] 연산 결과의 메모리 적재
  memoCache[input] = result; // 다음 요청을 방어하기 위해 포스트잇에 기록

  return result;
}

// 🚀 [실전 테스트 코드] 콘솔에서 직접 실행해 보세요!
console.log("=== 시스템 렌더링 시작 ===");
console.log(expensiveCalculation("user_123")); // Call 1
console.log(expensiveCalculation("user_123")); // Call 2
console.log(expensiveCalculation("user_999")); // Call 3
console.log("=== 시스템 렌더링 종료 ===");


```

## 2. 거대한 글로벌 기억 장치: HTTP 캐시와 CDN

- **핵심 용어**:
- **프록시 (Proxy)**: 클라이언트와 서버 사이를 중계하며 요청을 처리하는 중간 서버 (홀 매니저 역할)
- **CDN**: 전 세계 곳곳에 프록시 서버를 구축해 사용자가 가까운 곳에서 데이터를 빠르게 받아볼 수 있게 하는 네트워크

- **Cache-Control 헤더 활용 (`s-maxage`, `stale-while-revalidate`)**:
- **유통기한 (`s-maxage=60`)**: 지정된 시간 동안 CDN 금고에 데이터를 보관하며 원본 서버 조회 없이 빠르게 응답합니다.
- **유예 기간 (`stale-while-revalidate=30`)**: 유통기한이 지나도 유예 시간 동안은 기존 데이터(Stale)를 먼저 즉시 보여주고, 백그라운드에서 몰래 새로운 데이터를 갱신(Revalidate)합니다. 사용자에게 로딩 없는 매끄러운 경험을 제공합니다.

```javascript
/**
 * Route Handler에서 HTTP Cache-Control 헤더를 제어하는 실무 아키텍처
 */
export async function GET() {
  const data = { message: "이 데이터는 완벽하게 통제된 캐시 정책을 따릅니다." };

  return Response.json(data, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
    },
  });
}
```

### 3. 🚨 Next.js 15 파괴적 변화 (Breaking Change)

- **과거 (v14 이전)**: 프레임워크가 기본적으로 모든 데이터를 공격적으로 자동 캐싱
- **현재 (v15 이후)**: `fetch` 요청이나 API 라우트가 **기본적으로 캐싱을 하지 않는(`no-store`) 상태**로 변경
- **시사점**: 이제 프레임워크에 의존하지 않고, 아키텍트가 직접 시스템 부하를 판단하여 명시적인 캐시 제어 지침(`Cache-Control`)을 내려야 하는 '진정한 통제의 시대'가 되었습니다.

---

💡 **요약**: 컴포넌트 내부의 연산 중복을 잡는 것은 **메모이제이션**, 글로벌 네트워크 트래픽과 서버 본체를 보호하는 것은 **HTTP 캐시 제어**가 담당합니다.
