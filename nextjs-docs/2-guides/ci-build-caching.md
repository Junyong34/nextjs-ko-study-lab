# CI Build Caching

- 공식 문서: [CI Build Caching](https://nextjs.org/docs/app/guides/ci-build-caching)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- `.next/cache`를 CI 빌드 사이에 유지해야 하는 이유를 설명한다.
- 사용하는 CI 제공자에 맞춰 Next.js 빌드 캐시 경로를 설정한다.
- 의존성과 소스 변경을 반영하는 캐시 키와 복원 키를 설계한다.
- 캐시가 복원되지 않을 때 설정 파일의 경로와 실행 순서를 점검한다.

## 핵심 개념 및 설명

Next.js는 빌드 성능을 높이기 위해 빌드 사이에 공유할 데이터를 `.next/cache`에 저장한다. 로컬에서는 이 디렉터리가 자연스럽게 남지만, CI 실행 환경은 작업마다 초기화되는 경우가 많다. CI 워크플로가 `.next/cache`를 복원하고 다시 저장하도록 설정해야 이전 빌드의 결과를 재사용할 수 있다.

> `.next/cache`를 빌드 사이에 유지하지 않으면 [No Cache Detected](https://nextjs.org/docs/messages/no-cache) 오류가 나타날 수 있다.

### Vercel

Vercel은 Next.js 캐싱을 자동으로 설정하므로 별도 작업이 필요 없다. Vercel에서 Turborepo를 사용한다면 [Turborepo 문서](https://vercel.com/docs/monorepos/turborepo)를 참고한다.

### CircleCI

`.circleci/config.yml`의 `save_cache` 경로에 `.next/cache`를 추가한다.

```yaml
steps:
  - save_cache:
      key: dependency-cache-{{ checksum "yarn.lock" }}
      paths:
        - ./node_modules
        - ./.next/cache
```

`save_cache` 설정이 없다면 [CircleCI 빌드 캐싱 문서](https://circleci.com/docs/2.0/caching/)에 따라 복원·저장 단계를 먼저 구성한다.

### Travis CI

`.travis.yml`의 `cache.directories`에 `.next/cache`를 추가하거나 기존 설정과 합친다.

```yaml
cache:
  directories:
    - $HOME/.cache/yarn
    - node_modules
    - .next/cache
```

### GitLab CI

`.gitlab-ci.yml`에 브랜치별 키와 캐시 경로를 추가하거나 기존 설정과 합친다.

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .next/cache/
```

### Netlify CI

[Netlify Plugins](https://www.netlify.com/products/build/plugins/)에서 [`@netlify/plugin-nextjs`](https://www.npmjs.com/package/@netlify/plugin-nextjs)를 사용한다.

### AWS CodeBuild

`buildspec.yml`의 캐시 경로에 의존성과 Next.js 캐시를 추가한다.

```yaml
cache:
  paths:
    - 'node_modules/**/*' # yarn 또는 npm install을 빠르게 하기 위해 의존성을 캐시한다
    - '.next/cache/**/*' # Next.js 애플리케이션 재빌드를 빠르게 한다
```

### GitHub Actions

GitHub의 [`actions/cache`](https://github.com/actions/cache)를 사용하는 단계를 워크플로에 추가한다. 패키지 lockfile과 소스 파일 해시를 키에 넣어 변경 범위를 구분한다. 소스만 바뀐 경우에는 `restore-keys`로 같은 의존성 캐시를 복원한다.

```yaml
uses: actions/cache@v4
with:
  # yarn, bun 등은 actions/cache 예제나 actions/setup-node의 캐싱을 참고한다.
  path: |
    ~/.npm
    ${{ github.workspace }}/.next/cache
  # 패키지나 소스가 바뀌면 새 캐시 키를 만든다.
  key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
  # 소스만 바뀌었다면 같은 의존성 키의 이전 캐시에서 복원한다.
  restore-keys: |
    ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

### Bitbucket Pipelines

`bitbucket-pipelines.yml`의 최상위, 즉 `pipelines`와 같은 수준에 사용자 정의 캐시를 선언한다.

```yaml
definitions:
  caches:
    nextcache: .next/cache
```

이후 pipeline `step`의 `caches`에서 참조한다.

```yaml
- step:
    name: your_step_name
    caches:
      - node
      - nextcache
```

### Heroku

Heroku의 [custom cache](https://devcenter.heroku.com/articles/nodejs-support#custom-caching)를 사용해 최상위 `package.json`에 `cacheDirectories`를 추가한다.

```json
"cacheDirectories": [".next/cache"]
```

### Azure Pipelines

Azure Pipelines의 [Cache task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/cache)를 `next build` 실행 단계보다 앞에 둔다.

```yaml
- task: Cache@2
  displayName: 'Cache .next/cache'
  inputs:
    key: next | $(Agent.OS) | yarn.lock
    path: '$(System.DefaultWorkingDirectory)/.next/cache'
```

### Jenkins Pipeline

Jenkins의 [Job Cacher](https://www.jenkins.io/doc/pipeline/steps/jobcacher/) 플러그인을 사용한다. 의존성 설치 단계는 `package-lock.json`, 빌드 단계는 현재 `$GIT_COMMIT`을 기록한 파일로 캐시 유효성을 판단한다.

```groovy
stage("Restore npm packages") {
    steps {
        writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

        cache(caches: [
            arbitraryFileCache(
                path: "node_modules",
                includes: "**/*",
                cacheValidityDecidingFile: "package-lock.json"
            )
        ]) {
            sh "npm install"
        }
    }
}

stage("Build") {
    steps {
        writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

        cache(caches: [
            arbitraryFileCache(
                path: ".next/cache",
                includes: "**/*",
                cacheValidityDecidingFile: "next-lock.cache"
            )
        ]) {
            sh "npm run build"
        }
    }
}
```

### 캐시 키와 실행 순서 점검

제공자마다 문법은 다르지만 확인할 원칙은 같다.

- 복원 단계가 `next build`보다 먼저 실행되는지 확인한다.
- 저장 대상에 프로젝트 루트 기준 `.next/cache`가 포함되는지 확인한다.
- lockfile 변경 시 이전 의존성 캐시를 그대로 쓰지 않도록 키에 lockfile 해시를 반영한다.
- 소스만 변경된 빌드에서는 이전 `.next/cache`를 활용할 수 있도록 복원 키의 범위를 설계한다.
- CI 로그에서 cache hit 여부와 실제 복원·저장 경로를 확인한다.

## 예제 및 데모 설계

- 데모 가능 여부: Phase 2에서 구현 예정
- 데모 목적: 동일한 Next.js 프로젝트를 cold cache와 warm cache로 빌드해 캐시 복원 여부와 시간을 비교한다.
- 사용자가 확인할 화면과 상호작용:
  - CI 로그에서 `.next/cache` 복원 전후의 `next build` 시간을 비교한다.
  - 소스만 변경했을 때 복원 키가 이전 캐시를 찾는지 확인한다.
  - lockfile을 변경했을 때 새 키가 생성되어 의존성 캐시가 분리되는지 확인한다.

## 연습 문제

1. CI에서 빌드 사이에 유지해야 하는 Next.js 캐시 경로는 무엇인가?

   - A. `.next/server`
   - B. `.next/cache`
   - C. `public/cache`
   - D. `.vercel/cache`

   <details><summary>정답 보기</summary>

   정답: B. Next.js는 빌드 재사용 데이터를 `.next/cache`에 저장한다.

   </details>

2. GitHub Actions 예제에서 lockfile 해시와 소스 해시를 모두 캐시 키에 넣는 이유는 무엇인가?

   - A. 모든 빌드가 같은 캐시를 사용하게 한다.
   - B. 의존성과 소스 변경 범위를 구분해 적절한 캐시를 선택한다.
   - C. `.next/cache` 저장을 비활성화한다.
   - D. 운영 응답의 CDN TTL을 설정한다.

   <details><summary>정답 보기</summary>

   정답: B. 변경 입력을 키에 반영하고 복원 키로 재사용 가능한 이전 결과를 찾는다.

   </details>

3. 캐시 설정이 있는데도 효과가 없을 때 먼저 확인할 항목을 모두 고른다.

   - A. 복원 단계가 `next build`보다 앞에 있는가?
   - B. 경로가 프로젝트의 `.next/cache`를 가리키는가?
   - C. CI 로그에 cache hit가 기록되는가?
   - D. 운영 CDN이 `_rsc`를 보존하는가?

   <details><summary>정답 보기</summary>

   정답: A, B, C. 이 문서의 CI 빌드 캐시는 운영 응답 CDN 설정과 별개다.

   </details>

## 챕터 요약

- Next.js는 빌드 사이에 재사용할 데이터를 `.next/cache`에 저장한다.
- CI가 매번 초기화된다면 캐시 복원과 저장 단계를 워크플로에 명시해야 한다.
- 제공자별 문법은 달라도 핵심 대상 경로는 `.next/cache`로 같다.
- 캐시 키에는 lockfile과 소스 변경을 반영하고 복원 키로 재사용 범위를 조정한다.
- 캐시 효과가 없으면 빌드 전 복원 여부, 실제 경로, CI 로그의 hit 여부를 확인한다.
