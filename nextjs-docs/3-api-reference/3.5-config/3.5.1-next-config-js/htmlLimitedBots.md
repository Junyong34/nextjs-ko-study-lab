# htmlLimitedBots

- 공식 문서: [htmlLimitedBots](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `htmlLimitedBots`가 user agent에 따라 `blocking metadata`와 `streaming metadata`를 나누는 방식을 이해한다.
- Next.js의 기본 HTML limited bot 목록과, 사용자가 직접 지정하면 기본 목록을 덮어쓰는 동작을 파악한다.
- `/.*/` 정규식으로 `streaming metadata`를 완전히 비활성화하는 방법을 익힌다.
- `htmlLimitedBots`가 도입된 버전을 확인한다.

## 핵심 개념 및 설명

`htmlLimitedBots`는 지정한 user agent 목록에 `streaming metadata` 대신 `blocking metadata`를 전달하도록 설정하는 옵션이다.

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const config: NextConfig = {
  htmlLimitedBots: /MySpecialBot|MyAnotherSpecialBot|SimpleCrawler/,
}

export default config
```

```js filename="next.config.js" switcher
module.exports = {
  htmlLimitedBots: /MySpecialBot|MyAnotherSpecialBot|SimpleCrawler/,
}
```

### 기본 목록 (Default list)

Next.js가 기본으로 담고 있는 HTML limited bot 목록은 다음과 같다.

- Google 크롤러(예: Mediapartners-Google, AdsBot-Google, Google-PageRenderer)
- Bingbot
- Twitterbot
- Slackbot

전체 목록은 [여기](https://github.com/vercel/next.js/blob/canary/packages/next/src/shared/lib/router/utils/html-bots.ts)에서 확인한다.

`htmlLimitedBots`를 설정하면 Next.js의 기본 목록을 덮어쓴다. 덮어쓰기는 고급 설정에 해당하며 대부분은 기본 목록으로 충분하다.

기본 목록을 덮어쓰는 설정은 다음과 같다.

```ts filename="next.config.ts" switcher
const config: NextConfig = {
  htmlLimitedBots: /MySpecialBot|MyAnotherSpecialBot|SimpleCrawler/,
}

export default config
```

```js filename="next.config.js" switcher
module.exports = {
  htmlLimitedBots: /MySpecialBot|MyAnotherSpecialBot|SimpleCrawler/,
}
```

### 비활성화 (Disabling)

`streaming metadata`를 완전히 비활성화하려면 모든 user agent와 일치하는 `/.*/`을 설정한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const config: NextConfig = {
  htmlLimitedBots: /.*/,
}

export default config
```

```js filename="next.config.js" switcher
module.exports = {
  htmlLimitedBots: /.*/,
}
```

### 버전 기록 (Version History)

| 버전 | 변경 사항 |
|---|---|
| `15.2.0` | `htmlLimitedBots` 옵션을 도입했다. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (브라우저의 User-Agent를 바꾸어 메타데이터 전달 방식을 비교할 수 있다)
- 기본 설정을 사용한 페이지와 `htmlLimitedBots: /.*/`을 적용한 페이지를 준비한다.
- 브라우저 DevTools의 User-Agent 재정의 기능으로 지정한 bot 문자열을 보내고, HTML 응답에 메타데이터가 실리는 시점을 비교한다.
- 기본 목록에 없는 user agent를 직접 설정에 추가했을 때 `streaming metadata` 대신 `blocking metadata`를 받는지 확인한다.

## 연습 문제

1. `htmlLimitedBots`를 설정했을 때의 동작으로 올바른 것은 무엇인가?
   - A. 기본 목록에 값을 추가해 기존 항목과 항상 합친다.
   - B. Next.js의 기본 목록을 덮어쓰며 대부분의 경우 기본 목록이면 충분하다.
   - C. 모든 user agent의 요청을 차단한다.
   - D. 정적 자산의 캐시 시간을 변경한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `htmlLimitedBots`를 지정하면 Next.js의 기본 목록을 덮어쓴다. 공식 문서는 이 동작을 고급 설정으로 설명하며 대부분의 경우 기본 목록으로 충분하다고 안내한다.
</details>

2. `streaming metadata`를 완전히 비활성화하려면 어떤 값을 사용해야 하는가?
   - A. `htmlLimitedBots: []`
   - B. `htmlLimitedBots: /.*/`
   - C. `htmlLimitedBots: false`
   - D. `htmlLimitedBots: /none/`

<details><summary>정답 보기</summary>

정답: **B**  
해설: `/.*/`은 모든 user agent와 일치하므로 모든 대상에 `blocking metadata`를 전달하고 `streaming metadata`를 완전히 비활성화한다.
</details>

## 챕터 요약

- `htmlLimitedBots`는 지정한 user agent에 `streaming metadata` 대신 `blocking metadata`를 전달한다.
- 기본 목록에는 Google 크롤러, Bingbot, Twitterbot, Slackbot 등이 들어 있다.
- 사용자 설정을 지정하면 Next.js의 기본 목록을 덮어쓰므로 대부분은 기본 목록을 그대로 쓰는 편이 낫다.
- `htmlLimitedBots: /.*/`은 모든 user agent와 일치해 `streaming metadata`를 완전히 비활성화한다.
- 이 옵션은 Next.js `15.2.0`에서 도입됐다.
