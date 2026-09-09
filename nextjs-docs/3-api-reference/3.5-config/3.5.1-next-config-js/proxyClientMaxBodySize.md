# proxyClientMaxBodySize

- 공식 문서: [proxyClientMaxBodySize](https://nextjs.org/docs/app/api-reference/config/next-config-js/proxyClientMaxBodySize)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `proxy`와 그 아래에서 실행되는 `Route Handler`가 같은 요청 본문을 읽을 수 있도록 Next.js가 본문을 복제하고 메모리에 버퍼링하는 방식을 이해한다.
- `experimental.proxyClientMaxBodySize`에서 문자열 형식과 바이트 단위 숫자 형식을 설정하는 방법을 익힌다.
- 요청 본문이 제한을 넘었을 때 부분 본문, 경고 로그, 정상 처리라는 동작을 구분한다.

## 핵심 개념 및 설명

현재 이 기능은 실험적이며 변경될 수 있으므로 프로덕션 사용을 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에서 피드백을 공유할 수 있다.

`proxy`를 사용하면 Next.js가 요청 본문을 자동으로 복제하고 메모리에 버퍼링한다. 이렇게 해야 `proxy`와 그 아래에서 실행되는 `Route Handler`가 본문을 여러 번 읽을 수 있다. 과도한 메모리 사용을 막기 위해 이 옵션으로 버퍼링한 본문의 크기 제한을 정한다.

기본 최대 본문 크기는 **10MB**다. 요청 본문이 이 제한을 넘으면 제한된 크기까지만 버퍼링하고 제한을 넘긴 라우트를 알려 주는 경고를 기록한다.

### Options (옵션)

#### String format (recommended) (문자열 형식, 권장)

사람이 읽기 쉬운 문자열 형식으로 크기를 지정한다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: '1mb',
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxyClientMaxBodySize: '1mb',
  },
}

module.exports = nextConfig
```

지원 단위는 `b`, `kb`, `mb`, `gb`다.

#### Number format (숫자 형식)

바이트 단위 숫자로 크기를 지정할 수도 있다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: 1048576, // 바이트 단위로 표현한 1MB
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxyClientMaxBodySize: 1048576, // 바이트 단위로 표현한 1MB
  },
}

module.exports = nextConfig
```

### Behavior (동작)

요청 본문이 설정한 제한을 넘으면 다음 순서로 처리한다.

1. Next.js는 제한에 해당하는 첫 N바이트까지만 버퍼링한다.
2. 제한을 넘긴 라우트를 알려 주는 경고를 콘솔에 기록한다.
3. 요청은 정상적으로 계속 처리되지만 애플리케이션에서 읽을 수 있는 본문은 일부뿐이다.
4. 요청은 실패하지 않으며 클라이언트에 오류를 반환하지 않는다.

애플리케이션에서 요청 본문 전체를 처리해야 한다면 다음 방법을 선택한다.

- `proxyClientMaxBodySize` 제한을 높인다.
- 애플리케이션 로직에서 부분 본문을 안전하게 처리한다.

### Example (예제)

`proxy.ts`에서 본문을 읽는다.

```ts filename="proxy.ts"
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  // Next.js는 설정한 크기 제한에 따라 본문을 자동으로 버퍼링한다.
  // proxy에서 본문을 읽을 수 있다.
  const body = await request.text()

  // 본문이 제한을 넘었다면 일부 데이터만 사용할 수 있다.
  console.log('Body size:', body.length)

  return NextResponse.next()
}
```

`app/api/upload/route.ts`의 `Route Handler`에서도 본문을 읽는다.

```ts filename="app/api/upload/route.ts"
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Route Handler에서도 본문을 계속 읽을 수 있다.
  const body = await request.text()

  console.log('Body in route handler:', body.length)

  return NextResponse.json({ received: body.length })
}
```

### Good to know (알아두면 좋은 점)

> **알아두면 좋은 점**:
>
> - 이 설정은 애플리케이션에서 `proxy`를 사용할 때만 적용된다.
> - 기본 제한인 10MB는 메모리 사용량과 일반적인 사용 사례의 균형을 고려한 값이다.
> - 제한은 동시에 실행 중인 모든 요청의 총량에 적용되지 않고 요청마다 적용된다.
> - 큰 파일 업로드를 처리하는 애플리케이션은 필요에 맞춰 제한을 높일지 검토한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 파일 업로드 화면에서 제한보다 큰 요청을 전송하고 `proxy`와 `Route Handler`가 읽은 `body.length`를 응답 화면에 표시한다.
- `experimental.proxyClientMaxBodySize: '1mb'`와 더 작은 값을 비교해 제한을 넘었을 때 부분 본문만 처리되는 결과와 콘솔 경고를 관찰한다.
- 요청이 실패하거나 클라이언트 오류를 반환하지 않고 계속 처리된다는 점을 네트워크 패널과 응답 데이터로 확인한다.

## 연습 문제

1. 요청 본문이 `proxyClientMaxBodySize` 제한을 넘었을 때의 동작으로 옳은 것은?
   - A. 요청을 즉시 실패시키고 항상 클라이언트에 오류를 반환한다.
   - B. 제한된 크기까지만 버퍼링하고 경고를 기록한 뒤 요청을 계속 처리한다.
   - C. 제한을 무시하고 본문 전체를 무제한으로 메모리에 저장한다.
   - D. `proxy`만 본문을 읽고 `Route Handler`에서는 본문을 읽을 수 없게 한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: 제한을 넘은 요청은 첫 N바이트까지만 버퍼링되며 경고가 기록된다. 요청은 계속 처리되고 클라이언트 오류는 반환되지 않는다.
</details>

2. `proxyClientMaxBodySize`에 사용할 수 있는 설정 형식으로 옳은 것은?
   - A. `'1mb'`와 같은 문자열 또는 `1048576`과 같은 바이트 단위 숫자
   - B. boolean 값만 사용
   - C. URL 문자열만 사용
   - D. 배열만 사용

<details><summary>정답 보기</summary>

정답: **A**  
해설: 사람이 읽기 쉬운 `b`, `kb`, `mb`, `gb` 단위 문자열이나 바이트 단위 숫자를 사용할 수 있다.
</details>

## 챕터 요약

- `proxy`를 사용하면 Next.js가 요청 본문을 복제하고 메모리에 버퍼링해 `proxy`와 `Route Handler`가 읽게 한다.
- 기본 최대 본문 크기는 10MB이며 `experimental.proxyClientMaxBodySize`로 조정한다.
- 문자열 형식은 `b`, `kb`, `mb`, `gb` 단위를 지원하고 숫자 형식은 바이트 단위로 해석한다.
- 제한을 넘은 요청은 부분 본문만 제공하고 경고를 기록하지만 클라이언트 오류로 실패하지 않는다.
- 큰 업로드를 처리할 때는 제한을 높이거나 부분 본문을 애플리케이션에서 처리한다.
