# Version 14

- 공식 문서: [Version 14](https://nextjs.org/docs/app/guides/upgrading/version-14)
- 상위 메뉴: [Upgrading](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js 13에서 14로 올릴 때 설치할 패키지와 런타임 요구 사항을 확인한다.
- Version 14에서 제거되거나 경로가 바뀐 기능을 적용한다.

## 핵심 개념 및 설명

### 13에서 14로 업그레이드하기

선호하는 패키지 관리 도구로 Next.js 14, React 18, React DOM 18, `eslint-config-next` 14를 설치한다.

```bash
npm i next@next-14 react@18 react-dom@18 && npm i eslint-config-next@next-14 -D
```

> **알아두면 좋은 점**: TypeScript를 사용한다면 `@types/react`, `@types/react-dom`도 최신 버전으로 올린다.

### v14 요약

- 최소 Node.js 버전이 16.14에서 18.17로 올랐다. Node.js 16.x는 지원 종료 상태다.
- `next export` 명령이 제거됐다. 정적 내보내기는 `output: 'export'` 설정으로 바꾼다. 자세한 내용은 [Static Exports](../static-exports.md) 문서를 참고한다.
- `ImageResponse`의 `next/server` import는 `next/og`로 이름이 바뀌었다. import를 안전하게 바꾸는 `next-og-import` [codemod](./codemods.md)가 있다.
- `@next/font` 패키지가 제거되고 내장 `next/font`가 이를 대신한다. `built-in-next-font` [codemod](./codemods.md)가 import를 바꾼다.
- `next-swc`의 WASM 대상이 제거됐다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- Version 13 프로젝트의 패키지와 Node.js 버전을 올린 뒤, 정적 내보내기 설정과 `next build` 결과를 확인한다.
- `ImageResponse`, `@next/font` import를 codemod로 바꾸고 컴파일 결과를 비교한다.

## 연습 문제

1. Next.js 14의 최소 Node.js 버전은 무엇인가?
   - A. 18.17
   - B. 16.14
   - C. 20.0

   <details><summary>정답 보기</summary>

   정답: A. Version 14는 Node.js 18.17 이상을 요구한다.

   </details>

2. 제거된 `next export` 명령을 대신하는 설정은 무엇인가?
   - A. `output: 'export'`
   - B. `static: true`
   - C. `exportPathMap: true`

   <details><summary>정답 보기</summary>

   정답: A. 정적 내보내기는 Next.js 설정에서 `output: 'export'`로 지정한다.

   </details>

## 챕터 요약

- Version 14는 Node.js 18.17 이상과 React 18을 요구한다.
- 정적 내보내기는 `next export` 명령 대신 `output: 'export'`를 사용한다.
- `ImageResponse`는 `next/og`에서 가져오고, `@next/font`는 `next/font`로 옮긴다.
- 제공되는 codemod를 사용한 뒤에는 빌드와 타입 검사를 확인한다.
