# optimizePackageImports

- 공식 문서: [optimizePackageImports](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Experimental**: 이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 남길 수 있다.

## 학습 목표

- 모듈을 많이 export하는 패키지에서 실제로 사용하는 모듈만 로드하도록 `experimental.optimizePackageImports`를 구성하는 방법을 이해한다.
- 여러 named export를 편리하게 import하는 코드 형태가 번들 성능 개선과 어떤 관계인지 파악한다.
- Next.js가 기본으로 최적화하는 라이브러리 목록과 이 기능의 experimental 상태를 확인한다.

## 핵심 개념 및 설명

일부 패키지는 수백 개 또는 수천 개의 모듈을 export하므로 개발 환경과 프로덕션 환경에서 성능 문제를 일으킬 수 있다. `experimental.optimizePackageImports`에 패키지를 추가하면 named export가 많은 import 문을 쓰는 편리함을 유지하면서 실제로 사용하는 모듈만 로드한다.

### 설정 예시

```js filename="next.config.js"
module.exports = {
  experimental: {
    optimizePackageImports: ['package-name'],
  },
}
```

`optimizePackageImports`의 값은 최적화할 패키지 이름을 담은 배열이다. 공식 예시의 문자열 리터럴 `'package-name'`은 설정 형식을 나타내는 자리표시자이므로 실제 사용하는 패키지 이름으로 바꾼다.

### 기본으로 최적화되는 라이브러리

다음 라이브러리는 `optimizePackageImports`에 추가하지 않아도 기본으로 최적화된다.

- `lucide-react`
- `date-fns`
- `lodash-es`
- `ramda`
- `antd`
- `react-bootstrap`
- `ahooks`
- `@ant-design/icons`
- `@headlessui/react`
- `@headlessui-float/react`
- `@heroicons/react/20/solid`
- `@heroicons/react/24/solid`
- `@heroicons/react/24/outline`
- `@visx/visx`
- `@tremor/react`
- `rxjs`
- `@mui/material`
- `@mui/icons-material`
- `recharts`
- `react-use`
- `@material-ui/core`
- `@material-ui/icons`
- `@tabler/icons-react`
- `mui-core`
- `react-icons/*`
- `effect`
- `@effect/*`

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 같은 named export를 사용하는 페이지를 `optimizePackageImports` 설정 전후로 각각 빌드한 뒤 브라우저 DevTools의 Network 탭에서 실제 로드되는 JavaScript 청크를 비교한다.
- 설정에 등록한 패키지에서 사용하지 않은 모듈이 별도 청크에 포함되는지 빌드 산출물과 번들 분석 도구로 확인한다.
- 이 기능은 experimental이므로 데모 화면에는 최적화 성공을 단정하는 대신 설정값, 비교한 빌드, 관찰한 청크 목록을 함께 표시한다.

## 연습 문제

1. `experimental.optimizePackageImports`의 핵심 동작으로 올바른 것은 무엇인가?
   - A. 패키지의 모든 모듈을 하나의 파일로 합친다.
   - B. named export 문법을 사용할 수 없게 만들고 개별 파일 import만 허용한다.
   - C. 패키지에서 실제로 사용하는 모듈만 로드하면서 named export를 사용하는 편리함을 유지한다.
   - D. development에서만 동작하고 production에서는 항상 비활성화된다.

<details><summary>정답 보기</summary>

정답: **C**

해설: 이 설정은 실제로 사용하는 모듈만 로드하면서 named export가 많은 import 문을 작성하는 편리함을 유지한다.
</details>

2. 다음 중 Next.js가 기본으로 최적화하는 라이브러리가 아닌 것은 무엇인가?
   - A. `lucide-react`
   - B. `date-fns`
   - C. `recharts`
   - D. `example-package`

<details><summary>정답 보기</summary>

정답: **D**

해설: `lucide-react`, `date-fns`, `recharts`는 공식 기본 목록에 포함되지만 `example-package`는 포함되지 않는다.
</details>

3. `optimizePackageImports`에 대한 설명으로 올바른 것은 무엇인가?
   - A. 현재 stable이며 production 사용이 강하게 요구된다.
   - B. experimental 기능이며 변경될 수 있고 production에는 권장하지 않는다.
   - C. package 이름이 아니라 파일 확장자 배열을 값으로 받는다.
   - D. 기본 최적화 라이브러리를 모두 직접 배열에 다시 적어야 한다.

<details><summary>정답 보기</summary>

정답: **B**

해설: 공식 문서는 이 기능을 `experimental`로 표시하고 변경될 수 있으며 production에는 권장하지 않는다고 안내한다.
</details>

## 챕터 요약

- `experimental.optimizePackageImports`는 패키지에서 실제로 사용하는 모듈만 로드하도록 돕는다.
- 여러 named export를 사용하는 import 문법의 편리함은 유지한다.
- 수백 개 또는 수천 개의 모듈을 export하는 패키지에서 생기는 개발과 프로덕션 성능 문제를 줄이려는 기능이다.
- `lucide-react`, `date-fns`, `recharts` 등 공식 목록의 라이브러리는 기본으로 최적화된다.
- 이 기능은 experimental이며 변경될 수 있고 production에는 권장하지 않는다.
