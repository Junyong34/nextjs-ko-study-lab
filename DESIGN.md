# Next.js Study Lab 디자인 가이드

이 문서는 저장소의 현재 UI 구현에서 추출한 시각 언어와 인터랙션 규칙이다. 새 화면이나 컴포넌트를 만들 때 먼저 이 문서를 확인하고, 공통 스타일은 `@study/ui`, 데모 전용 스타일은 `@study/demo-kit`에서 재사용한다.

## 1. 디자인 방향

이 저장소의 화면은 **학습 콘텐츠가 가장 먼저 보이는 흑백 중심의 기술 문서 UI**다.

- 장식보다 정보 계층과 읽기 흐름을 우선한다.
- Zinc 계열의 중성색으로 대부분의 화면을 구성한다.
- 의미가 있는 상태에만 녹색, 주황색, 장미색 등의 보조색을 쓴다.
- 카드와 컨트롤은 얇은 경계, 작은 그림자, 절제된 라운드를 사용한다.
- 아이콘은 내용을 보조하거나 실제 조작을 제공할 때만 사용한다.
- 라이트 모드와 다크 모드는 같은 구조와 대비 계층을 유지한다.

## 2. 스타일 원본과 적용 범위

| 영역 | 원본 | 적용 대상 |
|---|---|---|
| 전역 Tailwind 설정 | `nextjs-app/apps/shell/src/app/globals.css` | 셸 앱 |
| 공통 색·상태 묶음 | `nextjs-app/packages/ui/src/styles.ts` | 셸 공통 UI |
| 공통 프리미티브 | `nextjs-app/packages/ui/src/primitives/` | 버튼, 입력, 카드, 배지 |
| 문서 조판 | `nextjs-app/packages/docs-render/src/` | Markdown 본문, 코드 블록, 문서 데모 카드 |
| 데모 화면 | `nextjs-app/packages/demo-kit/src/` | 독립 데모 앱 |
| 셸 화면 조립 | `nextjs-app/apps/shell/src/components/` | 랜딩, 학습 기록, 데모 뷰어 |

스타일은 현재 공통 컴포넌트와 `styles.ts`, 같은 유형의 기존 화면, 이 문서, 과거 기획 문서 순으로 참고한다. 기획 문서와 실제 코드가 다르면 현재 구현을 기준으로 한다.

## 3. 색상

### 기본 팔레트

주 팔레트는 Tailwind의 `zinc`다.

| 역할 | 라이트 모드 | 다크 모드 |
|---|---|---|
| 페이지 배경 | `white` | `zinc-950` |
| 카드·패널 | `white`, `zinc-50` | `zinc-900`, `zinc-950` |
| 주요 텍스트 | `zinc-900`, `zinc-950` | `zinc-100`, `zinc-50` |
| 보조 텍스트 | `zinc-500`, `zinc-600` | `zinc-400`, `zinc-300` |
| 약한 텍스트 | `zinc-400` | `zinc-500` |
| 기본 경계 | `zinc-200` | `zinc-800` |
| 강한 경계·hover | `zinc-300`, `zinc-400` | `zinc-700`, `zinc-600` |
| Primary | `zinc-900` 위 흰색 | `zinc-100` 위 `zinc-900` |

`indigo` 토큰은 현재 `globals.css`에서 흑백 계열로 재정의되어 있다. 새로운 보라색 브랜드 컬러처럼 사용하지 않는다.

### 의미 색상

보조색은 상태 전달에만 사용한다.

| 의미 | 색상 계열 | 예시 |
|---|---|---|
| 성공·완료·일치 | `emerald` | 완료 표시, 검증 성공 |
| 대기·주의·준비 중 | `amber` | pending, 안내 |
| 오류·불일치 | `rose` | 실제값 불일치 |
| 파괴적 동작 | `red` | 전체 기록 초기화 |
| 실습 위치 구분 | `blue`, `purple` | Playground, DevTools |

의미 색상은 작은 배지, 아이콘, 얇은 경계, 옅은 배경에 제한한다. 넓은 페이지 배경이나 일반 CTA에는 사용하지 않는다.

## 4. 타이포그래피

현재 실제 구현은 Tailwind의 기본 `font-sans`와 `font-mono`를 사용한다. 과거 설계에 적힌 Pretendard와 JetBrains Mono는 아직 전역 폰트로 연결되어 있지 않으므로 적용된 것으로 가정하지 않는다.

### 계층

| 요소 | 권장 클래스 범위 |
|---|---|
| 랜딩 H1 | `text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight` |
| 화면 H1 | `text-2xl sm:text-3xl font-bold tracking-tight` |
| 섹션 H2 | `text-xl sm:text-2xl` 또는 `text-2xl sm:text-3xl`, `font-bold tracking-tight` |
| 카드 제목 | `text-sm sm:text-base font-bold` |
| 본문·설명 | `text-sm leading-relaxed` |
| 보조 설명 | `text-xs` 또는 `text-sm`, `text-zinc-500/600` |
| Eyebrow | `text-xs font-bold uppercase tracking-wider` |
| 경로·버전·수치 | `font-mono text-[9px]`부터 `text-xs` |

한국어 설명은 `leading-relaxed`를 기본으로 하고, 긴 문장은 필요할 때 `break-keep`을 사용한다. URL과 코드 식별자는 `font-mono`와 `break-all` 또는 가로 스크롤로 처리한다.

## 5. 간격과 크기

간격은 Tailwind의 4px 배수 스케일을 중심으로 사용한다.

- 작은 내부 간격: `gap-1`~`gap-2`, `p-2`~`p-3`
- 카드 내부 간격: `p-4`, `sm:p-5`, 강조 카드 `p-6`
- 컴포넌트 사이: `gap-3`~`gap-6`, `space-y-4`~`space-y-8`
- 페이지 외곽: `px-4 sm:px-6 lg:px-8`, `py-6 sm:py-8 lg:py-10`
- 헤더: `h-14 sm:h-16`
- 전체 셸 최대 폭: `max-w-[90rem]`
- 학습 기록 같은 시스템 화면: `max-w-6xl`
- 데스크톱 문서 트리: 현재 `w-80`

모바일에서 먼저 자연스럽게 쌓고 `sm`, `md`, `lg` 순서로 확장한다. 고정 폭을 사용할 때는 `max-w-*` 또는 viewport 기반 폭을 함께 둬 작은 화면을 넘지 않게 한다.

## 6. 모서리, 경계, 그림자

### 모서리

| 대상 | 반경 |
|---|---|
| 작은 태그·밀집 컨트롤 | `rounded`, `rounded-md` |
| 입력·버튼·필드셋 | `rounded-lg` |
| 일반 카드 | `rounded-xl` |
| 랜딩 강조 카드·빈 상태 | `rounded-2xl` |
| 플로팅 버튼·상태 pill | `rounded-full` |

### 경계와 그림자

- 기본 카드는 `border border-zinc-200 dark:border-zinc-800`을 사용한다.
- 카드 구분은 그림자보다 경계를 우선한다.
- 기본 그림자는 `shadow-xs` 또는 `shadow-2xs`다.
- hover 카드만 `shadow-md`까지 올릴 수 있다.
- 모달·드로어·플로팅 버튼은 계층 분리를 위해 `shadow-xl` 또는 `shadow-2xl`을 쓴다.
- 콘텐츠 카드에 강한 그림자나 두꺼운 경계를 사용하지 않는다.

## 7. 핵심 컴포넌트 패턴

### 버튼

버튼은 의미에 따라 세 종류를 사용한다.

- Primary: 검정 배경, 흰색 글자. 다크 모드에서는 반전한다.
- Outline: 흰색 표면과 중성 경계. 보조 행동에 사용한다.
- Ghost: 배경 없이 시작하고 hover에서만 중성 배경을 보인다.

기본 버튼은 `@study/ui`의 `Button`을 재사용한다. 아이콘 전용 버튼은 `IconButton`을 사용하고 반드시 접근 가능한 이름을 제공한다. 눌림 상태가 있는 버튼은 `aria-pressed`, 현재 항목은 `aria-current` 또는 `aria-selected`로 표현한다.

### 카드

일반 카드는 다음 형태를 유지한다.

```text
rounded-xl + zinc 경계 + white/zinc-900 표면 + p-4~p-5
```

- 클릭 가능한 카드는 전체 카드가 하나의 명확한 링크가 되게 한다.
- hover는 경계 강화, 작은 그림자, 최대 `-translate-y-0.5` 정도로 제한한다.
- 카드 안에는 제목, 짧은 설명, 메타 정보, 행동 순으로 계층을 만든다.
- 같은 상태를 아이콘·텍스트·버튼으로 반복하지 않는다.

### 입력과 필터

- 입력은 `zinc-50/80` 배경, `zinc-200` 경계, `rounded-lg`를 기본으로 한다.
- focus에서는 경계를 `zinc-900`으로 강화하고 배경을 흰색으로 바꾼다.
- 선택 필터는 세그먼트 또는 칩 형태로 만들고 선택 상태를 검정 배경으로 명확히 표시한다.
- 필터 그룹에는 화면에 보이는 짧은 라벨 또는 접근 가능한 이름을 제공한다.
- 빈 결과에는 점선 경계, 약한 배경, 해결 가능한 다음 행동을 보여준다.

### 배지와 상태

- 상태 pill: `rounded-full`, `px-2.5 py-0.5`, `text-xs font-semibold`
- 작은 태그: `rounded`, `text-[9px]`~`text-[10px]`, 필요 시 `font-mono`
- 상태는 색만으로 전달하지 않고 텍스트를 함께 제공한다.
- 경로, 버전, 단계 번호는 작은 monospace 배지로 구분한다.

### 아이콘

- 아이콘 라이브러리는 `lucide-react`를 사용한다.
- 일반 크기는 `h-3.5 w-3.5` 또는 `h-4 w-4`, 강조 아이콘은 `h-5 w-5`다.
- 장식 아이콘은 `aria-hidden="true"`로 숨긴다.
- 클릭되지 않는 아이콘이 이미 텍스트와 버튼으로 표현된 상태를 반복하지 않게 한다.
- 아이콘만 있는 버튼에는 `aria-label`이 필요하다.

## 8. 화면별 구성

### 셸

- 헤더는 sticky이며 반투명 배경과 `backdrop-blur-md`를 사용한다.
- 페이지 외곽은 최대 `90rem`의 넓은 컨테이너다.
- 문서 화면은 좌측 트리, 본문, 우측 목차 구조다.
- 모바일에서는 트리를 드로어로 전환하고 우측 목차를 숨긴다.
- 푸터는 옅은 `zinc-50/60` 표면과 상단 경계로 본문과 구분한다.

### 학습 문서

- Markdown 본문은 `prose prose-zinc dark:prose-invert`를 사용한다.
- 문단은 작은 본문 크기와 넉넉한 행간을 유지한다.
- 코드 블록은 `#24292e` 계열의 어두운 표면, monospace, 가로 스크롤을 사용한다.
- 인라인 코드는 옅은 zinc 배경과 작은 라운드를 사용한다.
- 문서의 완료 컨트롤은 본문과 분리된 실제 버튼이어야 한다.

### 랜딩과 색인

- 랜딩 히어로는 `rounded-2xl`, 중성 그라데이션, 옅은 blur 장식을 허용한다.
- 섹션 제목은 영어 eyebrow와 한국어 제목의 2단 구조를 주로 사용한다.
- 카드 그리드는 모바일 1열에서 시작해 콘텐츠에 따라 2~3열로 확장한다.
- 색인 화면은 검색과 필터를 먼저 보여주고 결과 카드가 그 아래에 이어진다.

### 데모

- 데모 앱은 셸 chrome 없이 `DemoContainer` 안에서 독립적으로 시작한다.
- 기본 바탕과 텍스트는 셸과 같은 zinc 계열을 사용한다.
- 표준 데모는 `[가이드]`, `[실습 화면]`, `[검증]`, `[개념 정리]`의 4단 fieldset 구조를 따른다.
- 각 fieldset은 `rounded-lg`, 얇은 경계, `p-4 sm:p-5`, 작은 legend를 사용한다.
- 검증 성공은 emerald, 불일치는 rose, 대기는 zinc로 구분한다.

## 9. 인터랙션과 모션

- 기본 전환은 `transition`, `transition-colors`, `transition-all`을 사용한다.
- 구조가 이동하는 드로어는 `duration-200 ease-in-out`을 사용한다.
- hover 이동은 카드 `-translate-y-0.5`~`-translate-y-1`, 화살표 `translate-x-0.5` 범위로 제한한다.
- active 축소는 플로팅 버튼이나 리셋 버튼처럼 즉각적인 조작에만 `scale-95`를 사용한다.
- 로딩은 spinner 회전으로 표시하고 버튼을 중복 실행할 수 없게 한다.
- 인터랙션은 색 변화만이 아니라 경계, 배경, 텍스트 굵기 중 하나를 함께 바꾼다.

## 10. 다크 모드

모든 새 UI는 같은 변경에서 다크 모드를 함께 구현한다.

- `white` 표면은 주로 `dark:bg-zinc-900` 또는 `dark:bg-zinc-950`으로 대응한다.
- `zinc-200` 경계는 `dark:border-zinc-800`으로 대응한다.
- 주요 텍스트는 `dark:text-zinc-100`, 보조 텍스트는 `dark:text-zinc-400`을 사용한다.
- Primary 버튼은 다크 모드에서 밝은 표면과 어두운 글자로 반전한다.
- 상태 색상은 `*-950` 배경과 `*-300` 텍스트 조합을 우선한다.
- 다크 모드에서 그림자만으로 계층을 구분하지 않고 경계를 유지한다.

## 11. 접근성

- 의미 구조는 `header`, `nav`, `main`, `aside`, `section`, `fieldset`을 우선한다.
- 탭은 `role="tablist"`, `role="tab"`, `aria-selected`를 함께 사용한다.
- 토글 버튼은 `aria-pressed`를 사용한다.
- 모달과 드로어는 `role="dialog"`, `aria-modal`, 접근 가능한 제목을 제공한다.
- 오버레이는 `Escape`로 닫히고, 포커스를 내부에 가두며, 닫힌 뒤 트리거로 복귀시킨다.
- focus 스타일은 `focus-visible`에서 2px outline과 offset으로 분명하게 보인다.
- 상태 변화와 검색 결과 수는 필요할 때 `role="status"` 또는 `aria-live`로 알린다.
- 장식 SVG는 접근성 트리에서 숨기고, 상태를 색이나 아이콘 하나에만 의존하지 않는다.

## 12. 새 UI 작업 체크리스트

- [ ] zinc 중심 팔레트와 의미 색상 규칙을 지켰는가?
- [ ] 라이트·다크 모드가 같은 정보 계층을 가지는가?
- [ ] 기존 `@study/ui` 또는 `@study/demo-kit` 컴포넌트를 먼저 확인했는가?
- [ ] 모바일 1열에서 시작해 필요한 지점에서만 확장하는가?
- [ ] hover, focus, active, disabled 상태가 구분되는가?
- [ ] 클릭되지 않는 장식과 중복 상태 표현을 제거했는가?
- [ ] 아이콘 버튼, 탭, 토글, dialog에 올바른 접근성 속성이 있는가?
- [ ] 데모 화면이라면 4단 fieldset 구조를 따르는가?
- [ ] Tailwind 클래스가 외부 패키지에 있다면 앱의 `@source`가 해당 패키지를 포함하는가?
- [ ] 실제 브라우저에서 데스크톱·모바일·다크 모드를 확인했는가?

## 13. 현재 구현에서 주의할 점

- `nextjs-app/docs/06-ui-and-screen-design.md`의 일부 수치와 폰트 계획은 현재 코드와 다르다. 이 문서는 실제 코드에서 확인된 값을 기록한다.
- 공통 색상은 `styles.ts`에 일부 모였지만, 화면별 형태와 밀도는 아직 로컬 Tailwind 클래스가 많다. 시각적 통일을 이유로 기존 변형을 한 번에 합치지 않는다.
- 새로운 디자인 토큰 이름을 임의로 추가하기보다 기존 Tailwind zinc 팔레트와 공통 surface 상수를 재사용한다.
- 데모 앱은 `@study/ui`에 의존하지 않고 `@study/demo-kit`만 사용한다.
