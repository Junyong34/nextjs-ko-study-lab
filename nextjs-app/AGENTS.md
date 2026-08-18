# nextjs-app 작업 규칙 (Phase 2)

Next.js 학습 데모 사이트가 들어설 자리다. **설계는 완료됐고 실행 코드는 아직 없다.** 착수 조건이 충족되기 전까지 코드를 만들지 않는다.

## 착수 조건

[`nextjs-docs/PROGRESS.md`](../nextjs-docs/PROGRESS.md)의 항목이 대부분 "완료"가 되어야 한다 ([루트 Phase Gate](../AGENTS.md#phase-gate) 참고).

## 설계 문서를 먼저 읽는다

이 디렉토리에서 작업하기 전에 [`docs/`](./docs/README.md)의 설계 문서와 ADR을 읽는다. **아래 규칙은 요약이며, 근거와 세부는 설계 문서에 있다.**

- [01. 프로젝트 구성 방법 및 절차](./docs/01-project-setup.md)
- [02. 모노레포 구성 방식 조사와 선택](./docs/02-monorepo-options.md)
- [03. 결합 구조 설계](./docs/03-composition-architecture.md)
- [용어집 `CONTEXT.md`](./CONTEXT.md) — zone, 셸, 설정 축, 데모 지시자, 기준 버전

## 스택

- Next.js App Router **16.3.1** + React 19 + TypeScript + Tailwind CSS
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

1. **버전을 `package.json`에 직접 적지 않는다.** `next`·`react`·`react-dom`은 반드시 `"catalog:"`로 참조한다. 기준 버전이 선언되는 곳은 루트 `pnpm-workspace.yaml` 하나뿐이다.
2. **rewrites 목적지를 하드코딩하지 않는다.** 반드시 환경변수(`ZONE_*_URL`)로 둔다. 로컬↔배포 전환이 이것 하나에 달려 있다.
3. **zone 사이 이동은 상대 경로로만 한다.** 학습자는 항상 셸 도메인에 있다. 절대 URL로 링크하면 주소창이 튀어나가 통합 환상이 깨진다.
4. **zone 경계를 넘는 링크에 `<Link>`를 쓰지 않는다.** `<a>`를 쓴다. `<Link>`의 prefetch와 soft navigation은 zone 경계를 넘지 못한다.
5. **dev 포트를 고정한다.** 셸의 rewrites 목적지가 고정 포트를 가리키므로, 포트가 밀리면 그 zone은 통째로 502가 된다.
6. **셸에는 데모를 두지 않는다.** 셸은 문서 렌더링과 라우팅만 책임진다.
7. **zone을 추가할 때는** [01. 구성 절차 4절](./docs/01-project-setup.md)의 체크리스트를 그대로 따른다. 항목 하나만 빠져도 그 zone은 사이트에서 보이지 않는다.

## nextjs-docs 참조

이 사이트는 [`nextjs-docs/`](../nextjs-docs/)의 md를 화면에 그린다. 문서는 **단일 원본**이며 이쪽에 사본을 두지 않는다.

- **배포 시 파일 추적**: 셸의 `next.config.ts`에 `outputFileTracingRoot`를 워크스페이스 루트로 명시한다. 빠뜨리면 배포 산출물에서 md가 통째로 누락되는데, **로컬에서는 항상 정상 동작한다.**
- **이미지 자산 서빙**: `nextjs-docs/*/assets/*.webp`는 md의 상대 경로만으로 브라우저에서 그려지지 않는다. `public/`으로 복사하는 빌드 스크립트나 해당 경로를 스트리밍하는 라우트 핸들러가 필요하다.
- **캐시 무효화**: `nextjs-docs`는 `@study/docs` 워크스페이스 패키지이며 build 태스크를 갖는다. 이걸 없애면 md를 고쳐도 셸이 캐시된 옛 결과를 내놓는다.

상세는 [03. 결합 구조 설계 6절 함정 목록](./docs/03-composition-architecture.md)에 있다.

## 이미지 포맷

`nextjs-docs`의 캡쳐 이미지는 PNG가 아니라 무손실 WebP(`.webp`)로 저장돼 있다. 이 앱에서 새로 캡쳐하거나 처리하는 이미지도 동일하게 WebP를 쓴다.
