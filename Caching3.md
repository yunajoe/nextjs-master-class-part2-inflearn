# 23강 정리: `'use cache` + `<Suspense>` 마이크로 캐싱 (Q&A 포함)

## 핵심 한 줄

Next.js 16에서 `cacheComponents: true`를 켜면 "페이지 전체 캐싱"이 아니라 **컴포넌트 단위(마이크로) 캐싱**으로 바뀝니다. 이때 빌드 에러를 피하려면 동적 데이터를 `<Suspense>`로 감싸야 합니다.

---

## 1. 환경 설정

- `next.config.ts`에 `cacheComponents: true` 추가
- Next.js 15의 `experimental.dynamicIO`가 16에서 정식 승격된 것
- 켜면 기본이 **동적 렌더링**이고, `'use cache'`를 명시한 컴포넌트만 캐시됩니다.

---

## 2. 개념 Q&A

### Q1. PPR(Partial Prerendering)이란?

한 페이지 안에서 **정적인 부분은 빌드 시점에 미리 구워두고, 동적인 부분만 요청 시점에 채워 넣는** 렌더링 방식입니다.

**기존 방식의 문제**

- 정적 렌더링: 빠르지만 사용자별·실시간 데이터를 넣을 수 없음
- 동적 렌더링: 데이터는 자유롭지만 페이지 전체가 서버 렌더링을 기다려서 첫 화면(TTFB)이 느림
- 한 군데만 동적이어도 페이지 전체가 동적으로 바뀌는 게 약점이었음

**PPR의 동작**

1. **빌드 시점**: `<Suspense>` 바깥 영역을 정적 HTML 껍데기(Static Shell)로 생성하고, 안쪽은 fallback이 든 "구멍"으로 남김
2. **요청 시점**: 껍데기는 즉시 내려주고, 구멍은 서버가 렌더링한 뒤 **스트리밍**으로 채움

> **정적 껍데기 + 동적 구멍을 한 페이지에 공존시키는 기술**

### Q2. 껍데기에서 `await params`를 하면 왜 빌드 에러가 나는가?

핵심은 **`params`가 "빌드 시점에는 값을 모르는 데이터"** 라는 점입니다.

- `/product/[id]`의 `id`는 사용자가 `/product/777`로 접속해야 알 수 있습니다.
- 비유하면 신문을 미리 인쇄해 두는 상황입니다. 제목과 레이아웃은 미리 찍을 수 있지만, "독자 이름: \_\_\_\_"은 독자가 누군지 모르니 인쇄 시점에 채울 수 없습니다.

```tsx
// ❌ 껍데기에서 직접 await → 빌드 에러
export default async function ProductPage({ params }) {
  const { id } = await params; // 빌드 시점엔 id를 모름!
  return <h1>상품 {id}</h1>;
}
```

컴파일러 입장에서 선택지는 두 가지입니다.

1. 껍데기 전체를 포기하고 통째로 동적 처리 → 느려짐 (PPR 의미 상실)
2. **"어디가 동적인지 알려달라"며 에러를 냄**

Next.js 16(cacheComponents)은 2번을 택합니다. 개발자가 모르는 사이에 페이지 전체가 느려지는 걸 막기 위해서입니다.

### Q3. `<Suspense>`는 이걸 어떻게 해결하는가?

```tsx
<h1>프리미엄 헤드폰</h1>                      {/* 정적: 미리 굽기 OK */}

<Suspense fallback={<p>로딩중...</p>}>
  <RealTimeCart paramsPromise={params} />    {/* 동적: 구멍으로 남김 */}
</Suspense>
```

- `await params`를 **Suspense 안쪽 자식 컴포넌트**에서 수행합니다.
- 컴파일러는 바깥은 미리 굽고, 안쪽은 "접속해야 알 수 있는 구멍"으로 보고 fallback만 넣어둡니다.
- 에러가 사라지는 이유는 **동적 데이터를 쓰는 곳을 Suspense로 명시해 컴파일러에게 알려줬기 때문**입니다.
- 그래서 부모는 `params`를 풀지 않고 **Promise 그대로** 자식에게 넘기고(`paramsPromise={params}`), 풀어내는 책임을 자식에게 위임합니다.

> 껍데기는 빌드 때 미리 굽는데, `await params`는 접속해야 값이 생긴다. 그래서 `Suspense`로 "여긴 나중에 채울 구멍"이라고 표시해줘야 한다.

---

## 3. 구조: 세 가지 영역

| 영역             | 파일                          | 특징                                                                            |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| 정적 껍데기      | `page.tsx`                    | 제목·배경 등. `await params` 금지, Promise 그대로 전달                          |
| 실시간 동적 부품 | `RealTimeCart.tsx`            | `'use cache'` 없음. 접속마다 서버 렌더 후 스트리밍                              |
| 결빙(캐시) 부품  | `HeavyProductDescription.tsx` | 파일 최상단 `'use cache'`. 최초 1회만 2초 연산 후 결과(HTML 포함)를 캐시에 저장 |

## 4. 동작 흐름

1. 접속 → 정적 껍데기 즉시 표시
2. 동적 부품은 서버에서 렌더링 후 Suspense 구멍에 스트리밍
3. 캐시 부품은 최초 1회만 2초 소요, 이후 모든 사용자는 즉시 로드

# 질문

## 1. Cache Components 환경에서 부모 컴포넌트에서 `await params`를 하지 않는 이유

핵심: 정적 셸을 미리 생성할 수 있도록 부모가 요청 시점의 데이터에 의존하지 않게 하기 위해서야.

Cache Components를 사용하는 Next.js에서는 빌드 시점에 미리 렌더링할 수 있는 부분을 정적 셸로 생성하고, 요청 시점에 필요한 데이터는 실제 요청이 들어왔을 때 처리할 수 있어.

```
export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <>
      <h1>프리미엄 무선 헤드폰</h1>
      <RealTimeCart id={id} />
    </>
  )
}
```

이렇게 부모에서 `await params`를 실행하면, 부모가 `id`를 알아야 JSX를 반환할 수 있어.

`params`가 요청 시점에 결정되는 값이라면 부모의 렌더링이 해당 데이터에 의존하게 돼. Cache Components 환경에서 이런 요청 시점 데이터에 의존하는 코드가 적절한 `Suspense` 경계 밖에 있으면 정적 셸 생성 과정에서 빌드 오류가 발생할 수 있어.

따라서 부모는 `params`를 직접 해제하지 않고, 정적 셸이 될 수 있는 부분을 먼저 구성하는 것이 좋아.

## 2. `params`를 자식에게 전달하고 `Suspense`로 감싸는 이유

핵심: 동적 데이터가 필요한 부분만 분리해 처리하고, 해당 부분이 준비될 때까지 대체 UI를 보여주기 위해서야.

```
import { Suspense } from 'react'

export default function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <>
      <h1>프리미엄 무선 헤드폰</h1>

      <Suspense fallback={<p>장바구니 로딩 중...</p>}>
        <RealTimeCart paramsPromise={params} />
      </Suspense>
    </>
  )
}
```

자식 컴포넌트에서는 전달받은 Promise를 해제해.

```
export default async function RealTimeCart({
  paramsPromise
}: {
  paramsPromise: Promise<{ id: string }>
}) {
  const { id } = await paramsPromise

  return <p>{id}번 상품의 장바구니</p>
}
```

이 구조의 장점은 세 가지야.

1. 정적 셸 생성: 부모는 `id`를 기다리지 않고 JSX를 반환할 수 있어.
2. 동적 영역 분리: 자식이 필요한 시점에 `params`를 해제해.
3. 로딩 UI 제공: 자식의 렌더링이 지연되면 `Suspense`의 `fallback`을 표시할 수 있어.

| 구분                                | 이유                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| 부모에서 `await params`를 하지 않음 | 부모가 요청 시점의 데이터에 의존하지 않도록 해 정적 셸 생성에 유리하게 함    |
| `params`를 자식에게 전달            | 동적 데이터 처리를 필요한 컴포넌트로 한정함                                  |
| 자식을 `Suspense`로 감쌈            | 정적 셸과 동적 영역을 분리하고, 동적 콘텐츠가 준비될 때까지 대체 UI를 제공함 |

기억할 문장: 부모는 정적 셸이 될 수 있는 부분을 구성하고, 자식은 동적 데이터를 처리하며, `Suspense`는 그 동적 영역의 렌더링 경계를 만든다.

단, 부모에서 `await params`를 사용한다고 항상 페이지 전체가 동적으로 렌더링되는 것은 아니며, `Suspense`만 추가한다고 무조건 정적 셸이 생성되는 것도 아니야. 실제 동작은 Cache Components 설정과 데이터 접근 방식에 따라 달라져.

## 3. Cache Components 환경에서 이런 요청 시점 데이터에 의존하는 코드가 적절한 `Suspense` 경계 밖에 있으면 정적 셸 생성 과정에서 빌드 오류가 발생하는 이유

### Next.js는 빌드 시점에 페이지를 미리 렌더링하려고 해

예를 들어 상품 페이지가 있다고 해 보자.

```
import { cookies } from 'next/headers'

export default async function ProductPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  return (
    <>
      <h1>프리미엄 무선 헤드폰</h1>
      <p>{token ? '로그인 상태' : '로그아웃 상태'}</p>
    </>
  )
}
```

이 코드에서 상품 제목은 방문자와 관계없이 동일하지만, 로그인 상태는 방문자의 쿠키에 따라 달라져.

그런데 빌드 시점에는 실제 방문자의 쿠키가 없어.

Next.js 입장에서는 다음과 같은 문제가 생기는 거야.

- 정적 셸을 생성하려면 페이지를 렌더링해야 해.
- 페이지를 렌더링하려면 `cookies()`의 결과가 필요해.
- 하지만 실제 요청이 없으므로 해당 쿠키 값을 알 수 없어.

따라서 Cache Components 환경에서는 이런 요청 시점의 데이터에 의존하는 코드를 정적 셸 생성 중에 처리하려고 하면 문제가 발생할 수 있어.

### `Suspense`가 있으면 어떻게 달라질까?

같은 코드를 이렇게 바꿔 보자.

```
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function UserInfo() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  return <p>{token ? '로그인 상태' : '로그아웃 상태'}</p>
}

export default function ProductPage() {
  return (
    <>
      <h1>프리미엄 무선 헤드폰</h1>

      <Suspense fallback={<p>사용자 정보 로딩 중...</p>}>
        <UserInfo />
      </Suspense>
    </>
  )
}
```

Next.js는 정적 셸을 만들 때 `UserInfo`의 실제 결과까지 완성하려고 하지 않아.

### 그런데 왜 오류를 발생시키지, 자동으로 기다리면 안 될까?

Next.js가 자동으로 기다리게 하면 정적 셸을 생성할 수 없는 부분 때문에 페이지 전체의 사전 렌더링이 막힐 수 있어.

예를 들어 상품 제목은 즉시 보여줄 수 있는데 사용자 정보를 가져오는 작업이 끝날 때까지 페이지 전체를 기다리면, 정적 셸의 장점을 활용하기 어려워져.

그래서 Next.js는 개발자에게 명시적으로 선택하도록 요구하는 거야.

- `Suspense`를 사용하면 해당 영역의 대체 UI를 정적 셸에 포함하고 실제 콘텐츠는 요청 시점에 처리할 수 있어.
- 캐시할 수 있는 데이터라면 `use cache`로 결과를 캐싱해 사전 렌더링에 활용할 수도 있어.
- 요청 시점에 처리해야 하는 영역을 적절히 분리하지 않았다면 빌드 오류로 알려 줘
