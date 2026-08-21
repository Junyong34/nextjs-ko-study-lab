# JSON-LD

- 공식 문서: [JSON-LD](https://nextjs.org/docs/app/guides/json-ld)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- JSON-LD가 검색 엔진과 AI에 페이지의 구조를 전달하는 방식을 설명할 수 있다.
- `layout.js` 또는 `page.js`에서 안전하게 JSON-LD를 렌더링할 수 있다.
- 구조화된 데이터의 타입과 출력 결과를 검증할 수 있다.

## 핵심 개념 및 설명

JSON-LD는 구조화된 데이터(structured data)를 표현하는 형식이다. 검색 엔진과 AI는 페이지의 본문뿐 아니라 사람, 이벤트, 조직, 영화, 책, 레시피, 상품과 같은 엔터티의 의미와 관계를 이해하는 데 이 데이터를 사용할 수 있다.

Next.js에서는 `layout.js` 또는 `page.js` 컴포넌트에 네이티브 `<script type="application/ld+json">` 태그를 렌더링하는 방식을 권장한다. JSON-LD는 실행할 JavaScript가 아니라 데이터이므로, JavaScript 로딩과 실행에 최적화된 [`next/script`](../3-api-reference/3.2-components/script.md) 대신 네이티브 `<script>` 태그를 사용한다.

```tsx filename="app/products/[id]/page.tsx"
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }

  return (
    <section>
      {/* 상품의 구조화된 데이터를 페이지에 추가한다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* ... */}
    </section>
  )
}
```

`JSON.stringify`만 사용하면 XSS 삽입에 쓰일 수 있는 악성 문자열을 정리하지 않는다. 예제처럼 `<` 문자를 유니코드 등가 표현인 `\u003c`로 바꾸면 HTML 태그가 시작되는 것을 막을 수 있다. 조직에서 권장하는 문자열 정리 방식을 검토하거나 `serialize-javascript` 같은 커뮤니티 대안을 사용한다.

구조화된 데이터는 [Google Rich Results Test](https://search.google.com/test/rich-results) 또는 [Schema Markup Validator](https://validator.schema.org/)로 검사할 수 있다. TypeScript 타입이 필요하면 `schema-dts` 같은 커뮤니티 패키지를 사용할 수 있다.

```tsx filename="app/products/[id]/page.tsx"
import type { Product, WithContext } from 'schema-dts'

const jsonLd: WithContext<Product> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Next.js Sticker',
  image: 'https://nextjs.org/imgs/sticker.png',
  description: 'Dynamic at the speed of static.',
}
```

> **알아두면 좋은 점**: `next/script` 컴포넌트는 JavaScript의 로딩과 실행에 최적화되어 있다. JSON-LD는 실행 코드가 아닌 구조화된 데이터이므로 네이티브 `<script>` 태그를 사용한다.

## 예제 및 데모 설계

- Phase 2에서 상품 상세 페이지에 `Product` JSON-LD를 추가한다.
- 상품명에 `<script>` 형태의 문자열을 넣어도 렌더링된 HTML이 실행 코드로 해석되지 않는지 확인한다.
- 페이지 소스의 JSON-LD를 Rich Results Test와 Schema Markup Validator에 입력해 타입과 필수 필드를 검증한다.

## 연습 문제

1. Next.js 페이지에 JSON-LD를 넣는 권장 방식은 무엇인가?

   - A. `next/script`의 `worker` 전략을 사용한다.
   - B. 네이티브 `<script type="application/ld+json">` 태그를 렌더링한다.
   - C. JSON을 화면에 보이는 `<pre>` 요소에 출력한다.

   <details><summary>정답 보기</summary>

   정답: B. JSON-LD는 실행 코드가 아니라 구조화된 데이터이므로 네이티브 `<script>` 태그를 사용한다.

   </details>

2. 예제에서 `JSON.stringify(jsonLd).replace(/</g, '\\u003c')`를 사용하는 이유는 무엇인가?

   - A. JSON 파일 크기를 줄이기 위해서다.
   - B. `<` 문자가 HTML 태그를 시작해 XSS로 이어지는 것을 막기 위해서다.
   - C. JSON-LD의 타입을 TypeScript로 추론하기 위해서다.

   <details><summary>정답 보기</summary>

   정답: B. 악성 문자열의 `<`를 유니코드 등가 표현으로 바꿔 HTML로 해석되지 않게 한다.

   </details>

## 챕터 요약

- JSON-LD는 검색 엔진과 AI가 페이지 엔터티의 구조를 이해하도록 돕는다.
- Next.js에서는 `layout.js`나 `page.js`에 네이티브 JSON-LD `<script>` 태그를 렌더링한다.
- 외부 데이터는 HTML 태그가 실행되지 않도록 안전하게 직렬화해야 한다.
- Rich Results Test와 Schema Markup Validator로 결과를 검증할 수 있다.
- `schema-dts` 같은 커뮤니티 패키지로 구조화된 데이터에 타입을 지정할 수 있다.
