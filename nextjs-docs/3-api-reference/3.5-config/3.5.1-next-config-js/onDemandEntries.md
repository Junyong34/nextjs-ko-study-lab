# onDemandEntries

- 공식 문서: [onDemandEntries](https://nextjs.org/docs/app/api-reference/config/next-config-js/onDemandEntries)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 개발 환경에서 Next.js가 빌드한 페이지를 메모리에 보관하거나 폐기하는 방식을 이해한다.
- `maxInactiveAge`로 페이지를 버퍼에 보관하는 시간을, `pagesBufferLength`로 동시에 보관할 페이지 수를 조절하는 방법을 익힌다.
- `onDemandEntries`가 브라우저 기능이 아니라 개발 서버의 메모리 관리 설정이라는 점을 구분한다.

## 핵심 개념 및 설명

`onDemandEntries`는 개발 환경에서 서버가 빌드한 페이지를 메모리에 얼마나 오래 보관하고 언제 폐기할지 조절한다. 개발 서버의 페이지 버퍼를 관리할 때 쓰는 설정이다.

기본값을 바꾸려면 `next.config.js`에 `onDemandEntries`를 추가한다.

### 설정 예시

```js filename="next.config.js"
module.exports = {
  onDemandEntries: {
    // 서버가 페이지를 버퍼에 보관하는 시간(ms)
    maxInactiveAge: 25 * 1000,
    // 폐기하지 않고 동시에 보관할 페이지 수
    pagesBufferLength: 2,
  },
}
```

`maxInactiveAge`는 서버가 페이지를 버퍼에 보관하는 기간을 밀리초 단위로 지정한다. 예시의 `25 * 1000`은 25초다. `pagesBufferLength`는 폐기하지 않고 동시에 보관할 페이지 수를 지정한다. 예시에서는 `2`개를 보관한다.

## 예제 및 데모 설계

- 데모 가능 여부: 불가
- `onDemandEntries`는 개발 서버 내부에서 페이지를 메모리에 보관하고 폐기하는 동작을 다루므로 브라우저 화면만으로는 직접 확인하기 어렵다.
- 로컬 개발 서버에서 여러 페이지를 번갈아 방문하면서 서버 로그와 개발 환경의 재빌드 여부를 관찰하는 검증 절차는 설계할 수 있다. 다만 이 문서의 브라우저 데모 판정에는 포함하지 않는다.

## 연습 문제

1. `onDemandEntries`가 조절하는 대상은 무엇인가?
   - A. 프로덕션 응답의 `Cache-Control` 헤더
   - B. 개발 서버가 빌드한 페이지를 메모리에 보관하거나 폐기하는 방식
   - C. 브라우저의 `<Link>` prefetch 동작
   - D. 정적 자산 파일의 해시 문자열

<details><summary>정답 보기</summary>

정답: **B**

해설: `onDemandEntries`는 개발 환경에서 서버가 빌드한 페이지를 메모리에 유지하는 시간과 동시에 보관할 페이지 수를 조절한다.
</details>

2. 다음 설정에 대한 설명으로 올바른 것은 무엇인가?

   ```js
   onDemandEntries: {
     maxInactiveAge: 25 * 1000,
     pagesBufferLength: 2,
   }
   ```

   - A. 페이지를 25밀리초 동안만 보관하고 2개 라우트만 빌드한다.
   - B. 페이지를 25초 동안 보관하고 동시에 2개를 폐기하지 않고 유지한다.
   - C. 페이지를 2초 동안 보관하고 동시에 25개를 유지한다.
   - D. 프로덕션 서버에서 항상 2개의 페이지를 캐시한다.

<details><summary>정답 보기</summary>

정답: **B**

해설: `25 * 1000`은 밀리초 기준 25초다. `pagesBufferLength: 2`는 동시에 보관할 페이지 수를 뜻한다.
</details>

## 챕터 요약

- `onDemandEntries`는 개발 환경에서 서버가 빌드한 페이지의 메모리 보관과 폐기를 조절한다.
- `maxInactiveAge`는 페이지를 버퍼에 보관하는 시간을 밀리초 단위로 지정한다.
- `pagesBufferLength`는 폐기하지 않고 동시에 보관할 페이지 수를 지정한다.
- 예시의 `25 * 1000`은 25초이며 `pagesBufferLength: 2`는 2개 페이지를 의미한다.
- 이 설정은 브라우저 UI보다 개발 서버 내부 동작과 관련이 있으므로 브라우저 데모로 직접 확인하기에는 적합하지 않다.
