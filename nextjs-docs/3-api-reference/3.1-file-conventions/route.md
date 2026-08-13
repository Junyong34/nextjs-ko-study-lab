# route.js

- 공식 문서: [route.js](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Web Request/Response API로 Route Handler를 작성한다.
- 지원 HTTP 메서드와 caching·라우트 충돌 규칙을 이해한다.
- `NextRequest`, `RouteContext`, CORS와 webhook 사용 사례를 다룬다.

## 핵심 개념 및 설명

### Route Handler

`route.js|ts`는 `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` 함수를 export해 요청을 처리한다. 지원하지 않는 메서드는 `405 Method Not Allowed`가 된다. 표준 `Request`·`Response`와 확장된 `NextRequest`를 사용할 수 있다.

```ts
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

### Context와 라우트 규칙

두 번째 인자의 `params`는 Promise다. `RouteContext<'/users/[id]'>`는 route literal에서 params 타입을 생성한다. 같은 세그먼트에 `page.js`와 `route.js`를 함께 둘 수 없으며, Route Handler는 layout·Client Component처럼 컴포넌트 계층에 참여하지 않는다.

`GET`은 명시적으로 캐시하지 않는 한 다이나믹이다. `'use cache'`는 Route Handler 본문에서 지원하지 않지만, 캐시된 helper를 호출하거나 정적 응답에 Cache-Control을 설정할 수 있다. 다른 HTTP 메서드는 캐시되지 않는다.

### 활용

cookies·headers 읽기/쓰기, redirect, 다이나믹 params, CORS, webhook, sitemap·robots·icon 같은 비-UI 응답에 적합하다. 요청 body는 `request.json()`, `request.formData()`, `request.text()` 등 Web API로 읽는다.

## 예제 및 데모 설계

- Phase 2에서 `/api/posts/[id]`의 GET/POST와 `RouteContext`를 구현한다.
- 허용하지 않은 메서드의 405, CORS header, webhook signature 실패를 응답 로그로 검증한다.
- 정적 GET과 요청 데이터에 의존하는 GET의 caching 차이를 비교한다.

## 연습 문제

1. `route.js`와 같은 세그먼트에 함께 둘 수 없는 파일은?
   - A. `layout.js`
   - B. `page.js`
   - C. `loading.js`

<details><summary>정답 보기</summary>

정답: B. 한 세그먼트가 UI와 HTTP endpoint를 동시에 소유할 수 없다.
</details>

2. Route Handler가 지원하지 않는 HTTP 메서드의 기본 응답은?
   - A. 200
   - B. 404
   - C. 405

<details><summary>정답 보기</summary>

정답: C. `405 Method Not Allowed`가 반환된다.
</details>

## 챕터 요약

- `route.js`는 Web API 기반 HTTP handler를 정의한다.
- `params`는 Promise이고 `RouteContext`로 타입화할 수 있다.
- `page.js`와 같은 세그먼트에 공존하지 못한다.
- GET도 명시적인 전략 없이는 다이나믹이다.
- API, webhook, CORS, 비-UI 응답에 사용할 수 있다.
