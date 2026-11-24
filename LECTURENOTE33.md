# **33강. Intercepting Routes(가로채기 라우트)**

## **1. Intercepting Routes의 개념**

Intercepting Routes는 사용자가 특정 경로로 이동할 때 **기존 화면의 맥락을 유지하면서 목적지 페이지의 일부 UI를 현재 화면 위에 표시하는 라우팅 기능**이다.

- 기존 화면을 유지하면서 새로운 화면을 모달 형태로 표시한다.
- 주소창의 URL은 실제 목적지 경로로 변경한다.
- 내부 이동(Soft Navigation)과 직접 접속 또는 새로고침(Hard Navigation)에 따라 서로 다른 화면을 렌더링한다.

이를 통해 기존 화면의 문맥을 유지하면서 URL의 공유성과 접근성을 확보할 수 있다.

## **2. Intercepting Routes의 폴더 명명 규칙**

Next.js는 폴더 이름에 특정 기호를 사용하여 가로챌 라우트의 위치를 지정한다.

| 문법             | 의미                                      |
| ---------------- | ----------------------------------------- |
| `(.)folder`      | 같은 레벨의 라우트 세그먼트 가로채기      |
| `(..)folder`     | 한 단계 상위 라우트 세그먼트 가로채기     |
| `(..)(..)folder` | 두 단계 상위 라우트 세그먼트 가로채기     |
| `(...)folder`    | 루트(app) 수준의 라우트 세그먼트 가로채기 |

여기서 `..`은 실제 파일 시스템의 부모 폴더를 의미하는 것이 아니라, **라우트 세그먼트 기준으로 상위 경로를 이동하는 것**을 의미한다.

## **3. 가로채기 라우트의 동작 방식**

### **① 내부 이동(Soft Navigation)**

사용자가 `<Link>`를 클릭하여 앱 내부에서 이동하는 경우이다.

1. 사용자가 `/feed`에서 `/photo/1` 링크를 클릭한다.
2. Next.js가 현재 경로와 목적지 경로를 확인한다.
3. 가로채기 라우트인 `(..)photo`가 존재하면 해당 라우트를 선택한다.
4. 기존 피드 화면을 유지한다.
5. 피드 위에 사진 상세 화면을 렌더링한다.
6. 주소창은 `/photo/1`로 변경된다.

**결과:** 피드 배경은 유지되고 사진 상세 화면이 그 위에 표시된다.

### **② 직접 접속 및 새로고침(Hard Navigation)**

사용자가 `/photo/1` URL에 직접 접속하거나 새로고침하는 경우이다.

1. 브라우저가 `/photo/1`을 서버에 직접 요청한다.
2. 기존 피드 화면의 맥락은 존재하지 않는다.
3. Next.js는 원본 라우트인 `app/photo/[id]/page.tsx`를 렌더링한다.
4. 사진 상세 페이지가 독립된 전체 화면으로 표시된다.

**결과:** 가로채기 화면이 아닌 원본 페이지가 렌더링된다.

## **4. 실습 폴더 구조**

```
src/app/
├── photo/
│   └── [id]/
│       ├── page.tsx
│       └── PhotoDetail.tsx
│
└── feed/
    ├── page.tsx
    └── (..)photo/
        └── [id]/
            ├── page.tsx
            └── InterceptedDetail.tsx
```

| 파일                           | 역할                                                 |
| ------------------------------ | ---------------------------------------------------- |
| `feed/page.tsx`                | 사진 목록을 표시하는 피드 메인 화면                  |
| `feed/(..)photo/[id]/page.tsx` | 내부 이동 시 사진 상세 화면을 가로채 표시하는 페이지 |
| `InterceptedDetail.tsx`        | 가로채기 화면의 실제 콘텐츠                          |
| `photo/[id]/page.tsx`          | 직접 접속 및 새로고침 시 표시되는 독립 페이지        |
| `PhotoDetail.tsx`              | 독립 사진 페이지의 실제 콘텐츠                       |

## **5. 라우팅 흐름**

\#chatgpt-mermaid-\_r_h7\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_h7\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_h7\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_h7\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_h7\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_h7\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_h7\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_h7\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_h7\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_h7\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_h7\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_h7\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_h7\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_h7\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_h7\_ p{margin:0;}#chatgpt-mermaid-\_r_h7\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_h7\_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_h7\_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_h7\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_h7\_ .label text,#chatgpt-mermaid-\_r_h7\_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_h7\_ .node rect,#chatgpt-mermaid-\_r_h7\_ .node circle,#chatgpt-mermaid-\_r_h7\_ .node ellipse,#chatgpt-mermaid-\_r_h7\_ .node polygon,#chatgpt-mermaid-\_r_h7\_ .node path{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_h7\_ .rough-node .label text,#chatgpt-mermaid-\_r_h7\_ .node .label text,#chatgpt-mermaid-\_r_h7\_ .image-shape .label,#chatgpt-mermaid-\_r_h7\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_h7\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_h7\_ .rough-node .label,#chatgpt-mermaid-\_r_h7\_ .node .label,#chatgpt-mermaid-\_r_h7\_ .image-shape .label,#chatgpt-mermaid-\_r_h7\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_h7\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_h7\_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_h7\_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_h7\_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-\_r_h7\_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-\_r_h7\_ .edgeLabel{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-\_r_h7\_ .edgeLabel p{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_h7\_ .edgeLabel rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_h7\_ .labelBkg{background-color:rgba(0, 0, 0, 0.5);}#chatgpt-mermaid-\_r_h7\_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-\_r_h7\_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_h7\_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_h7\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_h7\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_h7\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_h7\_ .icon-shape,#chatgpt-mermaid-\_r_h7\_ .image-shape{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-\_r_h7\_ .icon-shape p,#chatgpt-mermaid-\_r_h7\_ .image-shape p{background-color:rgb(0, 0, 0);padding:2px;}#chatgpt-mermaid-\_r_h7\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_h7\_ .image-shape .label rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_h7\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_h7\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_h7\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_h7\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_h7\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_h7\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_h7\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_h7\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_h7\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_h7\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(153, 206, 255);}#chatgpt-mermaid-\_r_h7\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(153, 206, 255);}#chatgpt-mermaid-\_r_h7\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_h7\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_h7\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-width:1px;}#chatgpt-mermaid-\_r_h7\_ .node rect,#chatgpt-mermaid-\_r_h7\_ .node circle,#chatgpt-mermaid-\_r_h7\_ .node ellipse,#chatgpt-mermaid-\_r_h7\_ .node polygon,#chatgpt-mermaid-\_r_h7\_ .node path{fill:rgb(0, 40, 77);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_h7\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_h7\_ .mermaid-decision .label-container{fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_h7\_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_h7\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_h7\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}/feedIntercepting Route 존재?(..)photo/[id]피드 유지 + 상세 화면 표시URL: /photo/1photo/[id]/page.tsx독립 사진 페이지Link 클릭: /photo/1존재직접 접속 또는 새로고침

## **6. Suspense를 활용한 렌더링 분리**

`page.tsx`에서 화면의 껍데기와 동적 데이터를 처리하는 컴포넌트를 분리한다.

- **정적 껍데기:** 즉시 렌더링되는 화면 구조와 로딩 UI를 담당한다.
- **동적 컴포넌트:** `params`를 비동기로 처리하고 실제 콘텐츠를 렌더링한다.
- **Suspense:** 동적 컴포넌트가 준비되는 동안 Fallback UI를 표시한다.

이를 통해 동적 데이터 처리를 기다리는 동안 전체 화면 렌더링이 지연되는 것을 방지한다.

## **질문: Next.js는 어떤 표시를 보고 가로채기로 판단할까?**

바로 **폴더 이름에 사용된&#x20;**`(.)`**,&#x20;**`(..)`**&#x20;같은 특수한 명명 규칙**을 보고 판단한다.

일반적인 폴더와 달리 Next.js 라우터는 이 기호들을 단순한 폴더명이 아니라 **Intercepting Route를 선언하는 예약된 문법**으로 해석한다.

### **예시**

현재 화면:

```
/feed
```

이동하려는 URL:

```
/photo/1
```

프로젝트에 다음 폴더가 존재한다.

```
app/
└── feed/
    └── (..)photo/
        └── [id]/
            └── page.tsx
```

Next.js가 이 폴더 구조를 분석하면 다음과 같이 해석한다.

```
(..)photo

= 현재 feed 라우트에서
  한 단계 상위 라우트로 이동한 뒤
  photo 라우트를 가로채라
```

라우트 세그먼트 기준으로 보면 다음과 같다.

```
현재 위치: /feed
              ↓
(..) : 상위 세그먼트로 이동
              ↓
photo : photo 라우트 선택
              ↓
[id] : 동적 ID 전달
```

따라서 다음 경로를 가로채는 라우트가 만들어진다.

```
/photo/[id]
```

### **실제로 가로채는 판단 과정**

1\. 사용자가 Link를 클릭한다.

/feed → /photo/1

2\. Next.js가 클라이언트 라우팅을 수행한다.

브라우저의 전체 페이지 이동 대신 내부 라우터가 이동을 처리한다.

3\. 현재 경로와 목적지 경로를 비교한다.

현재 화면의 라우트 트리에서 목적지를 가로챌 수 있는 Intercepting Route를 찾는다.

4\. 일치하는 가로채기 라우트를 발견한다.

feed/(..)photo/[id]/page.tsx가 목적지에 대응한다.

5\. 가로채기 라우트를 렌더링한다.

기존 피드는 유지되고 상세 화면이 추가되며 URL은 /photo/1로 변경된다.

즉, 개발자가 클릭 이벤트에서 직접 "모달을 띄워라"라고 명령하는 것이 아니다.

**폴더 구조 자체에 가로채기 규칙을 선언해 두면 Next.js 라우터가 내부 이동 시 해당 규칙을 적용하는 것이다.**

## **7. Soft Navigation과 Hard Navigation의 차이**

| 구분          | Soft Navigation       | Hard Navigation         |
| ------------- | --------------------- | ----------------------- |
| 발생 상황     | 앱 내부 `<Link>` 클릭 | 직접 URL 입력, 새로고침 |
| 처리 방식     | 클라이언트 라우터     | 서버에 직접 요청        |
| 가로채기 적용 | 적용 가능             | 적용되지 않음           |
| 기존 화면     | 유지 가능             | 새롭게 렌더링           |
| 표시 화면     | 모달 형태의 상세 화면 | 독립 상세 페이지        |
| URL           | `/photo/1`            | `/photo/1`              |

### **핵심 정리**

> Next.js는 `(.)`, `(..)` 등의 예약된 폴더 명명 규칙을 통해 가로채기 라우트를 미리 선언한다. 내부 링크 이동 시 현재 라우트와 목적지 라우트를 비교하여 해당 규칙이 적용되면 원본 페이지 대신 가로채기 라우트를 렌더링한다. 반면 직접 접속이나 새로고침에서는 원본 라우트를 렌더링한다.

이 구조를 활용하면 **URL은 동일하게 유지하면서, 진입 방식에 따라 모달 또는 독립 페이지로 서로 다른 UI를 제공할 수 있다.**
