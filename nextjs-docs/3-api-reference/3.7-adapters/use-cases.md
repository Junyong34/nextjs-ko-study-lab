# Use Cases

- 공식 문서: [Use Cases](https://nextjs.org/docs/app/api-reference/adapters/use-cases)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 배포 어댑터가 실제로 어떤 문제를 해결하기 위해 만들어지는지 대표 유스케이스로 파악한다.
- [`API Reference`](./api-reference.md)에서 다룬 `modifyConfig`, `onBuildComplete` 훅이 각 유스케이스와 어떻게 연결되는지 연결지어 이해한다.

## 핵심 개념 및 설명

어댑터의 대표적인 유스케이스는 다음과 같다.

- **배포 플랫폼 통합(Deployment Platform Integration)**: 특정 호스팅 플랫폼에 맞춰 빌드 출력을 자동으로 구성한다.
- **에셋 처리(Asset Processing)**: 빌드 출력을 변환하거나 최적화한다.
- **모니터링 통합(Monitoring Integration)**: 빌드 메트릭과 라우트 정보를 수집한다.
- **커스텀 번들링(Custom Bundling)**: 플랫폼 전용 형식으로 출력을 패키징한다.
- **빌드 검증(Build Validation)**: 출력이 특정 요구 사항을 충족하는지 확인한다.
- **라우트 생성(Route Generation)**: 처리된 라우트 정보를 사용해 플랫폼 전용 라우팅 설정을 생성한다.

> **알아두면 좋은 점**: 위 유스케이스들은 대부분 [`API Reference`](./api-reference.md)의 `onBuildComplete`가 전달하는 `context.routing`, `context.outputs` 정보를 소비하거나, `modifyConfig`로 빌드 전에 설정을 조정하는 형태로 구현된다.

## 예제 및 데모 설계

- 데모 가능 여부: 검토 예정
- Phase 1에서는 구현 예정으로 남긴다. Phase 2에서 최소 어댑터로 빌드 검증(Build Validation) 유스케이스를 구현해 `onBuildComplete`에서 특정 출력 타입이 누락되면 빌드를 실패시키는 실습을 설계한다.

## 연습 문제

1. 어댑터의 유스케이스로 공식 문서가 제시하지 않는 것은?
   - A. 모니터링 통합(Monitoring Integration)
   - B. 데이터베이스 스키마 마이그레이션
   - C. 라우트 생성(Route Generation)

<details><summary>정답 보기</summary>

정답: B. 공식 문서가 제시하는 유스케이스는 배포 플랫폼 통합, 에셋 처리, 모니터링 통합, 커스텀 번들링, 빌드 검증, 라우트 생성 여섯 가지이며 데이터베이스 스키마 마이그레이션은 포함되지 않는다.
</details>

## 챕터 요약

- 어댑터의 대표 유스케이스는 배포 플랫폼 통합, 에셋 처리, 모니터링 통합, 커스텀 번들링, 빌드 검증, 라우트 생성 여섯 가지다.
- 대부분의 유스케이스는 `onBuildComplete`가 전달하는 라우팅·출력 정보를 소비하거나 `modifyConfig`로 빌드 설정을 조정하는 방식으로 구현된다.
- 이 문서는 어댑터가 "무엇을 위해" 쓰이는지를 개괄하며, 구체적인 구현 방법은 [Creating an Adapter](./creating-an-adapter.md)와 관련 레퍼런스 문서에서 다룬다.

---

> 이미지 검증: 브라우저 확장 미연결로 wigolo fetch(images: []) 기준 판단.
