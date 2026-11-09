아래처럼 정리하면 돼. 기존 노트의 구성과 설명 스타일은 유지하면서, 27강의 `revalidatePath`, 27강의 태그 기반 캐시 무효화, 28강의 `cacheTag`와 Surrogate Keys를 연결해 정리할게. 다만 기존 노트에서 Next.js 버전에 따라 달라지는 설명과 캐시 동작을 오해할 수 있는 부분은 정확하게 수정할게.

# Next.js 캐싱 심화: 캐시 무효화와 태그 기반 관리 (27\~28강)

## 1. 캐시 무효화의 딜레마: 신선도 vs 성능

캐시는 서버의 데이터 조회 비용을 줄여주지만, 원본 데이터가 변경되면 캐시와 실제 데이터 사이에 불일치가 발생할 수 있습니다. 이를 해결하는 것이 캐시 무효화(Cache Invalidation) 입니다.

- 신선도 중심 (Freshness)
  - 매 요청마다 원본 데이터를 다시 조회합니다.
  - 장점: 데이터 변경사항을 빠르게 반영할 수 있습니다.
  - 단점: 요청이 많아지면 DB와 서버의 부하가 증가합니다.
  - 대표 옵션: `fetch(url, { cache: 'no-store' })`
- 성능 중심 (Performance)
  - 기존 캐시 데이터를 재사용합니다.
  - 장점: 반복 조회 비용과 서버 부하를 줄일 수 있습니다.
  - 단점: 캐시가 갱신되기 전까지 오래된 데이터가 노출될 수 있습니다.
  - 대표 옵션: `fetch(url, { cache: 'force-cache' })`

핵심: 캐시를 무조건 사용하거나 무조건 끄는 것이 아니라, 데이터 변경 시점에 적절히 무효화하는 전략이 중요합니다.

## 2. `revalidatePath` — 경로 기준 캐시 재검증

특정 URL 경로와 관련된 캐시를 재검증하도록 요청하는 API입니다.

```
'use server'

import { revalidatePath } from 'next/cache'

export async function deleteProduct(productId: string) {
  await db.product.delete({
    where: { id: productId }
  })

  revalidatePath('/products')
}
```

- 동작 원리: 상품을 삭제한 뒤 `/products` 경로의 캐시를 재검증 대상으로 지정합니다.
- 사용 목적: 특정 페이지의 데이터를 변경했을 때 해당 경로를 갱신합니다.
- 장점: 어떤 경로를 갱신할지 명확하게 지정할 수 있습니다.
- 단점: 같은 데이터가 여러 경로에서 사용된다면 여러 경로를 관리해야 할 수 있습니다.

예를 들어 상품이 `/products`, `/products/123`, `/categories/shoes`에 모두 나타난다면, 경로별로 무효화할지 데이터 태그를 공유해 관리할지 판단해야 합니다.

## 3. `revalidateTag` — 태그 기준, 유연한 재검증

경로가 아니라 데이터에 연결된 태그를 기준으로 관련 캐시를 관리합니다.

```
revalidateTag('global-reviews', 'max')
```

- 해당 태그가 연결된 캐시를 오래된 상태로 표시합니다.
- 다음에 해당 캐시를 사용하는 요청이 들어오면 기존 데이터를 먼저 제공하면서 재검증을 진행할 수 있습니다.
- 최신 데이터를 성공적으로 가져오면 캐시가 갱신됩니다.
- `max`는 몇 초 또는 몇 분을 의미하는 값이 아니라 캐시 프로필입니다.
- 요청이 들어오는 시점에 따라 실제 갱신 시점이 달라집니다.&#x20;

  [image](https://www.google.com/s2/favicons?domain=https://nextjs.org&sz=32)

  Next.js+1

### 동작 흐름

1\. 데이터 변경 후 태그 재검증 호출

revalidateTag('global-reviews', 'max')

2\. 캐시를 오래된 상태로 표시

3\. 다음 요청에서 기존 캐시 제공 가능

백그라운드에서 최신 데이터 재조회

4\. 재검증 성공 후 최신 캐시로 교체

언제 사용하나?

- 상품 목록, 블로그 글, 리뷰처럼 약간의 지연을 허용할 수 있는 데이터
- 여러 페이지에서 공유하는 데이터를 한 번에 재검증하고 싶을 때
- 외부 CMS의 웹훅이나 데이터 변경 이벤트를 통해 캐시를 재검증할 때

참고로 `revalidateTag`는 Server Action뿐 아니라 Route Handler에서도 사용할 수 있습니다.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://nextjs.org&sz=32)

Next.js+1

## 4. `updateTag` — 수정 결과를 즉시 반영해야 할 때

`revalidateTag(tag, 'max')`와 달리, `updateTag`는 해당 캐시를 즉시 만료시켜 다음 데이터 조회에서 오래된 캐시를 제공하지 않고 최신 데이터를 가져오도록 합니다.

```
'use server'

import { updateTag } from 'next/cache'

export async function updateReview() {
  await db.review.update({
    where: { id: 456 },
    data: { content: '수정된 리뷰' }
  })

  updateTag('global-reviews')
}
```

- 사용 가능 위치: Server Action 내부
- 목적: 사용자가 수정한 결과를 바로 확인할 수 있도록 보장
- 대표 상황: 게시글 작성·수정, 리뷰 수정, 내 프로필 변경

단, 캐시 만료와 브라우저 UI의 갱신은 구분해야 합니다. `updateTag`는 캐시를 만료시키는 API이며, 화면의 즉각적인 반영 여부는 해당 Server Action의 렌더링·네비게이션 흐름에도 영향을 받습니다.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://nextjs.org&sz=32)

Next.js+1

## 5. 세 가지 API 비교

| 구분               | `revalidatePath`             | `revalidateTag(tag, 'max')`    | `updateTag`                               |
| ------------------ | ---------------------------- | ------------------------------ | ----------------------------------------- |
| 기준               | URL 경로                     | 데이터 태그                    | 데이터 태그                               |
| 주요 목적          | 특정 경로 재검증             | 관련 캐시를 유연하게 재검증    | 수정 결과를 바로 읽도록 캐시 만료         |
| 오래된 데이터 제공 | 사용 방식에 따라 다름        | 가능                           | 다음 조회에서 오래된 캐시를 제공하지 않음 |
| 사용 위치          | Server Action, Route Handler | Server Action, Route Handler   | Server Action만                           |
| 대표 사례          | 상품 상세 페이지 갱신        | 여러 페이지의 리뷰 캐시 재검증 | 내가 작성한 리뷰 즉시 반영                |

`revalidatePath('/products')`를 호출했다고 해서 동일한 태그를 사용하는 다른 모든 경로의 캐시까지 자동으로 무효화되는 것은 아닙니다. 반대로 태그를 재검증하면 그 태그가 실제로 연결된 여러 캐시 항목을 대상으로 작업할 수 있습니다.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://nextjs.org&sz=32)

Next.js+1

## 6. `cacheTag` — 캐시에 태그 붙이기 (28강)

앞에서 살펴본 `revalidateTag`와 `updateTag`가 작동하려면, 먼저 캐시 항목에 태그를 연결해야 합니다. Next.js 16의 Cache Components에서는 `cacheTag()`를 사용할 수 있습니다.

```
import { cacheTag } from 'next/cache'

export async function getReview(id: string) {
  'use cache'

  cacheTag(`review-${id}`, 'global-reviews')

  return db.review.findUnique({
    where: { id: Number(id) }
  })
}
```

여기서는 하나의 캐시 항목에 두 개의 태그를 연결합니다.

- `review-456`: 특정 리뷰의 캐시를 구분
- `global-reviews`: 리뷰 그룹의 캐시를 구분

예를 들어 `id`가 `456`이라면, 해당 캐시 항목은 `review-456`과 `global-reviews`라는 두 태그를 갖습니다.

### 왜 태그를 두 개나 사용할까?

서로 다른 기준으로 캐시를 무효화할 수 있기 때문입니다.

```
// 특정 리뷰와 관련된 캐시 재검증
revalidateTag('review-456', 'max')

// global-reviews 태그가 연결된 캐시 재검증
revalidateTag('global-reviews', 'max')
```

주의: `global-reviews`라는 이름만으로 모든 리뷰 캐시가 자동으로 묶이는 것은 아닙니다. 그룹에 포함할 캐시 항목마다 해당 태그를 지정해야 합니다.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://nextjs.org&sz=32)

Next.js+1

## 7. `cacheTag`와 CDN의 `Surrogate-Key` 비교

두 개념은 공통적으로 여러 캐시 항목을 하나의 키로 묶어 관리하는 데 활용될 수 있습니다. 하지만 동일한 기능은 아닙니다.

- Next.js `cacheTag`: Next.js의 캐시 항목에 태그를 연결합니다. `revalidateTag`나 `updateTag`로 해당 캐시를 관리할 수 있습니다.
- CDN `Surrogate-Key`: 일부 CDN에서 여러 HTTP 응답을 키로 묶고, 해당 키를 기준으로 CDN 캐시를 무효화하는 데 사용하는 개념입니다.

즉, `cacheTag()`를 호출했다고 해서 CDN 응답에 `Surrogate-Key` HTTP 헤더가 자동으로 설정되는 것은 아닙니다.

## 8. 실무에서 사용하는 전체 흐름

① 데이터 조회 및 캐싱

`use cache`로 캐시할 함수에 `cacheTag()`를 지정합니다.

② 원본 데이터 변경

Server Action에서 DB의 리뷰를 수정하거나 삭제합니다.

③ 변경 상황에 맞는 무효화 API 선택

- 사용자에게 수정 결과를 즉시 보여줘야 함 → `updateTag`
- 오래된 캐시를 제공하면서 백그라운드 재검증 가능 → `revalidateTag(tag, 'max')`
- 특정 경로를 재검증해야 함 → `revalidatePath`

아래처럼 기존 노트의 구성과 설명 스타일을 유지하면서, 방금 질문한 `cacheTag()`가 필수인 경우와 필요하지 않은 경우를 추가하면 돼.

# Next.js 캐시 무효화: `cacheTag`와 재검증 API의 관계

## 1. 핵심 개념: 캐시 무효화 기준이 다르다

Next.js에서 캐시를 무효화하는 방법은 크게 경로 기준과 태그 기준으로 나눌 수 있습니다.

- 경로 기준: `revalidatePath()`
  - 특정 URL 경로를 기준으로 재검증합니다.
  - `cacheTag()`를 지정할 필요가 없습니다.
- 태그 기준: `revalidateTag()`, `updateTag()`
  - 특정 태그가 연결된 캐시를 대상으로 작업합니다.
  - 태그 기반 캐시를 사용하려면 해당 캐시에 태그를 연결해야 합니다.

핵심: `cacheTag()` 자체가 모든 캐싱에 필수인 것은 아닙니다. 태그 기준으로 캐시를 무효화할 때 필요한 설정입니다.

## 2. `revalidatePath()` — 태그 없이 사용 가능

특정 경로를 기준으로 캐시를 재검증할 때 사용합니다.

```
'use server'

import { revalidatePath } from 'next/cache'

export async function updateProduct() {
  await db.product.update({
    where: { id: 1 },
    data: { price: 60000 }
  })

  revalidatePath('/products')
}
```

- 기준: URL 경로
- `cacheTag()` 필요 여부: 불필요
- 사용 목적: 상품 수정 후 상품 목록 페이지를 재검증합니다.

예를 들어 `/products` 페이지를 재검증하려는 경우, 캐시 조회 함수에 별도로 `cacheTag('products')`를 추가하지 않아도 됩니다.

다만 같은 데이터가 여러 경로에서 사용된다면, 해당 경로들을 각각 재검증할지 태그를 공유해 관리할지 판단해야 합니다.

## 3. `revalidateTag()` — 태그를 기준으로 재검증

태그 기반으로 캐시를 관리하려면 먼저 캐시에 태그를 연결해야 합니다.

```
import { cacheTag } from 'next/cache'

export async function getProducts() {
  'use cache'

  cacheTag('products')

  return db.product.findMany()
}
```

그다음 Server Action이나 Route Handler에서 태그를 재검증합니다.

```
'use server'

import { revalidateTag } from 'next/cache'

export async function updateProducts() {
  await db.product.update({
    where: { id: 1 },
    data: { price: 60000 }
  })

  revalidateTag('products', 'max')
}
```

- `cacheTag('products')`: 캐시 항목에 `products` 태그를 연결합니다.
- `revalidateTag('products', 'max')`: 해당 태그가 연결된 캐시를 오래된 상태로 표시하고, 다음 요청에서 재검증할 수 있도록 합니다.
- 오래된 캐시가 먼저 제공될 수 있으므로 수정 직후 항상 최신 데이터가 표시되는 것은 아닙니다.

주의: 태그 이름만 같다고 자동으로 모든 캐시가 연결되는 것은 아닙니다. 무효화하려는 캐시 항목에 해당 태그를 실제로 지정해야 합니다.

## 4. `updateTag()` — 태그를 기준으로 즉시 만료

`updateTag()`도 태그를 기준으로 캐시를 관리하므로, 대상 캐시에 태그가 연결되어 있어야 합니다.

```
'use server'

import { updateTag } from 'next/cache'

export async function updateProduct() {
  await db.product.update({
    where: { id: 1 },
    data: { price: 60000 }
  })

  updateTag('products')
}
```

- 사용 위치: Server Action 내부
- 기준: 태그
- `cacheTag()` 필요 여부: 해당 캐시에 태그가 연결되어 있어야 함
- 목적: 캐시를 즉시 만료해 다음 조회에서 오래된 캐시를 제공하지 않도록 합니다.

대표 사례는 게시글 작성·수정, 리뷰 수정, 사용자 프로필 변경 등입니다.

## 5. 세 가지 API 비교

| 구분                   | `revalidatePath()`           | `revalidateTag(tag, 'max')`  | `updateTag()`                                  |
| ---------------------- | ---------------------------- | ---------------------------- | ---------------------------------------------- |
| 무효화 기준            | 경로                         | 태그                         | 태그                                           |
| `cacheTag()` 필요 여부 | 불필요                       | 태그 연결 필요               | 태그 연결 필요                                 |
| 주요 목적              | 특정 경로 재검증             | 유연한 캐시 재검증           | 즉시 캐시 만료                                 |
| 오래된 캐시 제공       | 캐시 종류와 동작에 따라 다름 | 가능                         | 다음 조회에서 오래된 캐시를 제공하지 않도록 함 |
| 사용 위치              | Server Action, Route Handler | Server Action, Route Handler | Server Action만                                |

참고로 `cacheTag()`가 없어도 `fetch()`의 `next.tags` 옵션으로 태그를 지정할 수 있습니다. 중요한 것은 `cacheTag()`라는 함수 자체가 아니라 무효화하려는 캐시 항목에 해당 태그가 연결되어 있는지입니다.

## 6. 실무에서 선택하는 기준

특정 페이지를 갱신하고 싶다

`revalidatePath('/products')`

경로를 기준으로 재검증하며, 태그를 따로 지정할 필요가 없습니다.

여러 페이지에서 공유하는 데이터를 재검증하고 싶다

`cacheTag('products')` + `revalidateTag('products', 'max')`

같은 태그가 연결된 여러 캐시 항목을 관리할 수 있습니다.

사용자가 수정한 결과를 바로 다시 읽고 싶다

`cacheTag('products')` + `updateTag('products')`

Server Action에서 태그 기반 캐시를 즉시 만료합니다.

- `revalidatePath()` → 경로 기준이므로 `cacheTag()` 불필요
- `revalidateTag()` → 태그 기준이므로 대상 캐시에 태그 연결 필요
- `updateTag()` → 태그 기준이므로 대상 캐시에 태그 연결 필요
- `cacheTag()` → 캐시를 생성하는 API가 아니라, 캐시에 태그를 연결하는 API
