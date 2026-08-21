# create-next-app

- 공식 문서: [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- 상위 메뉴: [CLI](./README.md)
- 전체 목차: [Next.js 학습 문서](../../README.md)

## 학습 목표

- `create-next-app`으로 새 Next.js 애플리케이션을 시작하는 기본 사용법을 익힌다.
- 프로젝트 초기화에 자주 쓰이는 주요 옵션(언어, 스타일링, 린터, 패키지 매니저)을 구분한다.
- 공식 예제나 공개 GitHub 저장소를 템플릿으로 사용하는 방법을 이해한다.

## 핵심 개념 및 설명

`create-next-app` CLI는 기본 템플릿이나 공개 GitHub 저장소의 [예제](https://github.com/vercel/next.js/tree/canary/examples)를 사용해 새 Next.js 애플리케이션을 만든다. Next.js를 시작하는 가장 쉬운 방법이다.

기본 사용법은 다음과 같다.

```
pnpm create next-app [project-name] [options]
```

### 옵션 레퍼런스

| 옵션 | 설명 |
| --- | --- |
| `-h` 또는 `--help` | 사용 가능한 모든 옵션을 표시한다 |
| `-v` 또는 `--version` | 버전 번호를 출력한다 |
| `--no-*` | 기본 옵션을 반대로 지정한다. 예: `--no-ts` |
| `--ts` 또는 `--typescript` | TypeScript 프로젝트로 초기화한다 (기본값) |
| `--js` 또는 `--javascript` | JavaScript 프로젝트로 초기화한다 |
| `--tailwind` | Tailwind CSS 설정으로 초기화한다 (기본값) |
| `--react-compiler` | React Compiler를 활성화해 초기화한다 |
| `--eslint` | ESLint 설정으로 초기화한다 |
| `--biome` | Biome 설정으로 초기화한다 |
| `--no-linter` | 린터 설정을 건너뛴다 |
| `--app` | App Router 프로젝트로 초기화한다 |
| `--api` | Route Handler만 있는 프로젝트로 초기화한다 |
| `--src-dir` | `src/` 디렉토리 안에서 초기화한다 |
| `--turbopack` | 생성되는 `package.json`에서 Turbopack을 강제로 활성화한다 (기본적으로 활성화됨) |
| `--webpack` | 생성되는 `package.json`에서 Webpack을 강제로 활성화한다 |
| `--import-alias <alias-to-configure>` | 사용할 import alias를 지정한다 (기본값 `"@/*"`) |
| `--empty` | 빈 프로젝트로 초기화한다 |
| `--use-npm` | npm으로 애플리케이션을 부트스트랩하도록 명시적으로 지정한다 |
| `--use-pnpm` | pnpm으로 애플리케이션을 부트스트랩하도록 명시적으로 지정한다 |
| `--use-yarn` | Yarn으로 애플리케이션을 부트스트랩하도록 명시적으로 지정한다 |
| `--use-bun` | Bun으로 애플리케이션을 부트스트랩하도록 명시적으로 지정한다 |
| `-e` 또는 `--example [name] [github-url]` | 앱을 부트스트랩할 예제를 지정한다 |
| `--example-path <path-to-example>` | 예제 경로를 별도로 지정한다 |
| `--reset-preferences` | 저장된 환경설정을 초기화하도록 명시적으로 지정한다 |
| `--skip-install` | 패키지 설치를 건너뛰도록 명시적으로 지정한다 |
| `--disable-git` | git 초기화를 비활성화하도록 명시적으로 지정한다 |
| `--agents-md` | 코딩 에이전트를 위한 `AGENTS.md`와 `CLAUDE.md`를 포함한다 (기본값) |
| `--yes` | 모든 옵션에 이전 환경설정 또는 기본값을 사용한다 |

### 예제

#### 기본 템플릿 사용

기본 템플릿으로 새 앱을 만들려면 터미널에서 다음 명령을 실행한다.

```
pnpm create next-app
```

설치 중 다음과 같은 프롬프트가 표시된다.

```txt filename="Terminal"
What is your project named? my-app
Would you like to use the recommended Next.js defaults?
    Yes, use recommended defaults - TypeScript, ESLint, Tailwind CSS, App Router, AGENTS.md
    No, reuse previous settings
    No, customize settings - Choose your own preferences
```

`customize settings`를 선택하면 다음 프롬프트가 이어진다.

```txt filename="Terminal"
Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? No / Yes
```

프롬프트에 답하면 `create-next-app`이 프로젝트 이름으로 폴더를 만들고 필요한 의존성을 설치한다.

#### 린터 옵션

- **ESLint**: 전통적이고 가장 널리 쓰이는 JavaScript 린터다. `@next/eslint-plugin-next`의 Next.js 전용 규칙을 포함한다.
- **Biome**: ESLint와 Prettier의 기능을 결합한 빠르고 현대적인 린터 겸 포매터다. 최적의 성능을 위한 Next.js·React 도메인 지원을 내장하고 있다.
- **None**: 린터 설정을 완전히 건너뛴다. 나중에 언제든 린터를 추가할 수 있다.

프롬프트에 답하고 나면 선택한 설정으로 새 프로젝트가 만들어진다.

#### 공식 Next.js 예제 사용

공식 Next.js 예제로 새 앱을 만들려면 `--example` 플래그를 사용한다. 예를 들면 다음과 같다.

```
pnpm create next-app --example [example-name] [your-project-name]
```

사용 가능한 예제 전체 목록과 설정 방법은 [Next.js 저장소](https://github.com/vercel/next.js/tree/canary/examples)에서 볼 수 있다.

#### 공개 GitHub 예제 사용

공개 GitHub 저장소의 예제로 새 앱을 만들려면 `--example` 옵션에 GitHub 저장소 URL을 지정한다. 예를 들면 다음과 같다.

```
pnpm create next-app --example "https://github.com/.../" [your-project-name]
```

## 예제 및 데모 설계

- 데모 가능 여부: 검토 예정
- Phase 1에서는 구현 예정으로 남긴다. Phase 2에서 `create-next-app`의 주요 옵션 조합(TypeScript/Tailwind/ESLint vs Biome/App Router)으로 실제 프로젝트를 생성해 결과 디렉토리 구조를 비교하는 실습을 설계한다.

## 연습 문제

1. `create-next-app`으로 Biome을 린터로 설정하고 싶을 때 사용하는 옵션은?
   - A. `--eslint`
   - B. `--biome`
   - C. `--no-linter`

<details><summary>정답 보기</summary>

정답: B. `--biome`은 Biome 설정으로 프로젝트를 초기화한다. `--eslint`는 ESLint를, `--no-linter`는 린터 설정 자체를 건너뛴다.
</details>

2. 공개 GitHub 저장소의 예제를 템플릿으로 사용해 새 앱을 만들려면 어떻게 해야 하는가?
   - A. `--example` 옵션에 GitHub 저장소 URL을 전달한다
   - B. `--use-npm` 옵션을 사용한다
   - C. `--empty` 옵션을 사용한다

<details><summary>정답 보기</summary>

정답: A. `--example` 옵션은 예제 이름뿐 아니라 공개 GitHub 저장소의 URL도 받을 수 있다.
</details>

## 챕터 요약

- `create-next-app`은 기본 템플릿이나 GitHub 예제로 Next.js 앱을 시작하는 가장 쉬운 방법이다.
- `--ts`/`--js`, `--tailwind`, `--eslint`/`--biome`/`--no-linter` 등으로 언어·스타일링·린터를 지정할 수 있다.
- `--app`, `--src-dir`, `--import-alias` 등은 프로젝트 구조와 관련된 옵션이다.
- `--use-npm`/`--use-pnpm`/`--use-yarn`/`--use-bun`으로 패키지 매니저를 명시적으로 선택할 수 있다.
- `-e` 또는 `--example`로 공식 예제나 공개 GitHub 저장소를 템플릿으로 지정할 수 있다.

---

> 이미지 검증: 브라우저 확장 미연결로 wigolo fetch(images: []) 기준 판단.
