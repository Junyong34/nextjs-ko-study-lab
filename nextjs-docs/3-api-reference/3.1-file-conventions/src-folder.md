# src

- 공식 문서: [src](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- 애플리케이션 코드를 `src` 아래로 옮기면서 root 설정 파일 경계를 유지한다.
- root `app`/`pages`와 `src/app`/`src/pages`의 우선순위를 이해한다.

## 핵심 개념 및 설명

프로젝트 루트에 특별한 Next.js`app` 또는 `pages` 디렉터리를 두는 대신 Next.js는 `src` 폴더 아래에 애플리케이션 코드를 배치하는 일반적인 패턴도 지원한다.

이는 대부분 개인과 팀이 선호하는 프로젝트 루트에 있는 프로젝트 구성 파일과 애플리케이션 코드를 분리한다.

`src` 폴더를 사용하려면 `app` 라우터 폴더 또는 `pages` 라우터 폴더를 각각 `src/app` 또는 `src/pages`로 이동한다.

![`src` 폴더가 있는 폴더 구조의 예](./assets/src-folder-01.webp)

> **알아두면 좋은 점**:
>
> - `/public` 디렉터리는 프로젝트의 루트에 남아 있어야 한다.
> - `package.json`,`next.config.js` 및 `tsconfig.json`와 같은 구성 파일은 프로젝트 루트에 남아 있어야 한다.
> - `.env.*` 파일은 프로젝트 루트에 남아 있어야 한다.
> - 루트 디렉터리에 `app` 또는 `pages`가 있으면 `src/app` 또는 `src/pages`는 무시된다.
> - `src`를 사용하는 경우 `/components` 또는 `/lib`와 같은 다른 응용 프로그램 폴더도 이동할 수도 있다.
> - 프록시를 사용하는 경우 `src` 폴더 안에 있는지 확인한다.
> - Tailwind CSS를 사용하는 경우 [콘텐츠 섹션](https://tailwindcss.com/docs/content-configuration)의 `tailwind.config.js` 파일에 `/src` 접두사를 추가해야 한다.
> - `@/*`와 같은 가져오기에 TypeScript 경로를 사용하는 경우 `src/`를 포함하도록 `tsconfig.json`의 `paths` 객체를 업데이트해야 한다.

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
