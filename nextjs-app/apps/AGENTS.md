# apps/* 공통 규칙 (zone)

`shell`, `demo-baseline`, `demo-cache-components` 세 앱 모두에 적용된다. 각 앱 고유의 포트·슬러그·역할은 해당 디렉토리의 `AGENTS.md`를 따른다.

## zone 이동/경계 — 세 앱 공통

1. **zone 사이 이동은 상대 경로로만 한다.** 학습자는 항상 셸 도메인에 있다. 절대 URL로 링크하면 주소창이 튀어나가 통합 환상이 깨진다.
2. **zone 경계를 넘는 링크에 `<Link>`를 쓰지 않는다.** `<a>`를 쓴다. `<Link>`의 prefetch와 soft navigation은 zone 경계를 넘지 못한다. 다만 이 설계에서 학습자 이동은 전부 셸 안이라 그럴 일이 거의 없다.
3. **dev 포트를 고정한다.** 셸의 rewrites 목적지가 고정 포트를 가리키므로, 포트가 밀리면 그 zone은 통째로 502가 된다.
4. **학습자 URL에 zone을 넣지 않는다.** 학습자는 `/demo/{문서}/{데모}`, 내부는 `/zone/{슬러그}/…`. 데모가 zone을 옮겨도 주소가 깨지지 않아야 한다 ([ADR 0005](../docs/adr/0005-hide-zone-from-learner-url.md)).

## 데모 zone(`demo-baseline`, `demo-cache-components`) 전용 — 셸에는 해당 없음

5. **데모 앱에 `public/`을 두지 않는다.** `assetPrefix`는 `_next/static`에만 붙어서, `public/`의 파일과 `/_next/image`는 셸의 rewrites에 걸리지 않는다. 이미지는 `unoptimized`로 두거나 셸에 둔다.
6. **데모 앱은 chrome을 그리지 않는다.** 제목·설명·문서 링크는 셸이 그린다. 데모 앱 페이지는 어디서 보든 한 가지 모습이며, `?embed=` 같은 쿼리로 분기하지 않는다 — `searchParams`는 런타임 의존 데이터라 캐싱 데모를 오염시킨다.
7. **데모는 URL에 상태를 담지 않는다.** 항상 초기 상태에서 시작한다. 내부 이동은 iframe 안에서만 일어난다.
8. **캐시 태그와 `cacheLife` 프로파일 이름에 데모 접두사를 붙인다.** 태그는 앱 전역이라 같은 zone의 다른 데모 캐시를 지운다. API는 감싸지 않는다 — 학습자가 진짜 `cacheTag`를 봐야 한다.
9. **데모 화면에 기대와 실제를 함께 표시한다.** 기준 버전이 올라갈 때 회귀를 잡는 장치이자 학습 자료다. 버전을 올릴 때는 문서뿐 아니라 `done` 데모도 재검토 대상이다.
10. **가짜 시뮬레이션(Fake Mocking)을 엄격히 금지하고, 실제 Next.js 파일 시스템 규칙과 라우터를 사용한다.**
    - 단일 컴포넌트 안에서 `useState`로 탭을 갈아 끼우며 라우팅이나 레이아웃을 흉내 내지 않는다.
    - 중첩 레이아웃은 실제 `layout.tsx`와 실제 서브 라우트(`shoes/page.tsx` 등)를 생성하고 실제 Next.js `<Link>` / `useRouter`로 이동한다.
    - `template.tsx`, Route Groups `(folder)`, `loading.tsx`, `error.tsx`, Server Actions 등 Next.js의 모든 기능은 **프레임워크의 실제 파일 컨벤션과 런타임 메커니즘을 그대로 구축**하여 시연한다.
11. **모든 데모는 4단 표준 레이아웃 패턴(fieldset + legend)을 통일하여 구현한다.**
    - `1단 [가이드] DemoGuideCard`: 핵심 원리 한 줄 요약 + 컴팩트 슬림 타임라인 스텝 (이모지 남발 금지).
    - `2단 [실습 화면] fieldset`: 실제 Next.js 컴포넌트 실습 조작 영역 (인위적 내부 용어 뱃지 배제, 깔끔한 서비스 UI).
    - `3단 [검증] ExpectedActualPanel`: 기대 결과(Expected) vs 실제 감지값(Actual) 2단 대조 + 상태 뱃지.
    - `4단 [개념 정리] DemoDeepDiveCard`: 동작 원리, children 주입 구조 및 컴포넌트 트리 다이어그램 해설.
