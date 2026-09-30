# 낙관적 업데이트

## 1. 낙관적 업데이트(Optimistic Update)란?

- **핵심 개념:** 물리적인 네트워크 지연(Latency)을 극복하기 위해, **서버 응답을 기다리지 않고 사용자의 요청이 성공할 것이라고 '낙관적으로' 믿어 화면을 즉각 갱신**하는 프론트엔드 아키텍처입니다.
- **기본 흐름:**

1. 사용자 클릭
2. UI 즉시 변경 (가짜 상태 발동, 0초 렌더링)
3. 백그라운드 서버 액션 호출 (지연 발생)
4. **성공 시** 캐시 무효화 및 진짜 상태로 승격 / **실패 시** 초기 상태로 자동 롤백

## 2. `useOptimistic` 훅의 구조

React 19 및 Next.js App Router에서 제공하는 훅으로, 낙관적 UI 구현을 단순화합니다.

```tsx
const [optimisticState, addOptimistic] = useOptimistic(
  currentState,
  (state, optimisticValue) => newState,
);
```

- **`currentState`:** 데이터베이스가 알고 있는 진짜 서버 상태 (초기값).
- **`optimisticState`:** 평소엔 진짜 상태를 보여주다가, 방아쇠가 당겨지면 즉시 화면을 덮어씌우는 가짜 상태 (UI 렌더링에 사용).
- **`addOptimistic`:** 가짜 상태를 발동시키는 트리거(방아쇠) 함수.

## 3. 프로젝트 폴더 구조

서버 컴포넌트와 클라이언트 컴포넌트를 명확히 분리하여 설계합니다.

```text
src/
└── app/
    ├── actions.ts              <-- [백엔드] 1초 지연 및 10% 에러 시뮬레이션 서버 액션
    ├── components/
    │   └── LikeButton.tsx      <-- [프론트엔드] useOptimistic이 적용된 좋아요 버튼 (클라이언트)
    └── products/
        └── [id]/
            └── page.tsx        <-- [화면] 상품 상세 페이지 (서버 컴포넌트)

```

## 4. 핵심 코드 요약

### 백엔드: 지연 및 실패 시뮬레이션 (`actions.ts`)

- 네트워크 지연(`setTimeout 1초`)과 10% 확률의 에러(`Math.random() < 0.1`)를 주어 롤백 시스템을 테스트합니다.
- 성공 시 `revalidatePath`로 데이터를 동기화합니다.

### 프론트엔드: 좋아요 버튼 컴포넌트 (`LikeButton.tsx`)

- `'use client'` 선언 후 `useOptimistic`을 적용합니다.
- 요청 전 `addOptimisticLike(newLikeStatus)`를 호출해 화면을 즉시 바꾸고, `try...catch`를 통해 서버 통신 실패 시 사용자에게 알림을 줍니다.

## 5. useOptimistic 이 롤백 할 수 있는 이유

`useOptimistic` 훅이 에러를 감지하고 자동으로 롤백하는 원리는 "진짜 상태(Source of Truth)와 가짜 상태(Optimistic State)를 엄격하게 분리해서 관리"하기 때문입니다.

```tsx
const [optimisticLiked, addOptimisticLike] = useOptimistic(
  initialLiked, // 1. 진짜 서버 상태 (Source of Truth)
  (currentState, optimisticValue) => optimisticValue, // 2. 가짜 상태 규칙
);
```

### 진짜 상태(`initialLiked`)는 변하지 않았다

우리가 `addOptimisticLike(newLikeStatus)`를 호출해서 바꾼 것은 **오직 화면에 보여주기 위한 임시 변수(`optimisticLiked`)뿐**입니다.
부모 컴포넌트가 내려준 진짜 데이터인 `initialLiked` (예: `false`)는 백그라운드에서 서버 요청이 진행되는 동안에도 **여전히 원래 값(`false`) 그대로 유지**되고 있습니다.

### 비동기 작업(서버 액션)과 렌더링의 생명주기 연결

React의 `useOptimistic`은 내부적으로 **비동기 트랜지션(Transition)** 동작과 긴밀하게 연동되어 있습니다.

- **요청이 진행되는 동안:** React는 일시적으로 진짜 상태 대신 `useOptimistic`이 만들어낸 **가짜 상태**를 우선적으로 화면에 렌더링합니다.
- **요청이 끝나는 시점 (`try...catch` 종료):** 서버 액션이 성공하든, 에러(`throw new Error`)를 뱉으며 `catch`문으로 빠지든 간에 **비동기 트랜지션 작업이 최종 종료**됩니다.

### 트랜지션이 끝나면 가짜 상태는 자동 소멸

트랜지션(비동기 작업)이 끝나는 순간, React는 더 이상 가짜 상태를 유지할 이유가 없다고 판단합니다.

- **성공했을 때:** 보통 서버 데이터가 갱신(`revalidatePath`)되면서 새로운 진짜 상태가 내려오고 자연스럽게 동기화됩니다.
- **실패(에러)했을 때:** 서버 요청이 에러로 끝나면 트랜지션이 해제되고, `useOptimistic`은 임시로 만들어두었던 **가짜 상태 데이터를 메모리에서 깨끗이 지워버립니다.**

가짜 상태가 사라지는 순간, 화면은 React가 원래 붙잡고 있던 변하지 않은 진짜 상태(`initial`값)를 자연스럽게 다시 바라보게 되므로 별도의 `setLiked` 코드 없이도 저절로 원래대로 돌아오는 것입니다.

### 요약

서버 액션이 **성공했을 때**와 실패했을 때(에러가 날 때)가 어떻게 나뉘어 처리되는지, 그리고 롤백이 왜 다르게 작동하는지 코드를 통해 뜯어보겠습니다.

### `try` 블록 내부 (성공했을 때)

```tsx
try {
  // 3. 서버에 요청을 보냄
  await toggleProductLikeAction(productId, newLikeStatus);
}

```

- **결과:** 서버 통신이 에러 없이 무사히 끝났습니다. (`throw new Error`가 발생하지 않음)
- **어떤 일이 일어나나?:** `try` 블록이 정상 종료되면, `catch` 블록은 아예 실행조차 되지 않고 그냥 지나쳐 버립니다.
- **롤백이 안 일어나는 이유:** 에러가 발생해 `catch`로 빠지지 않았으므로, 가짜 상태를 폐기하라는 신호가 트리거되지 않습니다. 그리고 실제 서버 데이터가 성공적으로 바뀌었기 때문에 뒤이어 부모 컴포넌트가 새로운 진짜 상태를 내려주어 자연스럽게 동기화됩니다.

### `catch` 블록 내부 (실패했을 때)

```tsx
catch (error) {
  // 4. 서버 액션 실행 중 에러(throw new Error)가 발생하면 이 안으로 진입!
  alert("⚠️ 서버 통신 실패...");
}

```

- **결과:** 10% 확률로 서버 액션 안에서 `throw new Error(...)`가 발생했습니다.
- **어떤 일이 일어나나?:** 자바스크립트의 기본 문법인 `try...catch`에 의해, 에러가 나는 순간 `try` 안의 남은 코드는 중단되고 **즉시 `catch` 블록 안으로 점프**합니다.
- **롤백이 일어나는 이유:**

1. 서버 액션이 에러로 종료되면서 React는 이 비동기 작업(트랜지션)이 '실패로 끝났다'는 것을 감지합니다.
2. 작업이 실패로 종료되는 순간, `useOptimistic`이 임시로 쥐어짜고 있던 가짜 상태는 메모리에서 자동으로 폐기(증발)됩니다.
3. 가짜 상태가 사라지니, 화면은 자연스럽고 안전하게 원래의 진짜 상태(`initialLiked`)를 다시 보여주게 됩니다. (여기에 개발자가 별도로 `setLiked` 같은 복구 코드를 적지 않아도 프레임워크가 이 생명주기를 알아서 처리해 주는 것입니다.)

### 💡 한 눈에 보는 요약

- **`try` 성공 시:** 에러가 없으므로 `catch`를 안 타고 넘어감 ➡️ 가짜 상태가 유지되다가 서버의 새로운 진짜 데이터로 자연스럽게 교체됨.
- **`catch` 실패 시:** 에러(`throw`)가 터져서 `catch` 안으로 들어옴 ➡️ React가 비동기 작업 실패를 감지하고 가짜 상태를 **자동 폐기**시킴 ➡️ 화면이 알아서 원래 상태로 롤백됨.

## 6. useOptimistic 사용법

### `useOptimistic` 핵심 요약

- **1. 매개변수 배치의 규칙 (React의 약속)**
- `(currentState, optimisticValue) => { ... }` 형태로 훅을 정의합니다.
- **첫 번째 인자 (`currentState`):** 현재 서버가 보증하는 진짜 상태가 자동으로 들어옵니다.
- **두 번째 인자 (`optimisticValue` 등):** 우리가 트리거 함수를 호출할 때 넣은 값이 이 자리에 쏙 전달됩니다.

- **2. 트리거 함수 (`addOptimisticLike`)의 작동 방식**
- 트리거 함수 괄호 안에 작성한 값은 React 내부 규칙에 따라 **무조건 두 번째 매개변수 자리**로 꽂힙니다.

- **3. 여러 개의 데이터를 동시에 보내고 싶을 때 (객체 활용)**
- 트리거 함수 안에 **객체**를 통째로 넣으면, 두 번째 매개변수(예: `updateData`)로 그 객체 전체가 고스란히 전달됩니다.
- **활용 예시:**

```tsx
// 보낼 때
addOptimisticLike({ newStatus: true, userId: "123" });

// 받을 때
(currentState, updateData) => {
  console.log(updateData.newStatus); // true
  console.log(updateData.userId); // "123"
};
```
