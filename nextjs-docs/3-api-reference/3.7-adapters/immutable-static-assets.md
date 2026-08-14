# Supporting Immutable Static Assets

- 공식 문서: [Supporting Immutable Static Assets](https://nextjs.org/docs/app/api-reference/adapters/immutable-static-assets)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `config.supportsImmutableAssets`가 켜졌을 때 정적 자산의 경로와 캐시 동작이 어떻게 달라지는지 이해한다.
- immutable 자산과 non-immutable 자산을 어댑터가 각각 어떻게 다뤄야 하는지 구분한다.
- `modifyConfig`와 `onBuildComplete`에서 어댑터가 구현해야 할 작업을 익힌다.

## 핵심 개념 및 설명

이 기능의 최종 사용자 대상 설명은 [`config.supportsImmutableAssets`](../3.5-config/3.5.1-next-config-js/supportsImmutableAssets.md)를 참고한다.

`config.supportsImmutableAssets`가 켜지면 Next.js는 immutable(불변)한 콘텐츠 주소 기반 정적 자산을 `/_next/static/immutable/*`라는 공개 경로 아래에 출력한다. 이 접두사를 이용하면 CDN 레벨에서 immutable 정적 자산과 non-immutable 정적 자산을 구분할 수 있다.

런타임에서 이 immutable 정적 자산은 `?dpl` 쿼리 매개변수 없이 요청되며, 따라서 여러 배포에 걸쳐 공유되는 네임스페이스에 존재하게 된다. 이 자산들은 (새 배포 이후에도) 변경되지 않아야 하고, 해당 자산을 사용하는 활성 배포가 남아 있는 동안에는 삭제되지 않아야 한다. Next.js는 파일명에 축약된 짧은 콘텐츠 해시를 사용할 수도 있으므로, `outputs.staticFiles[].immutableHash`에는 해시 충돌이 발생하지 않았는지 검증할 수 있는 전체 콘텐츠 해시가 담긴다.

`config.outputHashSalt`를 사용하면 콘텐츠 해시에 salt를 지정할 수 있다. 해시 충돌이 감지된 경우 등, 어떤 이유로든 해시를 회전시키고 싶을 때 사용한다.

non-immutable 정적 자산(`public` 폴더의 자산이나 이전 버전 Next.js의 자산 등, 배포 사이에 변경될 수 있는 자산)에 대한 지원은 계속 유지해야 한다는 점에 유의한다. 이런 자산은 `?dpl` 쿼리 매개변수와 함께 계속 요청된다.

### 어댑터 구현

어댑터가 해야 할 일은 다음 두 가지다.

1. `modifyConfig`에서 `config.supportsImmutableAssets` 속성을 `true`로 설정한다(사용자가 이미 `false`로 설정하지 않았다면). 이를 통해 immutable 정적 자산 배포를 지원한다는 것을 알린다.
2. `onBuildComplete`에서 `outputs.staticFiles[].immutableHash` 속성을 읽어, 어떤 정적 자산이 immutable하며 `?dpl` 쿼리 매개변수 없이 요청되어야 하는지 판단한다.

```ts
/** @type {import('next').NextAdapter} */
const adapter = {
  name: 'my-custom-adapter',

  async modifyConfig(config, { phase }) {
    if (phase === 'phase-production-build') {
      config.supportsImmutableAssets =
        // 기본값은 true이되, 사용자가 opt-out할 수 있게 한다
        config.supportsImmutableAssets ?? true

      // 필요하다면 콘텐츠 해시용 salt를 전달한다
      // config.outputHashSalt = getSaltForCurrentProject()
    }
    return config
  },

  async onBuildComplete({ outputs }) {
    for (const output of outputs.staticFiles) {
      if (output.immutableHash != null) {
        // ?dpl 쿼리 매개변수 없이도 output.pathname에서
        // 요청 가능해야 한다.
        uploadOrVerifyImmutableStaticAsset(
          output.filePath,
          output.pathname,
          output.immutableHash
        )
      } else {
        // non-immutable 정적 자산이며, 배포에 종속된
        // ?dpl 쿼리 매개변수와 함께 요청된다.
        uploadStaticAsset(output.filePath, output.pathname)
      }
    }

    // 나머지 출력을 처리한다....
  },
}
```

## 예제 및 데모 설계

- 데모 가능 여부: Phase 1에서는 구현 예정. 실제 배포 플랫폼에 자산을 업로드하는 어댑터 동작이 핵심이므로, Phase 2 커스텀 어댑터 데모에서 함께 다룬다.
- 구현 예정 시나리오: 샘플 빌드의 `outputs.staticFiles`를 순회하며 `immutableHash`가 있는 자산과 없는 자산을 나눠 출력하고, `?dpl` 쿼리 매개변수 유무 차이를 표로 정리해 보여준다.

## 연습 문제

1. `config.supportsImmutableAssets`가 켜졌을 때 immutable 정적 자산이 출력되는 공개 경로는?
   - A. `/_next/static/chunks/*`
   - B. `/_next/static/immutable/*`
   - C. `/public/immutable/*`

<details><summary>정답 보기</summary>

정답: B. immutable 콘텐츠 주소 기반 정적 자산은 `/_next/static/immutable/*` 아래에 출력되며, 이 접두사로 CDN 레벨에서 immutable/non-immutable 자산을 구분할 수 있다.
</details>

2. immutable 정적 자산과 non-immutable 정적 자산의 요청 방식 차이로 옳은 것은?
   - A. immutable 자산은 `?dpl` 쿼리 매개변수 없이 요청되고, non-immutable 자산은 `?dpl`과 함께 요청된다.
   - B. immutable 자산은 매 배포마다 `?dpl` 값이 바뀌어 요청되고, non-immutable 자산은 항상 동일한 URL로 요청된다.
   - C. 둘 다 `?dpl` 쿼리 매개변수 없이 요청된다.

<details><summary>정답 보기</summary>

정답: A. immutable 자산은 배포 간에 공유되는 네임스페이스에 존재하므로 `?dpl` 없이 요청되고, non-immutable 자산은 배포에 종속되므로 `?dpl` 쿼리 매개변수와 함께 요청된다.
</details>

## 챕터 요약

- `config.supportsImmutableAssets`를 켜면 immutable 정적 자산이 `/_next/static/immutable/*` 아래에 출력된다.
- immutable 자산은 `?dpl` 없이 요청되며 배포 간에 공유되므로, 변경·삭제하지 않아야 한다.
- `outputs.staticFiles[].immutableHash`는 파일명의 축약 해시 대신 전체 콘텐츠 해시를 제공해 해시 충돌 여부를 검증할 수 있게 한다.
- `config.outputHashSalt`로 콘텐츠 해시에 salt를 지정해 필요할 때 해시를 회전시킬 수 있다.
- 어댑터는 `modifyConfig`에서 `supportsImmutableAssets`를 켜고, `onBuildComplete`에서 `immutableHash` 유무에 따라 자산을 다르게 업로드해야 한다.
