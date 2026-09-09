# supportsImmutableAssets

- 공식 문서: [supportsImmutableAssets](https://nextjs.org/docs/app/api-reference/config/next-config-js/supportsImmutableAssets)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `skew protection`이 활성화된 환경에서 정적 자산 요청에 배포별 query parameter가 붙는 이유를 이해한다.
- `immutable static assets` 덕분에 브라우저가 자산을 무기한 캐시하고 다음 배포에서 변경되지 않은 파일은 업로드를 건너뛰는 원리를 익힌다.
- `supportsImmutableAssets`를 adapter 지원 여부에 맞춰 설정하는 방법과 잘못 활성화했을 때 생기는 배포 위험을 설명할 수 있다.

## 핵심 개념 및 설명

> **주의**: 이 옵션은 주로 [adapter](../../3.7-adapters/README.md) 작성자를 위한 기능이다. 애플리케이션 개발자라면 adapter 문제를 조사할 때만 이 옵션을 설정하기를 권장한다.
>
> **provider 또는 adapter가 이 기능을 지원하지 않는데 활성화하면 배포가 망가질 수 있다.**

`skew protection`을 활성화하면 정적 자산 요청에 배포별 query parameter가 포함된다. 예를 들면 다음과 같다.

```plain
GET https://foo.com/_next/static/chunks/0d_ks0ow7ur6m.js?dpl=<unique-deployment-id>
```

다만 자산 내용이 바뀌지 않았어도 새 배포가 있을 때마다 브라우저가 정적 자산을 다시 내려받아야 한다는 단점이 있다.

`immutable static assets`를 사용하면 파일 이름으로 콘텐츠를 식별할 수 있고 변경되지 않는다고 보장되는 정적 자산에서 `?dpl` query parameter를 생략할 수 있다. 그러면 브라우저가 해당 자산을 무기한 캐시할 수 있다. 이후 배포에서 변경되지 않은 정적 자산을 업로드 대상에서 건너뛸 수도 있다.

```plain
GET https://foo.com/_next/static/immutable/chunks/0d_ks0ow7ur6m.js
```

adapter가 `immutable static assets` 지원을 활성화한 경우 이 설정 옵션으로 해당 동작을 사용하지 않도록 선택할 수 있다. adapter가 이 기능을 활성화하지 않았다면 이 옵션은 아무 효과가 없다.

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  supportsImmutableAssets: false,
}

module.exports = nextConfig
```

adapter에서 이 기능을 지원하는 방법은 [Supporting immutable static assets](../../3.7-adapters/immutable-static-assets.md)에서 확인한다.

### 버전 기록 (Version History)

| 버전 | 변경 사항 |
|---|---|
| `v16.3.0` | immutable static asset 지원이 추가됐다. |

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- 이 옵션은 adapter와 배포 provider의 지원 여부, 그리고 배포 과정에 달려 있으므로 일반적인 브라우저 화면만으로는 효과를 분리해 확인하기 어렵다.
- 별도 adapter 검증 환경에서 `?dpl` query parameter가 붙은 요청과 `_next/static/immutable/` 경로의 요청을 비교하고 후속 배포에서 변경되지 않은 파일의 업로드를 실제로 건너뛰는지 배포 로그로 확인한다.

## 연습 문제

1. `supportsImmutableAssets`에 대한 설명으로 올바른 것은 무엇인가?
   - A. 모든 애플리케이션에서 정적 자산의 파일 이름을 무작위로 바꾼다.
   - B. adapter가 지원을 활성화한 경우 immutable static assets를 사용하지 않도록 선택한다.
   - C. `skew protection`을 항상 활성화한다.
   - D. 브라우저의 JavaScript 캐시를 요청마다 삭제한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: adapter가 immutable static assets를 지원할 때 `supportsImmutableAssets: false`로 해당 동작을 사용하지 않도록 선택할 수 있다.
</details>

2. adapter가 immutable static assets 지원을 활성화하지 않은 상태에서 `supportsImmutableAssets`를 설정하면 어떻게 되는가?
   - A. 설정이 아무 효과를 내지 않는다.
   - B. 모든 자산이 자동으로 영구 삭제된다.
   - C. `next.config.js`가 브라우저 번들에 포함된다.
   - D. `?dpl` query parameter가 모든 URL에서 제거된다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: adapter가 기능을 활성화하지 않았다면 `supportsImmutableAssets` 옵션은 아무 효과가 없다.
</details>

3. immutable static assets를 사용했을 때 기대할 수 있는 동작은 무엇인가?
   - A. 브라우저가 자산을 무기한 캐시하고, 변경되지 않은 자산은 후속 배포에서 업로드를 건너뛸 수 있다.
   - B. 자산이 배포될 때마다 반드시 다시 다운로드된다.
   - C. 파일 이름과 콘텐츠의 관계가 사라진다.
   - D. 모든 요청에 새로운 `?dpl` query parameter가 추가된다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: immutable static assets는 파일 이름으로 콘텐츠를 식별할 수 있어 브라우저가 자산을 장기간 캐시하고 변경되지 않은 파일은 업로드를 생략할 수 있다.
</details>

## 챕터 요약

- `skew protection`이 활성화되면 정적 자산 요청에 배포별 `?dpl` query parameter가 포함될 수 있다.
- `immutable static assets`는 파일 이름으로 콘텐츠를 식별할 수 있고 변경되지 않는다고 보장되는 자산이다.
- immutable static assets를 사용하면 브라우저가 자산을 무기한 캐시하고 후속 배포에서 변경되지 않은 파일을 건너뛸 수 있다.
- `supportsImmutableAssets`는 adapter가 지원을 활성화했을 때만 의미가 있으며, 지원하지 않는 환경에서는 효과가 없다.
- provider 또는 adapter가 지원하지 않는데 기능을 활성화하면 배포가 망가질 수 있으므로 adapter 작성자 중심으로 사용한다.
