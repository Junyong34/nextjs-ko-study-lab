# distDir

- 공식 문서: [distDir](https://nextjs.org/docs/app/api-reference/config/next-config-js/distDir)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js의 기본 빌드 산출물 디렉토리(`.next`)를 커스텀 이름으로 변경하는 `distDir` 옵션의 역할을 이해한다.
- `distDir` 설정 시 준수해야 하는 디렉토리 경로 제약 조건(프로젝트 디렉토리 이탈 불가)을 파악한다.
- `next start`, `.gitignore`, CI/CD 배포 파이프라인에서 커스텀 빌드 디렉토리를 올바르게 운영하는 방법을 설명할 수 있다.

## 핵심 개념 및 설명

Next.js는 `next build`를 실행할 때 컴파일된 애플리케이션 산출물, 캐시, 정적 파일 등을 기본적으로 프로젝트 루트의 `.next` 디렉토리에 저장한다.

특정 배포 환경이나 사내 빌드 파이프라인의 명명 규칙에 맞춰야 한다면 `next.config.js`에서 `distDir`을 설정해 기본 `.next` 폴더 대신 사용할 커스텀 빌드 디렉토리 이름을 지정할 수 있다.

### 기본 설정 구조

`next.config.js`에 `distDir` 설정을 추가한다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  distDir: 'build',
}

export default nextConfig
```

이 설정을 적용한 후 터미널에서 `next build`를 실행하면 Next.js는 `.next` 대신 지정한 `build` 디렉토리를 생성하고 모든 빌드 산출물을 해당 위치에 출력한다.

---

### 경로 제약 조건

> **주의**:
> `distDir` 경로는 현재 Next.js 프로젝트 디렉토리 외부로 벗어나서는 안 된다.
> 예를 들어 상위 폴더를 가리키는 `../build`와 같은 상대 경로는 **유효하지 않으며(invalid)** Next.js 빌드 시 오류가 발생한다.

---

### 운영 및 배포 고려사항

`distDir`을 기본값에서 변경할 때는 프로젝트 환경 전반에 걸쳐 다음 사항을 함께 조정해야 한다:

1. **`next start` 실행 환경**:
   프로덕션 서버를 시작하는 `next start` 명령은 `next.config.js`에 선언된 `distDir` 값을 그대로 참조하여 서버를 초기화한다. 따라서 빌드할 때와 실행할 때 같은 설정 파일을 유지해야 한다.
2. **버전 관리(`.gitignore`)**:
   커스텀 빌드 디렉토리는 용량이 크고 소스 코드가 아닌 생성물이므로, Git 저장소에 커밋되지 않도록 `.gitignore` 파일에 해당 디렉토리 이름(예: `/build`)을 반드시 추가해야 한다.
3. **CI/CD 및 컨테이너 캐시**:
   Docker 배포 스크립트나 CI/CD 파이프라인에서 빌드 캐시를 유지하거나 산출물을 복사할 때, 경로를 `.next`가 아닌 변경된 커스텀 디렉토리명(`build/`)으로 일치시켜야 한다.

---

## 예제 및 데모 설계

- 데모 가능 여부: 불가 (빌드 산출물 생성 디렉토리 경로 지정 옵션으로 브라우저 런타임 UI가 없음)
- `next.config.js`에 `distDir: 'custom-dist'`를 설정한 후 터미널에서 `next build`를 실행한다.
- 프로젝트 루트에 기본 폴더인 `.next`가 생성되지 않고 `custom-dist` 폴더가 생성되는지 확인한다. `custom-dist` 내부에 `server/`, `static/`, `BUILD_ID` 등의 빌드 파일이 정상 출력됐는지는 파일 탐색기 또는 터미널 명령(`ls -la custom-dist`)으로 확인한다.
- `next start` 실행 시 정상적으로 `custom-dist`의 산출물을 로드하여 프로덕션 서버가 기동되는지 검증한다.

---

## 연습 문제

1. `next.config.js`의 `distDir` 설정에 대한 설명 중 올바르지 않은 것은 무엇인가?
   - A. 기본값은 `.next` 디렉토리다.
   - B. 사내 배포 규칙에 맞추어 `distDir: 'build'`와 같이 변경할 수 있다.
   - C. 상위 디렉토리에 산출물을 모아두기 위해 `distDir: '../output'`으로 설정할 수 있다.
   - D. 변경된 디렉토리는 Git에 커밋되지 않도록 `.gitignore`에 등록해야 한다.

<details><summary>정답 보기</summary>

정답: **C**
해설: `distDir`은 프로젝트 디렉토리 내부를 가리켜야 하며, `../output`과 같이 프로젝트 루트 외부로 벗어나는 경로는 공식적으로 지원되지 않는 잘못된(invalid) 설정이다.
</details>

2. `distDir`을 커스텀 디렉토리명으로 변경했을 때 프로덕션 환경 운영에 미치는 영향으로 가장 올바른 것은 무엇인가?
   - A. `next start`는 항상 `.next`만을 찾으므로 별도의 CLI 플래그를 전달해야 한다.
   - B. `next start`는 `next.config.js`에 지정된 `distDir` 값을 자동으로 읽어 해당 디렉토리의 산출물을 참조한다.
   - C. 브라우저에서 요청하는 모든 URL 경로에 커스텀 디렉토리명이 자동으로 접두사로 붙는다.
   - D. 정적 HTML 내보내기(`output: 'export'`)를 사용할 때만 유효하며 일반 빌드에서는 무시된다.

<details><summary>정답 보기</summary>

정답: **B**
해설: `next start`는 동일한 `next.config.js`를 참조하므로 설정된 `distDir` 폴더로부터 프로덕션 빌드 결과물을 읽어 정상 기동한다. 이는 URL 경로(`basePath`)나 브라우저 라우팅과는 무관한 빌드 파일 시스템 설정이다.
</details>

---

## 챕터 요약

- `distDir`은 `next build` 시 생성되는 산출물 폴더의 이름을 기본 `.next`에서 다른 이름(예: `'build'`)으로 변경하는 옵션이다.
- 보안 및 파일 시스템 정합성을 위해 프로젝트 루트 외부로 나가는 상대 경로(예: `../build`)는 허용되지 않는다.
- `next start` 명령은 설정된 `distDir`을 인식하여 구동되므로 빌드와 런타임 간에 설정이 일치해야 한다.
- 디렉토리명을 변경한 후에는 `.gitignore`에 등록하고 CI/CD 빌드 산출물 복사 경로도 빠짐없이 수정해야 한다.
