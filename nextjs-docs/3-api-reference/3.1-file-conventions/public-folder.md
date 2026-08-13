# public

- 공식 문서: [public](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `public`의 파일을 base URL 기준 경로로 제공한다.
- 기본 caching header의 의미와 metadata 파일의 올바른 위치를 이해한다.

## 핵심 개념 및 설명

Next.js는 루트 디렉터리의 `public`라는 폴더 아래에 이미지와 같은 정적 파일을 제공할 수 있다. 그런 다음 `public` 내부의 파일은 기본 URL(`/`)에서 시작하는 코드에서 참조할 수 있다.

예를 들어 `public/avatars/me.png` 파일은 `/avatars/me.png` 경로를 방문하여 볼 수 있다. 해당 이미지를 표시하는 코드는 다음과 같다.

```jsx filename="avatar.js"
import Image from 'next/image'

export function Avatar({ id, alt }) {
  return @@IMAGE00@@
}

export function AvatarOfMe() {
  return <Avatar id="me" alt="A portrait of me" />
}
```

<a id="caching"></a>
### 캐싱

Next.js는 자산이 변경될 수 있으므로 `public` 폴더의 자산을 안전하게 캐시할 수 없다. 적용되는 기본 캐싱 헤더는 다음과 같다.

```jsx
Cache-Control: public, max-age=0
```

<a id="robots-favicons-and-others"></a>
### 로봇, 파비콘 등

`robots.txt`,`favicon.ico` 등과 같은 정적 메타데이터 파일의 경우 `app` 폴더 내의 [특수 메타데이터 파일](3.1.21-metadata/README.md)을 사용해야 한다.

## 예제 및 데모 설계

- Phase 2에서 정적 image와 text 파일을 base URL로 요청하고 response header를 기록한다.
- 같은 favicon을 `public`과 Metadata Files 방식으로 비교한다.

## 연습 문제

1. `public/docs/guide.pdf`의 URL은?
   - A. `/public/docs/guide.pdf`
   - B. `/docs/guide.pdf`
   - C. `/app/docs/guide.pdf`

<details><summary>정답 보기</summary>

정답: B. `public` 자체는 URL에 포함되지 않는다.
</details>

## 챕터 요약

- `public`은 프로젝트 root에 둔다.
- 파일은 base URL부터 Reference한다.
- 기본 header는 `public, max-age=0`이다.
- 정적 metadata는 전용 Metadata Files 규칙을 사용한다.
