# useOffline

- 공식 문서: [useOffline](https://nextjs.org/docs/app/api-reference/config/next-config-js/useOffline)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Experimental**: 이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 남길 수 있다.

## 학습 목표

- `experimental.useOffline`이 브라우저 연결 상태를 감지하는 방식을 이해한다.
- 오프라인에서 navigation, `prefetch`, Server Action 요청을 보류하고 자동으로 재시도하는 흐름을 파악한다.
- `HEAD` 연결 상태 확인과 단계형 backoff의 조건과 수치를 설명할 수 있다.
- Client Component에서 [`useOffline`](../../3.3-functions/use-offline.md) 훅을 사용해 연결 상태를 화면에 표시하는 방법을 익힌다.

## 핵심 개념 및 설명

`useOffline` 설정 옵션은 오프라인 연결 상태를 감지해 실패한 navigation, `prefetch`, Server Action 요청을 자동으로 재시도한다. 옵션을 켜면 Client Component에서 현재 오프라인 상태를 읽는 [`useOffline`](../../3.3-functions/use-offline.md) 훅도 사용할 수 있다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useOffline: true,
  },
}

export default nextConfig
```

활성화하면 Next.js는 이렇게 동작한다.

- 브라우저의 [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event)과 [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) 이벤트를 수신해 연결 상태를 추적한다.
- navigation, `prefetch`, Server Action 요청에서 네트워크 실패를 감지한다.
- 오프라인인 동안 backoff를 적용한 [`HEAD`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/HEAD) 요청으로 연결 상태를 확인한다.
- 연결이 복구되면 차단된 요청을 자동으로 재시도한다.
- `next/offline`에서 `useOffline` 훅을 사용할 수 있게 한다.

### 재시도 작동 방식

오프라인 상태로 들어가는 경로는 두 가지다.

- **Browser event**: Next.js는 `window.addEventListener('offline', ...)` 리스너를 등록한다. 운영체제가 네트워크 인터페이스를 사용할 수 없다고 보고하면 오프라인 상태로 즉시 전환한다.
- **Failed fetch**: navigation, `prefetch`, Server Action 요청의 `fetch()`가 abort나 timeout이 아닌 오류로 reject되면 offline 모듈을 호출한다. 브라우저가 `navigator.onLine === true`로 보고하더라도 captive portal, 잘못된 DNS, 응답하지 않는 upstream 때문에 실제 요청이 origin에 도달하지 못하는 상황을 처리한다.

오프라인 상태가 되면 폴링 루프가 연결이 복구되었는지 확인한다.

#### 연결 상태 확인

각 확인은 현재 페이지 URL로 `HEAD` 요청을 한 번 보낸다. 요청에는 RSC header를 설정하고 navigation과 같은 endpoint를 쓴다. 요청은 200 ms 뒤에 abort한다.

다음 두 경우를 `online`으로 판단한다.

1. fetch가 정상적으로 resolve된다.
2. 200 ms timeout으로 요청이 abort된다. 완전히 오프라인인 요청은 DNS 또는 TCP 오류로 거의 즉시 실패한다. 따라서 200 ms까지 pending 상태라면 TCP handshake가 성공했고 서버에 연결할 수 있다고 판단한다.

그 밖의 reject가 발생하면 다음 확인을 예약한다. 오프라인 상태에서 framework fetch(navigation, `prefetch`, Server Action)가 성공해도 상태를 다시 online으로 바꾼다.

#### Backoff

확인 사이의 지연은 exponential 방식이 아니라 단계형으로 늘어나며 최대 3 seconds로 제한한다.

| 시도 | 다음 확인 전 지연 |
| --- | --- |
| 1 | 500 ms |
| 2 | 1 s |
| 3 | 2 s |
| 4회 이후 | 3 s |

브라우저의 `online` 이벤트가 현재 대기를 중단하고 즉시 연결 상태 확인을 실행한다. 다음 예약 시점을 기다리지 않고 재연결을 감지한다.

#### 중단하지 않는 폴링

폴링 루프는 스스로 중단하지 않는다. 확인이 성공하거나 페이지가 unload될 때까지 3 seconds 제한으로 계속 실행한다. 기기가 몇 시간 동안 오프라인이었다가 연결을 회복해도 폴링 루프가 정상적으로 재개되고 종료된다.

#### Framework 요청 재시도

오프라인 상태인 동안 navigation, `prefetch`, Server Action은 다음 연결 상태 확인이 성공할 때까지 기다린다. 연결이 끊길 때 새로 발생한 요청과 이미 실행 중이던 요청에 모두 적용된다.

확인이 성공하면 요청을 한 번 실행하며 추가 backoff는 적용하지 않는다. 요청이 네트워크 오류로 실패하면 앱은 다시 오프라인 상태가 되고 폴링 루프를 다시 시작한다.

#### 재연결 시 트래픽

단일 클라이언트가 origin에 갑자기 많은 요청을 보내는 방식으로 동작하지 않는다.

- 클라이언트가 오프라인인 동안 실패한 `fetch()`는 브라우저의 네트워크 계층에서 로컬로 reject된다. 요청은 origin에 도달하지 않는다.
- 폴링 루프는 한 번에 `HEAD` 요청 하나만 보내며 지연은 3 seconds로 제한한다. 오프라인인 동안 다른 framework 요청은 origin으로 보내지 않는다.
- 연결이 복구되면 대기 중인 navigation과 Server Action은 각각 한 번 실행된다. 대기 상태로 남는 navigation 시도는 마지막 하나뿐이며 일반적인 form button은 action이 pending인 동안 비활성화된다.
- `prefetch`는 한꺼번에 실행하지 않고 [기존 prefetch queue](../../../2-guides/prefetching.md)를 사용한다.

실제로 이 기능이 서버에 요청을 몰리게 할 가능성은 낮다. 오프라인 사용자마다 추가로 발생하는 트래픽은 연결이 복구되면 중단되는 HEAD polling뿐이다. 장애가 없을 때와 비교하면 `prefetch`, Server Action, navigation의 실행 횟수는 같고 실행 시점만 늦어진다.

### 버전 기록

| 버전 | 변경 사항 |
| --- | --- |
| `v16.x.0` | `experimental.useOffline` 설정 옵션을 도입했다. |

관련 문서로 [`useOffline` 훅](../../3.3-functions/use-offline.md)과 [PWAs](../../../2-guides/progressive-web-apps.md)를 함께 확인한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `experimental.useOffline`을 켠 뒤 브라우저 개발자 도구에서 네트워크를 `Offline`으로 전환한다. navigation 또는 `prefetch`를 실행해 연결 상태 안내와 대기 상태를 확인한다.
- 오프라인 상태에서 Server Action을 호출하고 네트워크를 `Online`으로 되돌린다. 연결 상태 확인이 끝난 뒤 요청이 한 번 재시도되는지 확인한다.
- 네트워크 요청 로그에서 오프라인 동안 `HEAD` polling이 실행되고 연결 복구 후 중단되는지 관찰한다.

## 연습 문제

1. `experimental.useOffline`을 활성화했을 때 Next.js가 자동으로 처리하는 요청 조합은 무엇인가?
   - A. navigation, `prefetch`, Server Action 요청
   - B. 이미지 최적화 요청만
   - C. CSS Module import만
   - D. 브라우저의 모든 외부 fetch 요청

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: 이 옵션은 navigation, `prefetch`, Server Action 요청의 네트워크 실패를 감지하고 연결 복구 후 재시도한다.
</details>

2. 오프라인 상태에서 `online`으로 판단하는 연결 상태 확인 결과는 무엇인가?
   - A. 응답 상태가 반드시 `200`인 경우만
   - B. fetch가 정상적으로 resolve되거나 200 ms timeout으로 요청이 abort된 경우
   - C. 브라우저가 `navigator.onLine === false`를 반환하는 경우
   - D. `HEAD` 요청이 3 seconds 이상 pending인 경우만

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: fetch의 정상 resolve와 200 ms timeout에 따른 abort를 모두 연결 가능한 상태로 처리한다.
</details>

3. 연결이 복구될 때 `prefetch` 요청은 어떻게 처리되는가?
   - A. 대기 중인 요청을 모두 동시에 실행한다.
   - B. 기존 prefetch queue를 사용한다.
   - C. 모든 `prefetch`를 취소하고 다시 예약하지 않는다.
   - D. 3초마다 origin에 요청을 무제한으로 보낸다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: `prefetch`는 기존 prefetch queue를 사용하므로 재연결 순간에 모두 동시에 실행하지 않는다.
</details>

## 챕터 요약

- `experimental.useOffline`은 연결 상태를 감지하고 navigation, `prefetch`, Server Action 요청을 자동으로 재시도한다.
- 오프라인 상태는 브라우저 이벤트로도, 실패한 `fetch()`로도 시작될 수 있다.
- 연결 상태 확인은 RSC header를 포함한 `HEAD` 요청을 사용하며 200 ms timeout도 `online`으로 처리한다.
- 확인 사이의 지연은 500 ms, 1 s, 2 s, 3 s로 늘어나고 3 seconds에서 제한된다.
- 오프라인 polling은 연결이 복구되거나 페이지가 unload될 때까지 계속되며 재연결 후 요청은 기존 큐와 대기 흐름에 따라 실행된다.
