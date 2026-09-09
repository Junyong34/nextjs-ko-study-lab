# appDir

- 공식 문서: [appDir](https://nextjs.org/docs/app/api-reference/config/next-config-js/appDir)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `appDir`가 legacy API라는 사실과 현재 Next.js에서 지원하는 범위를 이해한다.
- `app` directory에서 App Router의 layouts, Server Components, streaming, colocated data fetching이 어떻게 가능해지는지 파악한다.
- `app` directory를 사용하면 React Strict Mode가 자동으로 활성화된다는 점을 설명할 수 있다.

## 핵심 개념 및 설명

> **Legacy API**: 이 API는 더 이상 권장하지 않는다. backward compatibility를 위해 계속 지원한다.

> **알아두면 좋은 점**: Next.js 13.4에서 App Router가 stable이 되면서 이 옵션은 더 이상 필요하지 않다.

App Router의 [`app` directory](https://nextjs.org/docs/app)는 [layouts](../../3.1-file-conventions/layout.md), [Server Components](../../../1-getting-started/server-and-client-components.md), [streaming](../../3.1-file-conventions/loading.md), [colocated data fetching](../../../1-getting-started/fetching-data.md)을 지원한다.

`app` directory를 사용하면 [React Strict Mode](https://react.dev/reference/react/StrictMode)가 자동으로 활성화된다. Pages Router에서 App Router로 점진적으로 옮기는 방법은 [incrementally adopt `app`](../../../2-guides/2.63-migrating/app-router-migration.md#migrating-from-pages-to-app)에서 확인한다.

## 예제 및 데모 설계

- 데모 가능 여부: 검토 예정
- 현재는 App Router가 stable이므로 `appDir`을 켜고 끄는 설정만으로 이 옵션의 효과를 분리해 관찰하기 어렵다.
- 데모를 만든다면 legacy 프로젝트에서 `appDir` 설정과 `app` directory를 함께 사용하는 최소 예제를 구성하고 layouts와 Server Components가 동작하는 결과를 확인한다.
- 실습 결과를 현재 권장 설정으로 오해하지 않도록 `appDir`이 Next.js 13.4부터 더 이상 필요하지 않다는 안내를 화면에 함께 표시한다.

## 연습 문제

1. `appDir`에 대한 설명으로 올바른 것은 무엇인가?
   - A. Next.js 13.4부터 App Router를 활성화하려면 반드시 설정해야 한다.
   - B. 현재는 더 이상 필요하지 않지만 backward compatibility를 위해 지원하는 legacy API다.
   - C. Pages Router에서만 layouts를 활성화한다.
   - D. `app` directory와 무관하게 Route Handler만 활성화한다.

<details><summary>정답 보기</summary>

정답: **B**<br>
해설: App Router가 stable이 된 Next.js 13.4부터 `appDir`은 더 이상 필요하지 않으며 backward compatibility를 위해 지원한다.
</details>

2. `app` directory를 사용하면 자동으로 활성화되는 것은 무엇인가?
   - A. React Strict Mode
   - B. `allowedDevOrigins`
   - C. `NEXT_ADAPTER_PATH`
   - D. `experimental.authInterrupts`

<details><summary>정답 보기</summary>

정답: **A**<br>
해설: 공식 문서는 `app` directory를 사용하면 React Strict Mode가 자동으로 활성화된다고 설명한다.
</details>

## 챕터 요약

- `appDir`은 legacy API이며 backward compatibility를 위해 계속 지원한다.
- Next.js 13.4부터 App Router가 stable이 되어 `appDir`은 더 이상 필요하지 않다.
- `app` directory는 layouts, Server Components, streaming, colocated data fetching을 지원한다.
- `app` directory를 사용하면 React Strict Mode가 자동으로 활성화된다.
- 현재 프로젝트를 새로 구성할 때는 `appDir`을 필수 활성화 플래그로 취급하지 않는다.
