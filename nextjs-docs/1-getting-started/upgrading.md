# Upgrading

- 공식 문서: [Upgrading](https://nextjs.org/docs/app/getting-started/upgrading)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Next.js 16.1 이상에서 공식 `next upgrade` 명령으로 안정 버전을 올릴 수 있다.
- 이전 버전과 수동 업그레이드에 맞는 명령을 선택할 수 있다.
- 안정 버전을 확인한 뒤 canary를 시험해야 하는 이유와 canary 전용 기능을 설명할 수 있다.

## 핵심 개념 및 설명

### 최신 버전

Next.js 16.1.0 이상에서는 패키지 매니저에 맞는 `upgrade` 명령을 사용한다.

```bash
pnpm next upgrade
# npm: npx next upgrade
# yarn: yarn next upgrade
# bun: bunx next upgrade
```

16.1.0 이전 버전은 이 명령을 지원하지 않으므로 별도 codemod 패키지를 사용한다.

```bash
npx @next/codemod@canary upgrade latest
```

수동으로 올리려면 Next.js, React, React DOM, Next.js ESLint 설정을 함께 최신 버전으로 설치한다.

```bash
pnpm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

### Canary 버전

canary로 올리기 전에 안정 버전을 최신으로 맞추고 애플리케이션이 정상 동작하는지 확인한다. 그다음 사용 중인 패키지 매니저로 `next@canary`를 설치한다.

```bash
pnpm add next@canary
# npm: npm i next@canary
# yarn: yarn add next@canary
# bun: bun add next@canary
```

#### Canary에서 제공하는 기능

Next.js 16.3.0 문서 기준으로 다음 인증 관련 기능은 canary에서 제공된다.

- [`forbidden`](../3-api-reference/3.3-functions/forbidden.md)
- [`unauthorized`](../3-api-reference/3.3-functions/unauthorized.md)
- [`forbidden.js`](../3-api-reference/3.1-file-conventions/forbidden.md)
- [`unauthorized.js`](../3-api-reference/3.1-file-conventions/unauthorized.md)
- [`authInterrupts`](../3-api-reference/3.5-config/3.5.1-next-config-js/authInterrupts.md)

canary는 안정 버전이 아니므로 새 기능을 시험할 명확한 이유가 있을 때 선택하고, 먼저 안정 버전에서 정상 동작하는 기준점을 확보한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 절차만 설계)
- 데모 목적: 별도 브랜치에서 안정 버전 업그레이드 전후의 빌드와 테스트 결과를 비교한다.
- 사용자가 확인할 화면과 상호작용: 의존성 diff, codemod 변경, `next build` 결과를 순서대로 확인한다.
- 관찰할 결과: 프레임워크와 React 관련 패키지가 함께 갱신되고, 마이그레이션 문제를 배포 전에 찾을 수 있다.

## 연습 문제

**Q1. (단일 선택) Next.js 16.1.0 이전 버전에서 최신 안정 버전으로 올릴 때 사용하는 명령은?**

1. `npx next upgrade`
2. `npx @next/codemod@canary upgrade latest`
3. `npm i next@canary`
4. `next dev`

<details><summary>정답 보기</summary>

**정답: 2** — 16.1.0 이전 버전에는 내장 `upgrade` 명령이 없어 별도 codemod 패키지가 필요하다.

</details>

**Q2. (복수 선택) canary 업그레이드 전에 해야 할 일을 모두 고르시오.**

- [ ] 최신 안정 버전으로 먼저 올린다.
- [ ] 애플리케이션이 정상 동작하는지 확인한다.
- [ ] 안정 버전 검증 없이 곧바로 프로덕션에 배포한다.
- [ ] canary 기능이 필요한지 확인한다.

<details><summary>정답 보기</summary>

**정답: 1, 2, 4** — 안정 버전에서 기준점을 확보한 뒤 필요한 canary 기능을 시험해야 문제 원인을 구분하기 쉽다.

</details>

## 요약

- Next.js 16.1 이상은 `next upgrade` 명령을 제공한다.
- 더 오래된 버전은 `@next/codemod`의 upgrade 명령을 사용한다.
- 수동 업그레이드에서는 Next.js와 React 관련 패키지를 함께 갱신한다.
- canary 전에는 최신 안정 버전에서 애플리케이션 동작을 확인한다.
- Next.js 16.3.0 기준 일부 인증 API는 canary에서만 제공된다.
