# turbopack.ignoreIssue

- 공식 문서: [turbopack.ignoreIssue](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackIgnoreIssue)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `turbopack.ignoreIssue`가 Turbopack의 특정 오류와 경고를 CLI 출력 및 오류 오버레이에서 제외하는 방식을 이해한다.
- `ignoreIssue` 규칙에서 `path`와 선택적 `title`, `description`이 함께 일치해야 하는 조건을 설명할 수 있다.
- 각 필드에 문자열과 `RegExp`를 사용하는 방법과 `path` 패턴을 구체적으로 작성해야 하는 이유를 익힌다.
- 선택적 의존성 경고와 여러 규칙을 함께 억제하는 설정을 작성하고, 이 옵션이 `next dev --turbopack`에서만 동작한다는 점을 확인한다.

## 핵심 개념 및 설명

`turbopack.ignoreIssue`는 특정 [Turbopack](../../turbopack.md) 오류와 경고를 필터링해 CLI 출력과 오류 오버레이에 표시하지 않게 한다. 애플리케이션에 영향을 주지 않는다고 확인한 경고를 억제할 때 유용하다. 예를 들어 의도적으로 해석하지 않는 선택적 의존성 때문에 발생하는 경고를 숨길 수 있다.

이 옵션은 Turbopack을 사용할 때만 쓸 수 있다(`next dev --turbopack`).

### 사용법 (Usage)

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/vendor/**',
      },
    ],
  },
}

export default nextConfig
```

### 옵션 (Options)

`ignoreIssue` 배열의 각 규칙은 다음 필드로 이루어진 객체다.

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `path` | `string \| RegExp` | 예 | issue가 발생한 파일 경로와 일치한다 |
| `title` | `string \| RegExp` | 아니오 | issue 제목과 일치한다 |
| `description` | `string \| RegExp` | 아니오 | issue 설명과 일치한다 |

issue는 규칙의 `path`와 규칙에 지정한 나머지 필드가 모두 일치할 때 억제된다. `path`만 지정하면 일치하는 파일에서 발생한 모든 issue를 억제한다.

> **알아두면 좋은 점**: Turbopack 버전이 바뀌면 issue 제목과 설명도 바뀔 수 있다. `path` 필드는 대체로 안정적이지만 모든 issue 유형에서 계속 일치한다고 보장되지는 않는다. 가능하면 `title`이나 `description`보다 더 구체적인 `path` 패턴을 사용하는 편이 낫다.

#### `path`

문제가 시작된 파일 경로와 일치하는 **glob pattern**(문자열일 때) 또는 **regular expression**이다.

```js filename="next.config.js"
module.exports = {
  turbopack: {
    ignoreIssue: [
      // Glob pattern: vendor/ 아래 어떤 파일에서 발생한 issue든 억제한다
      { path: '**/vendor/**' },
      // RegExp: 패턴과 일치하는 파일에서 발생한 issue를 억제한다
      { path: /node_modules\/legacy-lib/ },
    ],
  },
}
```

#### `title`

문자열이면 issue 제목과 **정확히 일치**하고 `RegExp`면 issue 제목과 일치하는 패턴이다.

```js filename="next.config.js"
module.exports = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/src/**',
        title: 'Module not found',
      },
    ],
  },
}
```

#### `description`

문자열이면 issue 설명과 **정확히 일치**하고 `RegExp`면 issue 설명과 일치하는 패턴이다.

```js filename="next.config.js"
module.exports = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/src/**',
        description: /Cannot find module 'optional-dep'/,
      },
    ],
  },
}
```

### 예제 (Examples)

#### 선택적 의존성 경고 억제 (Suppressing warnings for optional dependencies)

코드에서 선택적 `require()` 호출을 `try/catch`로 감싸면 Turbopack이 `"Module not found"` 경고를 보고할 수 있다. 다음과 같이 억제할 수 있다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/lib/optional-feature/**',
        title: 'Module not found',
      },
    ],
  },
}

export default nextConfig
```

#### 여러 규칙 조합 (Combining multiple rules)

서로 다른 issue를 억제하는 규칙을 여러 개 지정할 수 있다.

```js filename="next.config.js"
module.exports = {
  turbopack: {
    ignoreIssue: [
      { path: '**/vendor/**' },
      { path: '**/legacy/**', title: 'Module not found' },
      { path: /generated\//, description: /expected identifier/ },
    ],
  },
}
```

### 버전 기록 (Version History)

| 버전 | 변경 사항 |
| --- | --- |
| `v16.2.0` | `turbopack.ignoreIssue`를 도입했다. |

### 다음 단계 (Next Steps)

Turbopack 설정을 더 알아본다.

#### `turbopack`

[Turbopack 전용 옵션 설정](./turbopack.md)을 확인한다.

#### Turbopack

[Turbopack](../../turbopack.md)은 JavaScript와 TypeScript에 최적화한 증분 번들러다. Rust로 작성했으며 Next.js에 포함되어 있다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `next dev --turbopack`에서 의도적으로 해석하지 않는 선택적 의존성 경고가 발생하도록 구성하고 `ignoreIssue`를 적용하기 전후의 CLI 출력과 오류 오버레이를 비교한다.
- `path`만 지정한 규칙, `path`와 `title`을 함께 지정한 규칙, `RegExp`를 사용하는 규칙을 각각 준비해 어떤 issue가 억제되는지 확인한다.
- 여러 규칙을 적용한 뒤 `vendor`, `legacy`, `generated` 경로의 issue가 각각 기대한 조건에서만 사라지는지 관찰한다.

## 연습 문제

1. `turbopack.ignoreIssue`를 사용할 수 있는 조건은 무엇인가?
   - A. `next dev --turbopack`으로 Turbopack을 사용할 때
   - B. `next start`로 production 서버를 실행할 때만
   - C. webpack으로 production build를 실행할 때
   - D. 브라우저에서 Client Component를 렌더링할 때

<details><summary>정답 보기</summary>

정답: **A**  
해설: 이 옵션은 Turbopack을 사용하는 `next dev --turbopack`에서만 사용할 수 있다.
</details>

2. 하나의 `ignoreIssue` 규칙이 issue를 억제하는 조건으로 올바른 것은 무엇인가?
   - A. `title`만 일치하면 된다.
   - B. `path`와 규칙에 지정한 모든 선택 필드가 일치해야 한다.
   - C. `description`이 비어 있으면 모든 issue를 억제한다.
   - D. 배열의 규칙 중 하나라도 문법적으로 유효하면 모든 issue를 억제한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: issue는 `path`와 규칙에 지정한 나머지 필드가 모두 일치할 때 억제된다. `path`만 지정한 경우에는 해당 파일의 모든 issue가 대상이 된다.
</details>

3. `title`이나 `description`보다 구체적인 `path` 패턴을 우선하는 이유는 무엇인가?
   - A. `path`는 문자열로만 작성할 수 있기 때문이다.
   - B. `title`과 `description`은 Turbopack 버전 사이에서 바뀔 수 있기 때문이다.
   - C. `path`를 지정하면 `next build`에서도 옵션이 자동으로 적용되기 때문이다.
   - D. `description`은 `RegExp`를 지원하지 않기 때문이다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: issue 제목과 설명은 Turbopack 버전에 따라 바뀔 수 있으므로 일반적으로 더 안정적인 `path` 필드를 구체적으로 작성하는 편이 낫다.
</details>

## 챕터 요약

- `turbopack.ignoreIssue`는 특정 Turbopack 오류와 경고를 CLI 출력 및 오류 오버레이에서 제외한다.
- 이 옵션은 `next dev --turbopack`에서만 사용할 수 있다.
- `ignoreIssue` 규칙은 `path`와 선택적인 `title`, `description`을 사용하며 지정한 필드는 모두 일치해야 한다.
- 각 필드는 문자열 또는 `RegExp`로 작성할 수 있고, `path`만 지정하면 해당 파일의 모든 issue를 억제한다.
- `title`과 `description`은 버전에 따라 바뀔 수 있으므로 가능한 경우 구체적인 `path` 패턴을 우선한다.
