# favicon, icon, and apple-icon

- 공식 문서: [favicon, icon, and apple-icon](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- 상위 메뉴: [Metadata Files](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- favicon·일반 icon·Apple touch icon의 type과 위치 제약을 구분한다.
- 정적 image와 `ImageResponse` 기반 생성 방식을 선택한다.
- 생성 함수의 params·size·contentType 설정을 이해한다.

## 핵심 개념 및 설명

브라우저 tab, 홈 화면, 검색 결과 icon은 두 방식으로 설정한다.

| 규칙 | 지원 type | 위치 |
|---|---|---|
| `favicon` | `.ico` | `app/` root만 |
| `icon` | `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg` | 모든 `app` segment |
| `apple-icon` | `.jpg`, `.jpeg`, `.png` | 모든 `app` segment |

정적 파일을 배치하면 Next.js가 `rel`, `href`, `type`, `sizes`를 계산해 `<link>`를 만든다. 숫자 suffix로 여러 icon을 둘 수 있고 lexical order로 정렬된다. `favicon`은 root에만 가능하므로 segment별 icon은 `icon`을 사용한다.

SVG이거나 크기를 판별할 수 없는 icon에는 `sizes="any"`가 붙는다. 정적 image metadata가 계산한 실제 크기와 type은 생성된 link 속성에 반영된다.

`icon.js|ts|tsx` 또는 `apple-icon.js|ts|tsx`는 `ImageResponse`나 `Blob`, `ArrayBuffer`를 반환해 이미지를 생성한다. 함수는 현재 segment까지의 Promise `params`를 받을 수 있고 `size`, `contentType`을 export할 수 있다. 여러 이미지는 `generateImageMetadata`로 생성한다. 생성 파일은 기본적으로 정적 최적화되지만 Request-time API나 다이나믹 dependency를 쓰면 다이나믹이 된다.

## 예제 및 데모 설계

- Phase 2에서 root favicon과 nested route icon을 만들고 head의 link tag를 비교한다.
- params 기반 동적 icon과 `generateImageMetadata`의 여러 결과를 확인한다.

## 연습 문제

1. nested segment에 둘 수 없는 것은?
   - A. `icon.png`
   - B. `apple-icon.png`
   - C. `favicon.ico`

<details><summary>정답 보기</summary>

정답: C. favicon은 `app` root에만 둔다.
</details>

## 챕터 요약

- favicon, icon, apple-icon은 서로 지원 type과 위치가 다르다.
- 정적 파일의 head 속성은 Next.js가 계산한다.
- 숫자 suffix로 여러 icon을 정의할 수 있다.
- 코드 생성 variant는 `ImageResponse` 등을 반환한다.
- 다이나믹 생성 함수는 Promise params를 받을 수 있다.
