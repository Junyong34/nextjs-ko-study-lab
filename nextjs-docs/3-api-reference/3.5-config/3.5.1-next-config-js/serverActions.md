# serverActions

- 공식 문서: [serverActions](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Server Action의 보안 보호 체계와 CSRF 방지를 위한 `allowedOrigins` 설정 방식을 이해한다.
- Server Action 요청 본문 크기를 제한하는 `bodySizeLimit` 옵션의 적용 범위와 단위 규격을 파악한다.
- 리버스 프록시, 호스트 헤더 전달, 로컬 개발 터널 환경에서 도메인 화이트리스트를 올바르게 구성하는 기법을 설명할 수 있다.

## 핵심 개념 및 설명

`serverActions`는 Next.js 애플리케이션에서 Server Action을 호출할 때 적용되는 보안 정책(도메인 검증)과 HTTP 요청 본문 크기(payload ceiling) 한도를 구성하는 옵션이다.

Next.js는 CSRF(Cross-Site Request Forgery) 공격을 방지하기 위해 Server Action 호출 시 유입되는 `Origin` 헤더를 검증한다. 또한 대용량 파일 전송이나 의도적인 자원 고갈 공격(DoS)을 막고자 요청 페이로드의 최대 크기를 제어한다. 이 설정은 `experimental.serverActions` 객체 하위에서 구성한다.

### 기본 설정 구조

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
```

| 옵션 키 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `allowedOrigins` | `string[]` | `[]` (동일 출처만 허용) | Server Action 호출을 허용할 신뢰할 수 있는 도메인 호스트 목록. |
| `bodySizeLimit` | `number \| string` | `'1mb'` | Server Action 요청 본문의 최대 허용 바이트 크기. |

### allowedOrigins

`allowedOrigins`는 Server Action 호출을 허용할 추가 도메인(오리진) 목록을 지정한다.

Next.js는 Server Action 요청을 받으면 HTTP `Origin` 헤더를 확인해 `x-forwarded-host` 헤더(리버스 프록시 환경)나 `host` 헤더와 비교한다. 두 값이 일치하지 않고 `allowedOrigins`에도 등록되어 있지 않으면 CSRF 공격 시도로 간주해 `403 Forbidden` 에러를 반환하고 요청을 차단한다.

> **알아두면 좋은 점**:
>
> - `Origin` 헤더 자체가 없는 요청이면 Next.js는 즉시 차단하지 않고 터미널에 경고 로그를 출력한다.
> - `allowedOrigins` 검증은 개발 환경뿐만 아니라 **프로덕션 환경에서도 항상 실행된다**.

#### 도메인 매칭 규칙

`allowedOrigins` 목록에 지정하는 도메인은 호스트 이름과 선택적 포트 번호로 구성된다:

- `*`: 단일 호스트 레이블을 매칭한다 (예: `*.example.com`).
- `**`: 패턴 시작 위치에서 하나 이상의 호스트 레이블을 매칭한다 (예: `**.example.com`).
- 포트 번호에는 와일드카드를 적용할 수 없다 (`my-proxy.com:8443` 또는 `*.my-proxy.com:8443`처럼 명시해야 한다).
- 부분 와일드카드(예: `app-*.example.com`)는 지원하지 않는다.

| 항목 | 일치하는 호스트 | 일치하지 않는 호스트 |
|---|---|---|
| `my-proxy.com` | `my-proxy.com` | `my-proxy.com:8443`, `app.my-proxy.com` |
| `*.my-proxy.com` | `app.my-proxy.com` | `my-proxy.com`, `app.my-proxy.com:8443` |
| `**.my-proxy.com` | `app.my-proxy.com`, `app.eu.my-proxy.com` | `my-proxy.com` |
| `my-proxy.com:8443` | `my-proxy.com:8443` | `my-proxy.com` |

#### 리버스 프록시 및 개발 터널 환경

1. **리버스 프록시(Reverse Proxy)**: Nginx, Cloudflare 등의 프록시가 실제 사용자가 접속한 공개 호스트를 `x-forwarded-host` 헤더로 애플리케이션에 올바르게 전달하지 못하면 내부 호스트(`localhost:3000` 등)와 브라우저 `Origin` 헤더가 달라 차단된다. 프록시 설정을 교정하거나 외부 접속 도메인을 `allowedOrigins`에 등록해야 한다.
2. **개발 터널(Dev Tunnels, 예: ngrok, Cloudflare Tunnel)**: 개발 서버를 외부 터널로 노출해 테스트한다면 정적 자산 로딩용 `allowedDevOrigins`와 Server Action 호출용 `serverActions.allowedOrigins` 양쪽에 해당 터널 도메인을 명시해야 한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.tunnel.example.com'],
  experimental: {
    serverActions: {
      allowedOrigins: ['*.tunnel.example.com'],
    },
  },
}

export default nextConfig
```

### bodySizeLimit

`bodySizeLimit`는 Server Action에 전달되는 HTTP 요청 본문의 최대 크기를 지정한다:

- 기본값은 `'1mb'`다.
- 바이트 단위의 숫자(`1000000`) 또는 `bytes` 패키지가 지원하는 문자열 표기(`'500kb'`, `'2mb'`, `'10mb'`)를 입력할 수 있다.
- 파일 업로드 등 `multipart/form-data` 요청을 처리할 때 이 제한을 초과하면 Next.js는 `413 Payload Too Large` 상태 코드를 반환하고 요청 처리를 즉시 중단한다.

> **알아두면 좋은 점**:
>
> - `bodySizeLimit`는 순수 파일 데이터뿐만 아니라 멀티파트 경계선(boundary)과 폼 필드 헤더를 포함한 원시(raw) HTTP 요청 본문 전체 바이트에 적용된다. 따라서 대용량 파일 업로드를 허용할 때는 실제 기대 파일 크기보다 10~20KB 이상 여유 버퍼를 두기를 권장한다.

### Enabling Server Actions (v13)

과거 Next.js 13 버전에서는 Server Action이 실험적 기능이었으므로 `experimental.serverActions: true` 설정을 명시해야 사용할 수 있었다.

Next.js 14 이후부터는 Server Action이 정식 안정화되어 별도의 활성화 플래그 없이 기본값으로 즉시 사용할 수 있다. `experimental.serverActions` 객체는 오직 `allowedOrigins`와 `bodySizeLimit` 같은 세부 보안/페이로드 설정을 지정할 때만 사용한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (대용량 파일 업로드 시 413 페이로드 에러 또는 불일치 Origin에 대한 차단 동작 관찰 가능)
- 본문 크기 초과(413) 테스트: `bodySizeLimit: '500kb'`로 설정한 뒤 1MB 파일을 첨부해 Server Action으로 전송했을 때 브라우저 개발자 도구 네트워크 탭에서 413 Payload Too Large 응답이 반환되는지 확인한다.
- CSRF Origin 차단 테스트: 로컬 프록시 도구로 Server Action 요청의 `Origin` 헤더를 임의의 외부 도메인(`http://unauthorized-domain.com`)으로 변조해 전송했을 때 서버가 403 Forbidden 응답으로 요청을 거부하는지 확인한다.
- 화이트리스트 등록 검증: `allowedOrigins`에 테스트용 서브도메인을 등록한 뒤 해당 도메인에서 보낸 Server Action 요청이 성공적으로 처리되는지 확인한다.

## 연습 문제

1. Server Action을 호출할 때 발생할 수 있는 보안 이슈를 방지하기 위해 Next.js가 기본으로 제공하는 방어 기제와 `allowedOrigins`의 역할로 옳은 것은?
   - A. 클라이언트의 IP 주소를 추적하여 동일 IP에서 온 요청만 통과시킨다.
   - B. 요청의 `Origin` 헤더를 검증하여 CSRF 공격을 방지하며, 신뢰할 수 있는 교차 도메인을 `allowedOrigins`로 명시한다.
   - C. SQL 인젝션을 방지하기 위해 모든 전달 인자를 HTML 이스케이프 처리한다.
   - D. `Origin` 헤더가 없는 요청은 즉시 서버 프로세스를 강제 종료한다.

<details><summary>정답 보기</summary>

정답: **B**
해설: Next.js는 Server Action 요청 시 `Origin` 헤더와 호스트 헤더를 비교해 CSRF를 차단한다. 리버스 프록시나 외부 도메인에서 정당하게 호출해야 하면 `allowedOrigins`에 등록해 요청을 허용한다.
</details>

2. `serverActions.bodySizeLimit` 옵션에 대한 설명 중 틀린 것은?
   - A. 기본 설정값은 `'1mb'`다.
   - B. 허용 크기를 초과한 요청이 발생하면 HTTP `413 Payload Too Large` 에러가 반환된다.
   - C. 숫자 바이트 크기뿐만 아니라 `'2mb'`, `'500kb'` 형태의 문자열 표기도 지원한다.
   - D. 멀티파트 폼 데이터 요청 시 파일 순수 바이너리 크기만 계산하므로 헤더나 경계선 오버헤드는 한도에 전혀 포함되지 않는다.

<details><summary>정답 보기</summary>

정답: **D**
해설: `bodySizeLimit`는 HTTP 원시 요청 본문의 전체 바이트를 기준으로 검증하므로 멀티파트 경계선 및 폼 헤더 오버헤드도 크기 계산에 포함된다.
</details>

## 챕터 요약

- `serverActions` 설정은 Server Action의 CSRF 방어용 도메인 화이트리스트와 요청 본문 크기 제한을 제어한다.
- `allowedOrigins`에 허용할 도메인을 등록하면 리버스 프록시나 외부 서브도메인에서 들어오는 합법적인 요청을 통과시킬 수 있다.
- 도메인 패턴에서 `*`와 `**` 와일드카드를 지원하며 프로덕션 환경에서도 오리진 검증을 항상 엄격하게 수행한다.
- `bodySizeLimit`의 기본값은 `'1mb'`다. 한도를 초과하면 즉시 `413 Payload Too Large`를 반환해 DoS 공격과 서버 과부하를 막는다.
- Next.js 14 이후부터 Server Action 자체는 기본 활성화되어 있으므로 추가 세부 설정이 필요할 때만 이 옵션을 선언한다.
