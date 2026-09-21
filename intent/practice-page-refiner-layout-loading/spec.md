Spec: 실제 레이아웃 생명주기와 중첩 로딩 경계 관찰
Intent: ./intent.md
Author: Codex
Status: done
Approval: 2026-09-21 현재 대화에서 사용자가 제시한 intent/spec/plan에 “승인”으로 명시 승인. main 작업·커밋만 수행하며 PR/push는 하지 않는다. 같은 날 이어받은 세션이 구현 검증·버그 수정·done 전환까지 완료(상세는 plan.md).

## Requirements

1. 두 페이지 모두 DemoContainer → DemoGuideCard → DemoPlaygroundCard → ExpectedActualPanel → DemoDeepDiveCard 구성을 유지하고 DemoResetButton을 제공한다.
2. 상품은 MOCK_PRODUCTS를 재사용하고 상품 표시에는 ProductCard의 재사용 적합성을 확인한다. 장바구니·배송 흐름은 추가하지 않으므로 CartSummary·DeliveryTracker는 사용하지 않는다.
3. 상태 보존 데모는 실제 layout.tsx 아래 Client Component가 검색어와 관측 기준값을 보관한다. electronics/fashion 같은 두 실제 하위 page와 Link로 이동하며 usePathname의 실제 경로 및 화면의 카테고리 변경을 보인다.
4. 상태 보존 성공은 사용자가 기록한 기준 입력, 서로 다른 실제 경로 방문, 동일한 레이아웃 마운트 인스턴스, 현재 입력 일치가 모두 충족될 때만 인정한다. 이동 전은 대기/미충족이며 이동 후 입력을 바꾸면 불일치를 확인할 수 있다.
5. 중첩 로딩은 실제 상위·하위 loading.tsx 경계를 만든다. 지연은 페이지의 서버 비동기 작업에 두고 fallback 교체는 Next.js가 수행한다. fallback과 완료 컴포넌트는 실제 마운트 관측만 보고한다.
6. 로딩 중 상위 컨트롤 조작을 기록하고, 해당 요청의 fallback 관측→상위 조작→완료 흐름을 검증한다. 단순히 완료 페이지가 보인다는 이유만으로 fallback을 봤다고 간주하지 않는다.
7. prefetch/Router Cache로 fallback이 생략될 수 있음을 설명한다. 반복 관찰은 데모 내부의 새로운 실행 경로 또는 명시적 초기 진입으로 확보하며, 학습자용 셸 URL에는 실행 상태를 넣지 않는다.
8. 초기화는 이전 관측·입력·검증 결과를 비우고 같은 절차를 재실행 가능하게 한다. 새로고침 뒤 메모리 입력이 유지되는 영구 저장을 약속하지 않는다.
9. 가이드의 버튼명·입력명은 실제 UI와 일치해야 한다. 접근 가능한 label/상태 텍스트를 제공하고 모바일에서 가로 넘침이 없어야 한다.

## Design

상태 보존 데모의 서버 layout은 클라이언트 실습 프레임과 children을 조립한다. children에는 실제 페이지가 들어오고, 프레임이 검색어·기준값·경로 전이를 관찰해 검증 패널에 전달한다. 지역 상태는 레이아웃이 유지되는 사실을 관측하기 위한 것이며 라우트를 대신하지 않는다.

로딩 데모의 상위 프레임은 guide/practice/verification/concept를 유지한다. catalog/loading.tsx와 그 하위 상품 상세의 loading.tsx를 구분하고 각 페이지가 실제 서버 지연 뒤 상품 콘텐츠를 반환한다. 카탈로그 레이아웃과 상세 경계의 위치를 코드 트리로 설명한다. 실행별 경로/식별자로 이전 fallback 및 완료 이력이 새 실행의 증거가 되지 않게 한다.

## Non-goals

새 zone, 새 dependency, 캐시 전략 전면 개편, 다른 데모 수정, 실제 상품 API·결제·영구 저장, 배포.

## Acceptance criteria

- [x] 파일 시스템 layout/loading 경계와 실제 Link 이동을 사용한다.
- [x] 경로 변경 전후 입력 보존 및 잘못된 기대의 실패를 관찰한다.
- [x] 상위/하위 fallback과 실제 완료, 로딩 중 상위 UI 조작을 관찰한다.
- [x] 캐시로 fallback을 못 본 경우 검증이 자동 성공하지 않는다.
- [x] 초기화·재실행 및 직접 진입·셸 iframe 동작을 확인한다.
- [x] 단위·브라우저·타입·빌드·매니페스트 검사 및 오류 점검 결과를 기록한다.
- [x] 검증 완료 후 두 등록 항목만 done으로 전환한다.
