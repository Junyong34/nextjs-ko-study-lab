# crossOrigin

- 공식 문서: [crossOrigin](https://nextjs.org/docs/app/api-reference/config/next-config-js/crossOrigin)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js가 생성하는 `<script>` 태그에 붙는 `crossOrigin` 설정이 어떤 역할을 하고 CORS를 어떻게 제어하는지 이해한다.
- `anonymous`와 `use-credentials` 옵션 값의 기술적 차이점과 자격 증명 전송 규칙을 파악한다.
- CDN 환경에서 외부 스크립트 에러 로깅(`window.onerror`) 시 상세 스택 트레이스를 보존하려면 어떤 연계 설정이 필요한지 설명할 수 있다.

## 핵심 개념 및 설명

`crossOrigin`은 Next.js가 HTML에 주입하는 `<script>` 태그와 `next/script` 컴포넌트가 불러오는 스크립트 요소에 어떤 `crossorigin` 속성 값을 넣을지 지정하는 옵션이다.

기본적으로 브라우저는 교차 출처(Cross-Origin)에서 불러온 스크립트에 런타임 오류가 발생하면 보안상의 이유로 에러 상세 정보를 숨기고 `"Script error."`라는 모호한 메시지만 전달한다. `crossOrigin` 설정을 적용하고 리소스 제공 서버(CDN 등)가 적절한 CORS 헤더(`Access-Control-Allow-Origin`)를 응답하도록 구성하면, 브라우저가 온전한 에러 메시지와 스택 트레이스를 모니터링 도구로 전달할 수 있다.

### 기본 설정 구조

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  crossOrigin: 'anonymous',
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: 'anonymous',
}

export default nextConfig
```

### Options

| 속성명 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `crossOrigin` | `'anonymous' \| 'use-credentials' \| undefined` | `undefined` | 주입되는 스크립트 태그에 부여할 CORS 자격 증명 모드를 지정한다. |

#### anonymous

- Next.js가 렌더링하는 `<script>` 태그에 `crossorigin="anonymous"` 속성을 부여한다.
- 브라우저는 대상 리소스를 요청할 때 HTTP 쿠키, 클라이언트 SSL 인증서 등의 사용자 자격 증명(credentials)을 전송하지 않는다.
- 정적 자산을 별도의 CDN이나 서브도메인에서 호스팅할 때 가장 일반적으로 사용하는 기본 설정이다.

#### use-credentials

- Next.js가 렌더링하는 `<script>` 태그에 `crossorigin="use-credentials"` 속성을 부여한다.
- 브라우저는 교차 출처 요청 시에도 대상 도메인에 연결된 쿠키와 인증 토큰 등의 자격 증명을 헤더에 포함하여 전송한다.
- 비공개 CDN이나 사용자 세션 인증이 필요한 보호된 정적 자산 저장소에서 스크립트를 가져와야 할 때 사용한다.

### 동작 원리 및 실무 고려사항

1. **상세 에러 추적(Error Logging)**:
   외부 도메인에서 스크립트를 서빙할 때 `crossorigin` 속성이 없으면 `window.onerror` 이벤트 리스너가 구체적인 에러 내용과 파일 경로, 행 번호를 파악할 수 없다. `crossOrigin: 'anonymous'`를 지정하면 Sentry나 Datadog 같은 에러 모니터링 솔루션에서 소스맵과 결합된 완전한 런타임 에러 스택을 수집할 수 있다.

2. **CDN 서버의 CORS 응답 헤더 필수**:
   `crossOrigin: 'anonymous'`를 활성화하면 브라우저는 CORS 모드로 스크립트를 로드한다. 따라서 해당 스크립트를 제공하는 원격 서버(또는 CDN)는 반드시 다음 헤더를 응답해야 한다:
   ```http
   Access-Control-Allow-Origin: *
   ```
   CDN 서버에 올바른 `Access-Control-Allow-Origin` 응답 헤더가 설정되어 있지 않으면 브라우저는 보안 정책에 따라 스크립트 실행을 완전히 차단한다.

3. **`assetPrefix`와의 시너지**:
   정적 번들 자산을 별도의 글로벌 CDN으로 분리해 `assetPrefix`를 지정한 프로덕션 아키텍처에서는 자산 도메인과 웹사이트 도메인이 달라지므로 `crossOrigin: 'anonymous'`를 함께 설정하는 것이 표준 모범 사례다.

> **알아두면 좋은 점**:
>
> - Next.js의 설정 파일에서는 카멜케이스인 `crossOrigin`으로 선언하지만 실제 생성되는 HTML 태그의 속성명은 표준 사양에 따라 소문자 `crossorigin`으로 출력된다.
> - `import Script from 'next/script'`로 컴포넌트 레벨에서 불러오는 스크립트에도 이 설정이 기본값으로 계승된다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (브라우저 DevTools Elements 탭에서 주입된 <script> 태그의 crossorigin 속성 확인 가능)
- HTML 주입 속성 관찰: `next.config.ts`에 `crossOrigin: 'anonymous'`를 설정하고 애플리케이션을 빌드/실행한 후, 브라우저 개발자 도구의 Elements 탭에서 Next.js가 생성한 `<script>` 태그들에 `crossorigin="anonymous"` 속성이 정상적으로 부여되었는지 검사한다.
- 에러 마스킹 해제 검증: 의도적으로 에러를 발생시키는 외부 CDN 스크립트를 로드할 때 `crossOrigin` 속성 유무에 따라 콘솔에 `"Script error."`로 뭉개지는지, 아니면 상세 스택이 출력되는지 대조한다.
- `use-credentials` 동작 확인: `crossOrigin: 'use-credentials'` 설정 시 네트워크 요청의 헤더에 브라우저 쿠키가 첨부되는지 네트워크 탭에서 확인한다.

## 연습 문제

1. Next.js에서 `crossOrigin: 'anonymous'` 설정을 적용했을 때 브라우저의 동작으로 가장 적절한 것은?
   - A. 모든 스크립트를 암호화하여 로컬 스토리지에만 캐싱한다.
   - B. 생성된 `<script>` 태그에 `crossorigin="anonymous"`를 추가하여 자격 증명 없이 CORS 모드로 스크립트를 요청한다.
   - C. 브라우저 쿠키와 인증 헤더를 무조건 첨부하여 비공개 리소스를 요청한다.
   - D. 동일 출처가 아닌 모든 외부 스크립트의 다운로드를 원천 차단한다.

<details><summary>정답 보기</summary>

정답: **B**
해설: `'anonymous'` 값은 쿠키나 인증 정보 같은 자격 증명을 포함하지 않고 교차 출처 리소스를 요청하도록 브라우저에 지시하는 표준 HTML 속성을 주입한다.
</details>

2. 외부 CDN 도메인에서 스크립트를 로드하면서 `crossOrigin: 'anonymous'`를 적용할 때 반드시 갖추어야 하는 전제 조건은?
   - A. CDN 서버가 `Access-Control-Allow-Origin` CORS 헤더를 적절히 응답해야 한다.
   - B. 모든 스크립트 파일이 `.txt` 확장자로 저장되어 있어야 한다.
   - C. `output: 'export'` 정적 배포 모드에서만 사용해야 한다.
   - D. Next.js의 Edge Runtime이 서버에 설치되어 있어야 한다.

<details><summary>정답 보기</summary>

정답: **A**
해설: 브라우저가 CORS 모드로 스크립트를 가져올 때 리소스 제공 서버에서 유효한 `Access-Control-Allow-Origin` 헤더를 반환하지 않으면 브라우저가 스크립트의 로딩 및 실행을 차단한다.
</details>

## 챕터 요약

- `crossOrigin`은 Next.js가 주입하는 `<script>` 태그와 `next/script` 요소의 CORS 요청 모드를 결정한다.
- `'anonymous'`는 자격 증명 없이 스크립트를 로드하며 CDN 환경에서 널리 활용되는 기본 권장 값이다.
- `'use-credentials'`는 교차 출처 요청 시 쿠키와 인증 헤더를 포함하여 전송해야 하는 특수 환경에서 사용한다.
- 교차 도메인 스크립트에서 발생하는 에러를 `"Script error."`로 마스킹하지 않고 상세 스택을 수집하려면 이 설정이 필수다.
- 이 옵션을 활성화할 때는 자산을 호스팅하는 CDN/스토리지 서버에 CORS 응답 헤더가 올바르게 구성되어 있어야 한다.
