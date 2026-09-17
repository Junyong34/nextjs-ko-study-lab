# outputHashSalt

- 공식 문서: [outputHashSalt](https://nextjs.org/docs/app/api-reference/config/next-config-js/outputHashSalt)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `outputHashSalt`가 chunk와 asset 같은 콘텐츠 주소 기반 출력 파일명의 hash에 salt를 반영하는 방식을 이해한다.
- salt를 바꾸어 소스 파일을 수정하지 않고도 배포 사이에 캐시된 에셋을 무효화하는 방법을 익힌다.
- `next.config.js`와 `NEXT_HASH_SALT`를 함께 사용할 때 유효한 salt가 만들어지는 규칙을 설명할 수 있다.

## 핵심 개념 및 설명

`outputHashSalt`는 설정한 salt 문자열을 chunk와 asset 같은 콘텐츠 주소 기반 출력 파일명의 hash에 반영하는 옵션이다. 이 값을 바꾸면 모든 output hash가 바뀌므로 소스 파일을 수정하지 않고도 배포 사이에 캐시된 에셋을 무효화할 수 있다.

### 설정 예시

`next.config.js`에 `outputHashSalt`를 지정한다.

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  outputHashSalt: 'my-deployment-salt',
}

module.exports = nextConfig
```

이 옵션은 Webpack과 Turbopack 두 번들러에서 모두 동작한다.

`NEXT_HASH_SALT` 환경 변수로도 같은 목적을 달성할 수 있다. 두 값을 모두 설정하면 `outputHashSalt + NEXT_HASH_SALT`로 이어 붙인 문자열이 유효한 salt가 된다. 설정에 프로젝트별 salt를 넣고 빌드 시점에 환경 변수로 배포별 salt를 주입할 수 있다.

```bash filename="Terminal"
NEXT_HASH_SALT=my-deployment-salt next build
```

### 버전 기록 (Version History)

| 버전 | 변경 사항 |
| --- | --- |
| 16.3.0 | `outputHashSalt`가 추가됐다. |

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 동일한 소스 파일로 `outputHashSalt: 'salt-a'`와 `outputHashSalt: 'salt-b'`를 각각 설정해 빌드한다.
- 두 빌드의 chunk와 asset 파일명을 비교해 salt가 바뀌었을 때 output hash가 달라지는지 확인한다.
- 각 빌드를 실행한 뒤 브라우저 DevTools의 Network 탭에서 정적 에셋 요청 URL이 달라지는지도 관찰한다.

## 연습 문제

1. `outputHashSalt`의 주된 목적은 무엇인가?
   - A. 소스 파일의 내용을 자동으로 암호화한다.
   - B. 출력 파일명에 반영되는 hash를 바꾸어 배포 사이의 캐시된 에셋을 무효화한다.
   - C. Webpack을 Turbopack으로 자동 교체한다.
   - D. `next build`가 실행될 때마다 새로운 route를 추가한다.

<details><summary>정답 보기</summary>

정답: **B**

해설: `outputHashSalt`를 바꾸면 chunk와 asset의 output hash가 바뀌어 소스 파일을 수정하지 않고도 캐시 무효화를 유도할 수 있다.
</details>

2. 다음 설명 중 `outputHashSalt`와 `NEXT_HASH_SALT`를 함께 설정했을 때의 동작으로 올바른 것은 무엇인가?
   - A. `NEXT_HASH_SALT`가 `outputHashSalt`를 무조건 덮어쓴다.
   - B. `outputHashSalt`가 `NEXT_HASH_SALT`를 무조건 덮어쓴다.
   - C. 두 값이 `outputHashSalt + NEXT_HASH_SALT` 순서로 이어 붙여져 유효한 salt가 된다.
   - D. 두 값 중 숫자로 변환할 수 있는 값만 사용된다.

<details><summary>정답 보기</summary>

정답: **C**

해설: 두 값이 모두 설정되면 Next.js는 두 문자열을 `outputHashSalt + NEXT_HASH_SALT` 순서로 연결해 유효한 salt를 만든다.
</details>

## 챕터 요약

- `outputHashSalt`는 chunk와 asset 같은 콘텐츠 주소 기반 출력 파일명의 hash에 salt를 반영한다.
- salt를 바꾸면 모든 output hash가 바뀌어 배포 사이에 캐시된 에셋을 무효화할 수 있다.
- Webpack과 Turbopack에서 모두 동작한다.
- `NEXT_HASH_SALT` 환경 변수로도 salt를 지정할 수 있다.
- 두 값을 함께 설정하면 유효한 salt는 `outputHashSalt + NEXT_HASH_SALT`를 이어 붙인 값이 된다.
- 이 옵션은 Next.js 16.3.0에 추가됐다.
