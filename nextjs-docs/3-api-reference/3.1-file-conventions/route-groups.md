# Route Groups

- 공식 문서: [Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- URL을 바꾸지 않고 라우트를 팀·관심사·기능별로 묶는다.
- 공유 layout 범위를 조절하고 여러 root layout을 구성한다.
- 경로 충돌과 전체 페이지 로드 caveat를 피한다.

## 핵심 개념 및 설명

폴더 이름을 `(folderName)`처럼 괄호로 감싸면 Route Group이 된다. 이 폴더는 정리 목적으로만 사용되고 URL path에는 포함되지 않는다. 팀·기능별로 라우트를 나누고, 일부 라우트만 layout을 공유하거나, 여러 root layout을 정의할 때 유용하다.

서로 다른 group이라도 결과 URL이 같으면 충돌한다. 예를 들어 `(marketing)/about/page.js`와 `(shop)/about/page.js`는 모두 `/about`이므로 오류다. 서로 다른 root layout 사이를 이동하면 client-side transition이 아니라 전체 페이지 로드가 발생한다. 최상위 `app/layout.js` 없이 여러 root layout을 사용한다면 `/` route도 group 중 하나 안에 두어야 한다.

## 예제 및 데모 설계

- Phase 2에서 `(marketing)`과 `(shop)`을 만들고 URL에 group 이름이 노출되지 않는지 확인한다.
- 두 root layout 사이 이동 때 document가 다시 로드되는지 기록한다.

## 연습 문제

1. `app/(shop)/cart/page.js`의 URL은?
   - A. `/(shop)/cart`
   - B. `/shop/cart`
   - C. `/cart`

<details><summary>정답 보기</summary>

정답: C. Route Group 이름은 URL에 포함되지 않는다.
</details>

## 챕터 요약

- Route Group은 `(name)` 폴더 규칙이다.
- group 이름은 URL path에 포함되지 않는다.
- layout 공유 범위와 여러 root layout을 구성할 수 있다.
- 같은 URL로 해석되는 group route는 충돌한다.
- 서로 다른 root layout 사이에서는 전체 페이지가 로드된다.
