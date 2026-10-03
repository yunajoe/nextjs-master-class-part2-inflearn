# 1. 리다이렉션(Redirection)이란?

리다이렉션은 서버가 클라이언트에게

> "현재 요청한 주소가 아니라 다른 주소로 이동하십시오."

라고 알려주는 기술입니다.

서버는 주로 **300번대 HTTP 상태 코드**와 `Location` 헤더를 사용합니다.

```http
HTTP/1.1 302 Found
Location: /dashboard
```

각각의 의미는 다음과 같습니다.

```text
302 Found
→ 리다이렉션의 종류입니다.

Location: /dashboard
→ 이동할 목적지입니다.
```

즉,

**`Location`은 어디로 이동할지를 나타내고, 상태 코드는 어떤 종류의 이동인지를 나타냅니다.**

---

# 2. 임시 이동과 영구 이동

리다이렉션은 크게 **임시 이동**과 **영구 이동**으로 나눌 수 있습니다.

## 임시 이동

현재는 다른 주소를 사용하지만, 나중에는 기존 주소를 다시 사용할 수도 있는 상황입니다.

예를 들어 서버 점검 중이라고 가정합니다.

```text
/maintenance
      ↓
잠시 동안
      ↓
/maintenance-page
```

이 경우 기존 주소가 완전히 사라진 것이 아니므로 **임시 이동**입니다.

대표적으로 `302`, `307`이 사용됩니다.

---

## 영구 이동

기존 주소를 앞으로 더 이상 사용하지 않고, **새로운 주소를 공식적인 주소로 사용하는 상황**입니다.

예를 들어 사이트 개편으로:

```text
/old-blog
    ↓
/blog
```

로 주소를 완전히 변경했다고 가정합니다.

서버는 다음과 같이 응답할 수 있습니다.

```http
301 Moved Permanently
Location: /blog
```

의미는 다음과 같습니다.

> `/old-blog`는 영구적으로 `/blog`로 이전되었으며 앞으로 `/blog`를 사용합니다.

따라서 **영구 이동은 단순히 지금 한 번 다른 주소로 보내는 것이 아니라, 기존 주소를 더 이상 사용하지 않고 새로운 주소를 공식 주소로 사용하는 것을 의미합니다.**

---

# 3. Location 헤더의 역할

`Location`은 리다이렉션의 목적지를 나타냅니다.

예를 들어:

```http
302 Found
Location: /dashboard
```

이면:

```text
현재 주소
   ↓
/dashboard
```

로 이동합니다.

중요한 점은 **301, 302, 307, 308에서 Location의 역할은 동일하다는 것입니다.**

예를 들어 모두 같은 목적지를 지정할 수 있습니다.

```http
301 Moved Permanently
Location: /new-api
```

```http
302 Found
Location: /new-api
```

```http
307 Temporary Redirect
Location: /new-api
```

```http
308 Permanent Redirect
Location: /new-api
```

네 가지 모두 목적지는 `/new-api`입니다.

차이는 **그 주소로 이동할 때 기존 HTTP Method를 어떻게 처리하는가**와 **이동이 임시인지 영구인지**에 있습니다.

---

# 4. 왜 POST 이후에 리다이렉션이 필요한가?

로그인, 회원가입, 결제, 게시글 작성처럼 서버의 상태를 변경하는 요청은 일반적으로 `POST`를 사용합니다.

예를 들어 결제 요청은 다음과 같습니다.

```http
POST /payments

{
  "amount": 50000
}
```

서버가 결제를 처리한 후 사용자를 이 화면에 그대로 남겨두면 문제가 발생할 수 있습니다.

사용자가 브라우저를 새로고침했을 때 직전에 수행했던 POST 요청이 다시 전송될 가능성이 있기 때문입니다.

```text
POST /payments
      ↓
결제 처리
      ↓
새로고침
      ↓
POST /payments
      ↓
결제 처리
```

결제와 같은 작업에서는 중복 요청으로 인해 중복 결제가 발생할 가능성이 있습니다.

이 문제를 방지하기 위해 사용하는 대표적인 패턴이 **PRG(Post-Redirect-Get)**입니다.

---

# 5. PRG(Post-Redirect-Get) 패턴

PRG는 다음 세 단계로 이루어집니다.

```text
POST
 ↓
Redirect
 ↓
GET
```

예를 들어 로그인 성공 과정을 살펴보겠습니다.

### ① POST

브라우저가 로그인 정보를 서버에 전송합니다.

```http
POST /login

{
  "email": "test@test.com",
  "password": "1234"
}
```

서버는 로그인 처리를 완료합니다.

### ② Redirect

서버는 화면을 직접 반환하지 않고 리다이렉션 응답을 보냅니다.

```http
302 Found
Location: /dashboard
```

### ③ GET

브라우저는 `Location`에 지정된 주소로 새로운 GET 요청을 보냅니다.

```http
GET /dashboard
```

전체 흐름은 다음과 같습니다.

```text
POST /login
      ↓
302 Found
Location: /dashboard
      ↓
GET /dashboard
      ↓
대시보드 화면
```

이제 사용자가 대시보드에서 새로고침을 하더라도 다음 요청만 반복됩니다.

```http
GET /dashboard
```

로그인 요청인 `POST /login`이 다시 전송되지 않습니다.

이것이 PRG 패턴의 핵심입니다.

---

# 6. 302와 POST → GET

PRG를 설명할 때 `302`가 자주 등장하는 이유가 있습니다.

과거 브라우저들은 `302` Redirect를 처리하면서 기존의 `POST` 요청을 새로운 주소에서 `GET` 요청으로 변경하는 동작을 널리 사용했습니다.

예를 들어:

```text
POST /login
      ↓
302 Found
Location: /dashboard
      ↓
GET /dashboard
```

이러한 동작이 웹에서 오랫동안 사용되면서 **POST → Redirect → GET**이라는 PRG 패턴이 일반적인 웹 개발 방식으로 자리 잡게 되었습니다.

따라서 PRG와 302는 밀접하게 관련되어 있지만, **PRG가 302 자체를 의미하는 것은 아닙니다.**

PRG는 애플리케이션 설계 패턴이고, `302`는 HTTP 상태 코드입니다.

---

# 7. 302와 307의 차이

이제 가장 중요한 부분입니다.

두 요청의 `Location`을 동일하게 놓고 비교하면 이해하기 쉽습니다.

최초 요청:

```http
POST /payments

{
  "amount": 50000
}
```

## 302

서버가:

```http
302 Found
Location: /new-payments
```

를 반환하면 전통적인 브라우저 동작에서는 다음과 같이 요청이 변경될 수 있습니다.

```http
GET /new-payments
```

즉,

```text
POST /payments
      ↓
302
      ↓
GET /new-payments
```

입니다.

---

## 307

이번에는 서버가:

```http
307 Temporary Redirect
Location: /new-payments
```

를 반환한다고 가정합니다.

307은 **기존 HTTP Method와 Body를 유지합니다.**

따라서:

```http
POST /new-payments

{
  "amount": 50000
}
```

가 됩니다.

즉,

```text
POST /payments
      ↓
307
      ↓
POST /new-payments
```

입니다.

---

# 8. 왜 307은 Method를 유지하는가?

HTTP Method는 요청의 의도를 나타냅니다.

```text
GET
→ 조회합니다.

POST
→ 생성하거나 서버의 상태를 변경합니다.

PUT
→ 전체 수정합니다.

PATCH
→ 일부 수정합니다.

DELETE
→ 삭제합니다.
```

예를 들어:

```http
DELETE /users/10
```

은

> 10번 사용자를 삭제합니다.

라는 의미입니다.

그런데 Redirect 과정에서:

```http
GET /users/10
```

으로 변경되면 요청의 의미가 완전히 달라집니다.

```text
DELETE
→ 삭제

GET
→ 조회
```

따라서 **주소만 변경하고 원래 요청의 의도는 그대로 유지해야 하는 상황**에서는 Method를 유지해야 합니다.

307은 이러한 목적을 위해 사용됩니다.

---

# 9. 307에서 POST가 두 번 등장하는 이유

다음과 같은 흐름을 보면:

```text
POST /payments
      ↓
307
      ↓
POST /new-payments
```

POST가 두 번 실행되는 것처럼 보일 수 있습니다.

하지만 307의 의미는 **"결제를 두 번 처리하라"가 아닙니다.**

첫 번째 `/payments`에서는 실제 결제를 처리하지 않고 리다이렉션만 반환하는 구조를 생각하면 됩니다.

```text
POST /payments
      ↓
"이 요청은 /new-payments에서 처리합니다."
      ↓
307
      ↓
POST /new-payments
      ↓
실제 결제 처리
```

실제 작업은 새로운 주소에서 한 번만 수행되는 구조입니다.

반대로 `/payments`에서 이미 결제를 처리한 뒤 307을 반환하고 `/new-payments`에서도 다시 결제를 처리한다면 중복 처리가 발생할 수 있습니다.

이는 307 자체의 문제가 아니라 서버의 API 설계 문제입니다.

---

# 10. 결제 시스템의 중복 요청은 별도로 방어해야 합니다

307이 Method와 Body를 유지한다고 해서 중복 결제 문제가 자동으로 해결되는 것은 아닙니다.

네트워크 재시도나 클라이언트의 재전송 등으로 동일한 POST 요청이 여러 번 들어올 수 있기 때문입니다.

따라서 결제 API에서는 **Idempotency Key(멱등성 키)**와 같은 방어 장치를 사용할 수 있습니다.

```http
POST /payments
Idempotency-Key: abc123

{
  "amount": 50000
}
```

같은 키를 가진 요청이 다시 들어오면 서버가 이미 처리한 요청임을 확인하고 동일한 결제를 다시 생성하지 않도록 설계할 수 있습니다.

즉,

```text
307
→ Redirect 과정에서 Method와 Body를 유지합니다.

Idempotency
→ 동일한 작업이 여러 번 요청되어도 중복 처리되지 않도록 합니다.
```

두 기술은 서로 다른 문제를 해결합니다.

---

# 11. 301과 308은 왜 필요한가?

이제 임시 이동과 영구 이동을 함께 연결할 수 있습니다.

```text
                 Redirect
                    │
          ┌─────────┴─────────┐
          │                   │
        임시 이동            영구 이동
          │                   │
      ┌───┴───┐           ┌───┴───┐
      │       │           │       │
    Method   Method      Method   Method
    변경가능  유지       변경가능  유지
      │       │           │       │
     302     307          301     308
```

즉:

```text
302 = 임시 이동 + Method 변경 가능
307 = 임시 이동 + Method 유지

301 = 영구 이동 + Method 변경 가능
308 = 영구 이동 + Method 유지
```

---

# 12. 301 Moved Permanently

301은 **영구적인 주소 변경**을 나타냅니다.

예를 들어:

```text
/old-blog
    ↓
/blog
```

앞으로 `/old-blog`를 사용하지 않고 `/blog`를 공식 주소로 사용한다면:

```http
301 Moved Permanently
Location: /blog
```

를 사용할 수 있습니다.

특히 웹페이지의 URL이 영구적으로 변경되는 경우 검색 엔진이나 클라이언트에게 새로운 공식 주소를 알려주는 데 사용됩니다.

---

# 13. 308 Permanent Redirect

308도 **영구적인 주소 변경**을 의미합니다.

301과 차이는 **Method와 Body를 유지한다는 것**입니다.

예를 들어:

```http
POST /api/v1/users

{
  "name": "Yuna"
}
```

서버가:

```http
308 Permanent Redirect
Location: /api/v2/users
```

를 반환하면:

```http
POST /api/v2/users

{
  "name": "Yuna"
}
```

가 됩니다.

즉:

```text
POST /api/v1/users
       ↓
308
       ↓
POST /api/v2/users
```

입니다.

---

# 14. 301과 308의 차이

둘 다 **영구 이동**입니다.

차이는 다음과 같습니다.

```text
301
→ 주소가 영구적으로 변경되었습니다.
→ Method가 변경될 수 있습니다.

308
→ 주소가 영구적으로 변경되었습니다.
→ Method와 Body를 유지합니다.
```

따라서:

```text
웹페이지의 주소를 영구적으로 변경
→ 301을 사용할 수 있습니다.

API 주소를 영구적으로 변경하면서
POST/PUT/PATCH 등의 요청 의미를 유지
→ 308을 사용할 수 있습니다.
```

---

# 15. 301, 302, 307, 308 한눈에 보기

| 상태 코드                  | 이동      | Method         |
| -------------------------- | --------- | -------------- |
| **301 Moved Permanently**  | 영구 이동 | 변경될 수 있음 |
| **302 Found**              | 임시 이동 | 변경될 수 있음 |
| **307 Temporary Redirect** | 임시 이동 | **유지**       |
| **308 Permanent Redirect** | 영구 이동 | **유지**       |

다음과 같이 외우면 가장 간단합니다.

```text
301 = 영구 이동
302 = 임시 이동

307 = 임시 이동 + Method 유지
308 = 영구 이동 + Method 유지
```

---

# 16. 최종 정리

리다이렉션에서는 두 가지 질문을 구분해서 생각해야 합니다.

### 첫 번째: 어디로 이동하는가?

```http
Location: /new-api
```

`Location`이 결정합니다.

### 두 번째: 기존 요청을 어떻게 유지하는가?

HTTP 상태 코드가 결정합니다.

```text
301 / 302
→ Method가 변경될 수 있습니다.

307 / 308
→ 기존 Method와 Body를 유지합니다.
```

그리고 세 번째로 **이동이 임시인지 영구인지**를 구분해야 합니다.

```text
302 / 307
→ 임시 이동입니다.

301 / 308
→ 영구 이동입니다.
```

따라서 최종적으로 다음 구조로 기억하면 됩니다.

```text
                         Redirect
                            │
                ┌───────────┴───────────┐
                │                       │
              임시                     영구
                │                       │
         ┌──────┴──────┐         ┌──────┴──────┐
         │             │         │             │
      Method 변경    Method 유지 Method 변경  Method 유지
         │             │         │             │
        302           307        301           308
```

PRG는 그중 **POST 처리 후 Redirect를 거쳐 GET으로 이동시키는 패턴**입니다.

```text
POST
 ↓
302 Redirect
 ↓
GET
```

반면 307과 308은 **Redirect가 발생하더라도 원래 요청의 Method와 Body를 유지해야 하는 경우**에 사용합니다.

```text
POST /old
   ↓
307 또는 308
   ↓
POST /new
```

결국 가장 중요한 개념은 다음 세 가지입니다.

```text
Location
→ 어디로 이동할지 결정합니다.

301/302/307/308
→ 임시인지 영구인지, Method를 유지하는지를 결정합니다.

PRG
→ POST 이후 Redirect를 거쳐 GET으로 전환하여
  새로고침에 의한 POST 재전송 문제를 방지하는 패턴입니다.
```

### `redirect()`와 `NEXT_REDIRECT` 정리

#### 1. `redirect()`는 실제로 이동시키는 함수가 아니다

```ts
redirect("/posts");
```

를 호출하면 Next.js는 내부적으로 **`NEXT_REDIRECT`라는 특별한 에러를 throw**한다.

```text
redirect("/posts")
      ↓
NEXT_REDIRECT 생성
      ↓
throw
```

즉 `redirect()`는 일반적인 `return`이 아니라 **예외 흐름을 이용해 Next.js에게 redirect를 요청하는 것**이다.

---

#### 2. `try/catch` 안에서는 `catch`가 `NEXT_REDIRECT`도 잡는다

```ts
try {
  redirect("/posts");
} catch (error) {
  console.log(error);
}
```

흐름은:

```text
redirect("/posts")
      ↓
NEXT_REDIRECT 발생
      ↓
catch가 잡음
```

따라서 그냥 처리해버리면:

```ts
catch (error) {
  console.error(error)
}
```

**redirect 신호가 사라져서 redirect가 정상적으로 처리되지 않는다.**

---

#### 3. 그래서 `isRedirectError()`로 구분한다

```ts
try {
  redirect("/posts");
} catch (error) {
  if (isRedirectError(error)) {
    throw error;
  }

  console.error("서버 처리 중 오류:", error);
}
```

흐름은:

```text
redirect("/posts")
      ↓
NEXT_REDIRECT 발생
      ↓
catch가 잡음
      ↓
isRedirectError(error) === true
      ↓
throw error
      ↓
Next.js가 전달받음
      ↓
redirect 처리
      ↓
/posts 이동
```

여기서 중요한 점:

> **`throw`가 redirect를 다시 실행하는 것이 아니다.**

처음 `redirect("/posts")`가 만든 **`NEXT_REDIRECT` 신호를 catch에서 먹지 않고 Next.js까지 다시 전달하는 것**이다.

---

### 4. 일반 에러와의 차이

일반 에러:

```ts
throw new Error("DB 오류");
```

```text
Error
 ↓
catch
 ↓
처리하거나 throw
 ↓
상위 호출자
```

Redirect:

```ts
redirect("/posts");
```

```text
NEXT_REDIRECT
 ↓
catch
 ↓
throw
 ↓
Next.js
 ↓
redirect 처리
```

`NEXT_REDIRECT`는 **일반적인 비즈니스 에러라기보다 Next.js의 제어 신호**라고 이해하면 된다.

---

### 5. 가장 깔끔한 방법

실제 코드에서는 `redirect()`를 `try/catch` 밖에 두는 게 가장 단순하다.

```ts
try {
  // DB 저장
  // cookie 설정
} catch (error) {
  console.error(error);
}

redirect("/posts");
```

그러면:

```text
일반 에러 → catch에서 처리

redirect → catch를 거치지 않음
          ↓
        Next.js가 처리
```

### 핵심 한 문장

> **`redirect()`는 `NEXT_REDIRECT`를 throw하고, `try/catch` 안에 있다면 catch가 이를 잡을 수 있으므로 `isRedirectError()`로 확인한 뒤 다시 `throw`해서 Next.js가 redirect 신호를 처리하도록 해야 한다.**
