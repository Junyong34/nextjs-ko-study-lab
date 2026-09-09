# poweredByHeader

- 공식 문서: [poweredByHeader](https://nextjs.org/docs/app/api-reference/config/next-config-js/poweredByHeader)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js가 기본적으로 응답에 추가하는 `x-powered-by` 헤더를 이해한다.
- `poweredByHeader: false`로 해당 헤더를 비활성화하는 설정 방법을 익힌다.
- 설정 변경 후 브라우저 Network 탭에서 실제 응답 헤더를 확인하는 방법을 익힌다.

## 핵심 개념 및 설명

기본적으로 Next.js는 응답에 `x-powered-by` 헤더를 추가한다. 이 헤더를 추가하지 않으려면 `next.config.js`에서 `poweredByHeader`를 비활성화한다.

### 설정 예시

```js filename="next.config.js"
module.exports = {
  poweredByHeader: false,
}
```

`poweredByHeader: false`를 설정한 뒤 다시 빌드하고 서버를 실행하면 Next.js가 추가하던 `x-powered-by` 헤더가 응답에 포함되지 않는다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- `poweredByHeader`를 기본 상태와 `false` 상태로 각각 실행한 뒤 브라우저 DevTools Network 탭에서 문서 응답 헤더를 비교한다.
- 기본 상태에서는 `x-powered-by` 헤더가 있는지, `false` 설정에서는 해당 헤더가 사라지는지 확인한다.

## 연습 문제

1. Next.js가 기본적으로 응답에 추가하는 헤더는 무엇인가?
   - A. `x-powered-by`
   - B. `x-next-config`
   - C. `x-next-route`
   - D. `x-cache-components`

<details><summary>정답 보기</summary>

정답: **A**

해설: Next.js는 기본적으로 `x-powered-by` 헤더를 추가한다.
</details>

2. `x-powered-by` 헤더를 비활성화하는 올바른 설정은 무엇인가?
   - A. `poweredByHeader: true`
   - B. `poweredByHeader: 'false'`
   - C. `poweredByHeader: false`
   - D. `removePoweredBy: true`

<details><summary>정답 보기</summary>

정답: **C**

해설: `next.config.js`에서 `poweredByHeader: false`를 지정하면 해당 헤더를 비활성화한다.
</details>

## 챕터 요약

- Next.js는 기본적으로 `x-powered-by` 헤더를 응답에 추가한다.
- `next.config.js`의 `poweredByHeader` 옵션으로 이 동작을 제어한다.
- `poweredByHeader: false`를 지정하면 Next.js가 추가하는 헤더를 비활성화한다.
- 설정 결과는 브라우저 DevTools Network 탭의 실제 응답 헤더에서 확인할 수 있다.
