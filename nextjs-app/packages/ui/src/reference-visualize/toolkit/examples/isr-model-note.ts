/**
 * @fileoverview examples/isr-model-note.ts
 * ISR 데모가 어느 렌더링 모델을 그리는지 밝히는 고정 노트.
 * 동작 서술은 Next 16에서도 유효하지만, 이 화면은 cacheComponents를 켜지 않은 이전 모델이다.
 */

import type { NoteItem } from '../components/structure';

/** 어느 렌더링 모델의 이야기인지 항상 밝혀 둔다 */
export const ISR_MODEL_NOTE: NoteItem = {
  id: 'model',
  label: '이전 모델 — cacheComponents 미사용',
  meta: 'route-segment-config/index.md:19',
  detail:
    'export const revalidate = 10 기준의 화면이다. 동작 서술은 Next 16에서도 그대로 유효하지만, next.config에 cacheComponents: true를 켜면 revalidate·dynamic·dynamicParams·fetchCache 세그먼트 옵션은 16.0.0에서 제거된다. Cache Components에서는 use cache + cacheLife가 같은 역할을 맡고, 갱신은 revalidateTag/updateTag로 한다.',
  color: '#0ea5e9'
};

/** 가장 자주 오해하는 지점 — 만료는 타이머지만, 재생성의 방아쇠는 요청이다 */
export const ISR_TRIGGER_NOTE: NoteItem = {
  id: 'trigger',
  label: '시간이 지나도 저절로 재생성되지 않는다',
  meta: 'incremental-static-regeneration.md:100-101,583 · cacheLife.md:92,112',
  detail:
    '만료(revalidate)는 "이제 낡았다"는 표시일 뿐이다. 다음 요청이 도착해야 그 요청이 ① 구버전을 0ms에 받고 ② 동시에 백그라운드 재생성을 시작시킨다. 문서도 그 요청을 triggering request라고 부른다. 트래픽이 전혀 없으면 그 페이지는 옛날 버전 그대로 남는다.',
  color: '#f97316'
};

/** Cache Components에만 있는 세 번째 단계 */
export const ISR_EXPIRE_NOTE: NoteItem = {
  id: 'expire',
  label: 'expire를 넘기면 그 요청은 기다린다',
  meta: 'cacheLife.md:93,127',
  detail:
    'cacheLife는 stale · revalidate · expire 세 값을 갖는다. revalidate만 넘긴 상태에서는 구버전을 주고 뒤에서 갱신하지만, 트래픽이 없어 expire까지 넘기면 다음 요청은 동기 재생성을 기다린다. 이 데모가 그리는 "구버전 즉시 응답"은 revalidate ~ expire 구간의 이야기다.',
  color: '#8b5cf6'
};
