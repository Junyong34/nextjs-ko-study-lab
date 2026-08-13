# src

- 공식 문서: [src](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 애플리케이션 코드를 `src` 아래로 옮기면서 root 설정 파일 경계를 유지한다.
- root `app`/`pages`와 `src/app`/`src/pages`의 우선순위를 이해한다.

## 핵심 개념 및 설명

Next.js는 root의 `app` 또는 `pages` 대신 `src/app`, `src/pages`를 지원한다. 애플리케이션 코드와 프로젝트 설정 파일을 분리하려는 팀에 유용하다.

`public`, `package.json`, `next.config.js`, `tsconfig.json`, `.env.*`는 프로젝트 root에 남긴다. root에 `app` 또는 `pages`가 있으면 대응하는 `src/app` 또는 `src/pages`는 무시된다. Proxy를 사용하면 `src` 안에 배치한다. Tailwind content 경로와 TypeScript import alias도 `src/`를 반영하도록 갱신한다.

> **알아두면 좋은 점**: `src`를 선택했다면 `components`, `lib` 같은 애플리케이션 폴더도 함께 옮기는 편이 구조를 이해하기 쉽다.

## 예제 및 데모 설계

- Phase 2에서 root `app`을 `src/app`으로 이동하고 설정·환경 파일이 root에 남는지 확인한다.
- 중복 `app`을 잠시 두어 root 쪽이 우선되는 현상을 확인한다.

## 연습 문제

1. `src`를 써도 root에 남겨야 하는 것은?
   - A. `public`
   - B. `app`
   - C. `components`

<details><summary>정답 보기</summary>

정답: A. 정적 asset과 설정·환경 파일은 root에 둔다.
</details>

## 챕터 요약

- `src/app`은 root `app`의 대안이다.
- `public`과 설정·환경 파일은 root에 둔다.
- root `app`이 존재하면 `src/app`은 무시된다.
- Proxy는 선택한 `src` 구조 안에 둔다.
- alias와 Tailwind 경로도 함께 조정한다.
