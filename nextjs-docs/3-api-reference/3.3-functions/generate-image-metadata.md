# generateImageMetadata

- 공식 문서: [generateImageMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata)
- 상위 메뉴: [Functions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 단일 메타데이터 특수 파일에서 여러 크기나 버전의 이미지를 생성하는 `generateImageMetadata` 함수의 역할을 이해한다.
- `icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`에서 다중 이미지 메타데이터 배열을 반환하는 구조를 파악한다.
- 기본 export 컴포넌트에서 비동기 `id`와 `params` Promise를 수신하여 각각의 이미지를 동적으로 렌더링하는 방법을 익힌다.
- Next.js 16의 Promise 기반 매개변수 비동기 처리 방식을 준수한다.

## 핵심 개념 및 설명

`generateImageMetadata`는 하나의 메타데이터 이미지 파일([`opengraph-image.tsx`](../3.1-file-conventions/3.1.21-metadata/opengraph-image.md), `icon.tsx` 등) 안에서 여러 개의 이미지 해상도(예: 48x48, 72x72)나 복수의 Open Graph 이미지를 동적으로 생성할 때 사용하는 함수다.

하드코딩된 단일 이미지 대신, 배열로 메타데이터 목록을 반환하면 프레임워크가 각 항목의 `id`를 기본 export 함수에 전달하여 여러 장의 이미지를 일괄 생성한다.

```tsx filename="app/icon.tsx" switcher
import { ImageResponse } from 'next/og'

// 1. 생성할 이미지들의 메타데이터 배열 반환
export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

// 2. 각 id에 맞춰 이미지를 동적으로 렌더링
export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = await id

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          background: '#000',
          color: '#fafafa',
        }}
      >
        {iconId === 'small' ? 'S' : 'M'}
      </div>
    )
  )
}
```

```jsx filename="app/icon.js" switcher
import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

export default async function Icon({ id }) {
  const iconId = await id

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          background: '#000',
          color: '#fafafa',
        }}
      >
        {iconId === 'small' ? 'S' : 'M'}
      </div>
    )
  )
}
```

### 반환 객체 규격 (Return Object)

`generateImageMetadata`는 다음 프로퍼티를 가진 객체들의 배열(`Array`)을 반환해야 한다:

- `id` (필수): 각 이미지를 고유하게 식별하는 `string` 또는 `number`.
- `alt` (선택): 이미지 대체 텍스트.
- `size` (선택): `{ width: number, height: number }` 형태의 이미지 크기.
- `contentType` (선택): `'image/png'`, `'image/jpeg'` 등의 MIME 타입.

### Version History

| 버전 | 변경 사항 |
|---|---|
| `v16.0.0` | 이미지 생성 컴포넌트의 `id`와 `params`가 `Promise` 타입으로 변경 |
| `v13.3.0` | `generateImageMetadata` 도입 |

## 예제 및 데모 설계

- `app/icon.tsx`에서 다중 크기(32x32, 48x48) 아이콘을 생성하고 브라우저 `<head>`에 각각의 `<link rel="icon">` 태그가 생성되는지 확인한다.
- 동적 상품 상세 라우트(`app/products/[id]/opengraph-image.tsx`)에서 외부 갤러리 API를 조회하여 3개의 OG 이미지를 한 번에 생성하는 예제를 구현한다.
- Next.js 16 환경에서 `await id` 및 `await params`를 통한 비동기 언래핑 처리를 검증한다.

## 연습 문제

1. `generateImageMetadata`가 반환하는 객체 배열에서 **반드시 포함되어야 하는 필수 필드**는?
   - A. `size`
   - B. `id`
   - C. `alt`
   - D. `contentType`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `generateImageMetadata`에서 반환하는 각 항목은 이미지 생성 함수에 전달될 식별자인 `id`를 반드시 포함해야 한다.
</details>

2. Next.js 16 이후 이미지 생성 기본 export 컴포넌트(`export default function Image({ id, params })`)에서 `id`를 다루는 올바른 방식은?
   - A. `const iconId = id` (동기식 접근)
   - B. `const iconId = await id` (비동기 Promise 언래핑)
   - C. `const iconId = id.get()`
   - D. `const iconId = use(id)`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js 16부터 `id` 및 `params`는 비동기 `Promise`로 전달되므로 컴포넌트 내부에서 `await id`로 해결해야 한다.
</details>

## 챕터 요약

- `generateImageMetadata`는 하나의 메타데이터 특수 파일에서 다수의 이미지 버전을 생성하는 함수다.
- 고유 `id`, `size`, `contentType`이 포함된 배열을 반환한다.
- 기본 export 컴포넌트는 각 `id`를 받아 개별 이미지를 렌더링한다.
- Next.js 16부터 `id`와 `params`는 비동기 Promise로 전달된다.
- 파비콘, 앱 아이콘, 복수 OG 이미지 생성에 유용하다.
