# public

- 공식 문서: [public](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)
- 상위 메뉴: [File-system conventions](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `public`의 파일을 base URL 기준 경로로 제공한다.
- 기본 caching header의 의미와 metadata 파일의 올바른 위치를 이해한다.

## 핵심 개념 및 설명

프로젝트 root의 `public` 아래 파일은 base URL(`/`)부터 참조한다. 예를 들어 `public/avatars/me.png`는 `/avatars/me.png`로 접근한다.

```tsx
import Image from 'next/image'

export function Avatar() {
  return <Image src="/avatars/me.png" alt="Me" width={64} height={64} />
}
```

파일은 변경될 수 있으므로 Next.js는 안전하게 immutable cache로 취급하지 않는다. 기본 header는 `Cache-Control: public, max-age=0`이다. `robots.txt`, `favicon.ico` 같은 metadata는 `public` 대신 `app`의 [Metadata Files](./3.1.21-metadata/README.md) 규칙을 사용한다.

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
- 파일은 base URL부터 참조한다.
- 기본 header는 `public, max-age=0`이다.
- 정적 metadata는 전용 Metadata Files 규칙을 사용한다.
