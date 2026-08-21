# nextjs-app 작업 규칙 (Phase 2)

Next.js 학습 데모 사이트가 들어설 자리다. **착수 조건이 충족되어 Phase 2가 시작됐다.** 셸(`apps/shell`)과 개념 증명(PoC) 데모 2개(`demo-baseline`의 Server Actions, `demo-cache-components`의 `use cache`)가 구현되어 `status: done`으로 공개돼 있다. 지금은 [05. 남은 설계 질문](./docs/05-open-questions.md) B절(대량 확장 전 단계)이 다음 작업이다.

## 착수 조건 — 충족됨

[`nextjs-docs/PROGRESS.md`](../nextjs-docs/PROGRESS.md)의 항목이 194건 전부 "완료"다 ([루트 Phase Gate](../AGENTS.md#phase-gate) 참고). 개념 증명(PoC, 셸 + 데모 2개, 스모크 배포 없이 로컬 기준)도 끝났다.

## 설계 문서를 먼저 읽는다

이 디렉토리에서 작업하기 전에 [`docs/`](./docs/README.md)의 설계 문서와 ADR을 읽는다. **아래 규칙은 요약이며, 근거와 세부는 설계 문서에 있다.**

- [01. 프로젝트 구성 방법 및 절차](./docs/01-project-setup.md)
- [02. 모노레포 구성 방식 조사와 선택](./docs/02-monorepo-options.md)
- [03. 결합 구조 설계](./docs/03-composition-architecture.md)
- [04. 설계 실현 가능성 검증](./docs/04-feasibility-verification.md) — 01~03을 `next@16.3.1` 1차 출처와 대조한 기록. 지적 사항은 01~03에 반영 완료
- [06. 화면 구성과 UI 설계](./docs/06-ui-and-screen-design.md) — 페이지 타입 5종, 헤더·검색 UI, UI 기반, 디자인 토큰
- [용어집 `CONTEXT.md`](./CONTEXT.md) — zone, 셸, 설정 축, 데모 지시자, 기준 버전

## 스택

- Next.js App Router **16.3.1** + React 19 + TypeScript + Tailwind CSS v4
- UI는 **shadcn/ui**를 소스로 복사해 쓴다. 문서 프레임워크(Nextra 등)는 쓰지 않는다 ([ADR 0006](./docs/adr/0006-shadcn-ui-as-ui-foundation.md))
- pnpm workspaces + Turborepo ([ADR 0002](./docs/adr/0002-pnpm-turborepo-catalog-pinning.md))
- 워크스페이스 루트는 **저장소 루트**다. 이 디렉토리가 아니다

## 구조

앱은 **전역 설정 충돌 축**으로 나눈다. 학습 카테고리로 나누지 않는다 ([ADR 0001](./docs/adr/0001-config-axis-as-app-boundary.md)).

```
nextjs-app/
├─ apps/       # zone — 각자 next.config를 온전히 소유하는 독립 Next.js 앱
└─ packages/   # zone들이 공유하는 코드
```

zone 배분과 포트는 [03. 결합 구조 설계 2절](./docs/03-composition-architecture.md)의 표를 따른다.

## 지켜야 할 것

1. **버전을 `package.json`에 직접 적지 않는다.** `next`·`react`·`react-dom`은 반드시 `"catalog:"`로 참조한다. 기준 버전이 선언되는 곳은 루트 `pnpm-workspace.yaml` 하나뿐이며, 그 값은 `nextjs-docs/README.md`의 학습 기준 버전과 **항상 같아야 한다** (현재 `16.3.1`). 올릴 때는 두 곳을 같은 커밋에서 고친다.
2. **rewrites 목적지를 하드코딩하지 않는다.** 반드시 환경변수(`ZONE_*_URL`)로 둔다. 로컬↔배포 전환이 이것 하나에 달려 있다.
3. **zone 사이 이동은 상대 경로로만 한다.** 학습자는 항상 셸 도메인에 있다. 절대 URL로 링크하면 주소창이 튀어나가 통합 환상이 깨진다.
4. **zone 경계를 넘는 링크에 `<Link>`를 쓰지 않는다.** `<a>`를 쓴다. `<Link>`의 prefetch와 soft navigation은 zone 경계를 넘지 못한다. 다만 이 설계에서 학습자 이동은 전부 셸 안이라 그럴 일이 거의 없다.
5. **dev 포트를 고정한다.** 셸의 rewrites 목적지가 고정 포트를 가리키므로, 포트가 밀리면 그 zone은 통째로 502가 된다.
6. **셸에는 데모를 두지 않는다.** 셸은 문서 렌더링과 라우팅만 책임진다.
7. **zone을 추가할 때는** [01. 구성 절차 4절](./docs/01-project-setup.md)의 체크리스트를 그대로 따른다. 항목 하나만 빠져도 그 zone은 사이트에서 보이지 않는다.
8. **`create-next-app`에 `--turbopack`을 넘기지 않는다.** 16.3.1에는 그런 플래그가 없고, 이 CLI는 모르는 플래그를 조용히 무시한다. Turbopack은 기본값이다.
9. **데모 앱에 `public/`을 두지 않는다.** `assetPrefix`는 `_next/static`에만 붙어서, `public/`의 파일과 `/_next/image`는 셸의 rewrites에 걸리지 않는다. 이미지는 `unoptimized`로 두거나 셸에 둔다.
10. **데모의 존재는 `demos.yaml`이 정한다.** md의 `demo` 코드펜스는 **본문 링크 위치만** 정한다. 지시자를 데모 목록으로 쓰지 않는다 ([ADR 0004](./docs/adr/0004-demo-list-as-source-of-truth.md)).
11. **학습자 URL에 zone을 넣지 않는다.** 학습자는 `/demo/{문서}/{데모}`, 내부는 `/zone/{슬러그}/…`. 데모가 zone을 옮겨도 주소가 깨지지 않아야 한다 ([ADR 0005](./docs/adr/0005-hide-zone-from-learner-url.md)).
12. **데모 앱은 chrome을 그리지 않는다.** 제목·설명·문서 링크는 셸이 그린다. 데모 앱 페이지는 어디서 보든 한 가지 모습이며, `?embed=` 같은 쿼리로 분기하지 않는다 — `searchParams`는 런타임 의존 데이터라 캐싱 데모를 오염시킨다.
13. **데모는 URL에 상태를 담지 않는다.** 항상 초기 상태에서 시작한다. 내부 이동은 iframe 안에서만 일어난다.
14. **캐시 태그와 `cacheLife` 프로파일 이름에 데모 접두사를 붙인다.** 태그는 앱 전역이라 같은 zone의 다른 데모 캐시를 지운다. API는 감싸지 않는다 — 학습자가 진짜 `cacheTag`를 봐야 한다.
15. **데모 화면에 기대와 실제를 함께 표시한다.** 기준 버전이 올라갈 때 회귀를 잡는 장치이자 학습 자료다. 버전을 올릴 때는 문서뿐 아니라 `done` 데모도 재검토 대상이다.
16. **문서 본문에 데모를 심지 않는다.** 코드펜스가 그리는 것은 iframe이 아니라 **링크 카드**다. iframe이 있는 곳은 데모 독립 열람 하나뿐이고, 랜딩 히어로의 대표 데모만 예외다 ([06. 3-2](./docs/06-ui-and-screen-design.md), [ADR 0006](./docs/adr/0006-shadcn-ui-as-ui-foundation.md)).
17. **`@study/ui`는 셸 전용이다.** 데모 앱이 여기 의존하면 헤더·검색 팔레트까지 데모 앱 빌드에 끌려 들어온다. 데모 공통 UI는 `@study/demo-kit`에 둔다 ([06. 7-4](./docs/06-ui-and-screen-design.md)).
18. **셸의 스토리지 키에도 접두사를 붙인다.** 모든 zone이 동일 오리진이라 데모가 셸의 상태를 덮어쓸 수 있다. 셸은 `study_*`(테마는 `study_theme`), 데모 앱은 `demo_{슬러그}_*`를 쓴다 ([06. 8-2](./docs/06-ui-and-screen-design.md), [03. 6-5](./docs/03-composition-architecture.md)).
19. **화면 라벨과 도메인 용어를 섞지 않는다.** 화면에는 `예제`라고 쓰지만 URL·파일·설계 문서의 용어는 `데모`다. 코드에서 `example`로 바꿔 쓰지 않는다 ([06. 6-2](./docs/06-ui-and-screen-design.md)).
20. **디자인 토큰 이름을 새로 만들지 않는다.** shadcn의 Tailwind v4 규약(`@theme inline` + oklch)을 그대로 쓴다 ([06. 8-1](./docs/06-ui-and-screen-design.md)).

`next dev`가 zone의 `AGENTS.md`·`CLAUDE.md`에 `nextjs-agent-rules` 블록을 삽입하는 것은 **정상 동작이다.** 마커 바깥 내용은 보존되니 그대로 커밋한다 ([01. 구성 절차 3-3 ⑥](./docs/01-project-setup.md)).

## nextjs-docs 참조

이 사이트는 [`nextjs-docs/`](../nextjs-docs/)의 md를 화면에 그린다. 문서는 **단일 원본**이며 이쪽에 사본을 두지 않는다.

- **배포 시 파일 추적**: 셸의 `next.config.ts`에 `outputFileTracingRoot`를 워크스페이스 루트로 명시한다. 빠뜨리면 배포 산출물에서 md가 통째로 누락되는데, **로컬에서는 항상 정상 동작한다.**
- **이미지 자산 서빙**: `nextjs-docs/*/assets/*.webp`는 md의 상대 경로만으로 브라우저에서 그려지지 않는다. `public/`으로 복사하는 빌드 스크립트나 해당 경로를 스트리밍하는 라우트 핸들러가 필요하다.
- **캐시 무효화**: `nextjs-docs`는 `@study/docs` 워크스페이스 패키지이며 build 태스크를 갖는다. 이걸 없애면 md를 고쳐도 셸이 캐시된 옛 결과를 내놓는다.

상세는 [03. 결합 구조 설계 6절 함정 목록](./docs/03-composition-architecture.md)에 있다.

## 이미지 포맷

`nextjs-docs`의 캡쳐 이미지는 PNG가 아니라 무손실 WebP(`.webp`)로 저장돼 있다. 이 앱에서 새로 캡쳐하거나 처리하는 이미지도 동일하게 WebP를 쓴다.
