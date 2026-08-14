# Testing Adapters

- 공식 문서: [Testing Adapters](https://nextjs.org/docs/app/api-reference/adapters/testing-adapters)
- 상위 메뉴: [Adapters](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- Next.js가 제공하는 어댑터 테스트 하네스(test harness)의 역할을 이해한다.
- deploy·logs·cleanup 세 스크립트 계약(contract)의 입출력 규칙을 파악한다.
- CI에서 어댑터의 end-to-end 배포 테스트를 실행하는 워크플로 구조를 이해한다.

## 핵심 개념 및 설명

Next.js는 어댑터를 검증하기 위한 테스트 하네스를 제공한다. 이 하네스는 배포(deploy)에 대한 end-to-end 테스트를 실행한다.

테스트 하네스는 다음 환경 변수를 찾는다.

- `NEXT_TEST_DEPLOY_SCRIPT_PATH`: 격리된 테스트 앱을 빌드하고 배포하는 실행 파일의 경로
- `NEXT_TEST_DEPLOY_LOGS_SCRIPT_PATH`: 해당 배포의 빌드·런타임 로그를 반환하는 실행 파일의 경로
- `NEXT_TEST_CLEANUP_SCRIPT_PATH`: 테스트 실행 후 배포를 정리하는 선택적 실행 파일의 경로

### 커스텀 deploy 스크립트 계약

`NEXT_TEST_DEPLOY_SCRIPT_PATH` 스크립트는 Next.js 테스트 하네스가 만든 격리된 임시 앱을 `cwd`로 설정해 실행된다.

deploy 스크립트는 다음 계약을 따라야 한다.

- 실패 시 0이 아닌(non-zero) 코드로 종료한다.
- 배포 URL을 `stdout`에 출력한다. 이 값은 배포를 검증하는 데 사용되므로, 그 외의 내용은 `stdout`에 쓰지 않는다.
- 진단용 출력은 `stderr`나 작업 디렉토리 안의 파일에 쓴다.

deploy 스크립트와 logs 스크립트는 서로 별도의 프로세스로 실행되므로, 이후 사용할 build ID나 서버 로그 같은 데이터는 작업 디렉토리 안의 파일에 영속화(persist)해야 한다.

```bash
#!/usr/bin/env bash
set -euo pipefail

# 어댑터를 설치하고, 앱을 빌드한 뒤 배포하거나 시작한다.
node -e "
const pkg=JSON.parse(require('fs').readFileSync('package.json','utf8'));
pkg.dependencies=pkg.dependencies||{};
pkg.dependencies['adapter']='file:${ADAPTER_DIR}';
require('fs').writeFileSync('package.json',JSON.stringify(pkg,null,2));
" >&2

# 앱이 이 어댑터를 사용하도록 경로를 지정한다.
export NEXT_ADAPTER_PATH="${ADAPTER_DIR}/dist/index.js"

# 앱을 빌드한다.
pnpm build

# 나중에 필요한 메타데이터를 작업 디렉토리의 파일에 기록한다.
BUILD_ID="$(cat .next/BUILD_ID)"
DEPLOYMENT_ID="my-adapter-local"
# 어댑터가 immutable static assets를 지원하면 "1"로 설정한다.
NEXT_SUPPORTS_IMMUTABLE_ASSETS="0"

{
  echo "BUILD_ID: $BUILD_ID"
  echo "DEPLOYMENT_ID: $DEPLOYMENT_ID"
  echo "NEXT_SUPPORTS_IMMUTABLE_ASSETS: $NEXT_SUPPORTS_IMMUTABLE_ASSETS"
} >> .adapter-build.log

# 앱을 시작하거나 배포한다. 이 시점에 URL을 캡처하거나 stdout으로 출력한다.
provider-cli-to-deploy

# URL 출력 예시:
# echo "http://127.0.0.1:3000"
```

### 커스텀 logs 스크립트 계약

`NEXT_TEST_DEPLOY_LOGS_SCRIPT_PATH` 스크립트도 격리된 임시 앱을 `cwd`로 설정해 실행된다. 추가로 `NEXT_TEST_DIR`과 `NEXT_TEST_DEPLOY_URL`을 환경 변수로 전달받는다.

이 스크립트의 출력에는 다음으로 시작하는 줄이 반드시 포함되어야 한다.

- `BUILD_ID:`
- `DEPLOYMENT_ID:`
- `NEXT_SUPPORTS_IMMUTABLE_ASSETS:`

이 마커들 뒤에는 실패를 디버깅하는 데 도움이 되는 추가 빌드·서버 로그를 자유롭게 출력할 수 있다.

```bash
#!/usr/bin/env bash
set -euo pipefail

if [ -f ".adapter-build.log" ]; then
  cat ".adapter-build.log"
fi

if [ -f ".adapter-server.log" ]; then
  echo "=== .adapter-server.log ==="
  cat ".adapter-server.log"
fi
```

deploy 스크립트가 `.adapter-build.log`와 `.adapter-server.log`를 기록해두고, logs 스크립트가 그 파일들을 그대로 출력해 하네스가 필요한 마커를 추출하게 하는 패턴이 일반적이다. 이는 여러 방법 중 하나일 뿐이며, 플랫폼마다 로그를 가져오는 방식이 다르다.

### 커스텀 cleanup 스크립트 계약

`NEXT_TEST_CLEANUP_SCRIPT_PATH` 스크립트 역시 격리된 임시 앱을 `cwd`로 설정해 실행되며, `NEXT_TEST_DIR`과 `NEXT_TEST_DEPLOY_URL`을 환경 변수로 전달받는다.

이 스크립트는 deploy 스크립트가 생성한 리소스를 정리하는 데 사용할 수 있다. 테스트가 모두 끝난 뒤에 실행된다.

### CI에서의 실행 구조

공식 문서는 GitHub Actions 워크플로 예시를 함께 제공한다. 이 워크플로는 크게 두 job으로 나뉜다.

- **build**: Next.js 저장소와 어댑터 저장소를 함께 체크아웃하고, Next.js와 어댑터를 빌드한 뒤 Playwright까지 설치해 캐시에 저장한다.
- **test**: build job의 캐시를 복원하고, `NEXT_TEST_MODE=deploy`와 세 스크립트 경로 환경 변수를 설정한 뒤 `node run-tests.js --timings -g <group> -c 2 --type e2e`로 테스트를 그룹 단위 매트릭스(matrix)로 병렬 실행한다.

> **알아두면 좋은 점**:
>
> - deploy 스크립트는 배포 URL 외의 내용을 `stdout`에 출력하지 않아야 한다. 하네스가 `stdout`을 URL로 그대로 해석하기 때문이다.
> - `NEXT_SUPPORTS_IMMUTABLE_ASSETS` 값은 어댑터가 [immutable static assets](./immutable-static-assets.md)를 지원하는지에 따라 logs 스크립트에서 반드시 보고해야 하는 마커다.

## 예제 및 데모 설계

- Phase 1에서는 구현 예정이다. Phase 2에서 어댑터 데모 앱을 만들 때, 로컬에서 동작하는 최소한의 deploy·logs·cleanup 스크립트 셋을 작성해 `run-tests.js -g 1/1 --type e2e` 형태로 하네스를 직접 실행해본다.
- deploy 스크립트가 `stdout`에 URL 외의 다른 로그를 실수로 섞어 테스트가 실패하는 사례를 재현해, 계약 위반이 어떻게 감지되는지 확인하는 데모를 설계한다.

## 연습 문제

1. deploy 스크립트가 `stdout`에 반드시 출력해야 하는 값은?
   - A. 빌드 로그 전체
   - B. 배포 URL
   - C. `BUILD_ID` 마커

<details><summary>정답 보기</summary>

정답: B. deploy 스크립트의 `stdout`은 배포 URL 검증에 쓰이므로 다른 내용을 섞지 않아야 한다.
</details>

2. logs 스크립트의 출력에 반드시 포함되어야 하는 마커가 아닌 것은?
   - A. `BUILD_ID:`
   - B. `DEPLOYMENT_ID:`
   - C. `NEXT_TEST_DEPLOY_URL:`

<details><summary>정답 보기</summary>

정답: C. 필수 마커는 `BUILD_ID:`, `DEPLOYMENT_ID:`, `NEXT_SUPPORTS_IMMUTABLE_ASSETS:` 세 가지다. `NEXT_TEST_DEPLOY_URL`은 logs 스크립트에 전달되는 환경 변수이지 출력 마커가 아니다.
</details>

## 챕터 요약

- Next.js는 어댑터의 end-to-end 배포 테스트를 위한 테스트 하네스를 제공한다.
- 하네스는 `NEXT_TEST_DEPLOY_SCRIPT_PATH`, `NEXT_TEST_DEPLOY_LOGS_SCRIPT_PATH`, `NEXT_TEST_CLEANUP_SCRIPT_PATH` 세 환경 변수로 스크립트를 찾는다.
- deploy 스크립트는 실패 시 non-zero 코드로 종료하고, `stdout`에는 배포 URL만 출력해야 한다.
- logs 스크립트는 `BUILD_ID:`, `DEPLOYMENT_ID:`, `NEXT_SUPPORTS_IMMUTABLE_ASSETS:` 마커를 반드시 출력해야 한다.
- 세 스크립트는 서로 별도 프로세스이므로 공유할 데이터는 작업 디렉토리의 파일로 영속화해야 한다.
- CI 예시는 build job과 test job(매트릭스 병렬 실행)으로 구성된다.
