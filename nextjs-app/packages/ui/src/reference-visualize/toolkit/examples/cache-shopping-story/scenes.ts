/**
 * @fileoverview Cache Shopping Story Scenes
 * 쇼핑몰 시나리오(유준·서아) 4장 데이터. 캔버스 로직은 기존 4개 데모를 그대로 재사용하고,
 * 이 파일은 장별 내레이션·역할만 담는다.
 */

export type SceneRole = 'visitor' | 'operator';

export type SceneId = 'home' | 'product-detail' | 'category' | 'price-change';

export interface SceneMeta {
  id: SceneId;
  step: number;
  title: string;
  role: SceneRole;
  roleName: string;
  narration: string;
  /** 4장 전용 — 태그로 함께 갱신되는 화면 목록 */
  impactList?: string[];
}

export const ROLE_TITLE: Record<SceneRole, string> = {
  visitor: '방문자',
  operator: '운영자'
};

export const ROLE_EMOJI: Record<SceneRole, string> = {
  visitor: '🧑',
  operator: '🧑‍💼'
};

export const SCENES: SceneMeta[] = [
  {
    id: 'home',
    step: 1,
    title: '홈 화면',
    role: 'visitor',
    roleName: '유준',
    narration:
      '유준이 쇼핑몰 주소창에 URL을 입력합니다. 헤더와 카테고리 메뉴, 베스트셀러 요약은 이미 완성돼 있고, "유준님 추천" 배너만 잠깐 비어 있다가 뒤늦게 채워집니다.'
  },
  {
    id: 'product-detail',
    step: 2,
    title: '상품 상세',
    role: 'visitor',
    roleName: '유준',
    narration:
      '유준이 운동화 → 백팩 → 운동화 순서로 상세 페이지를 눌러봅니다. 처음 보는 상품은 잠깐 기다리지만, 다시 본 운동화는 거의 즉시 뜹니다.'
  },
  {
    id: 'category',
    step: 3,
    title: '카테고리 목록',
    role: 'visitor',
    roleName: '유준',
    narration:
      '유준이 "베스트셀러"와 "브랜드 스토리" 카테고리를 오갑니다. 순위가 자주 바뀌는 목록과 한 달째 그대로인 페이지는 캐시가 신선해야 하는 정도가 다릅니다.'
  },
  {
    id: 'price-change',
    step: 4,
    title: '가격 변경',
    role: 'operator',
    roleName: '서아',
    narration:
      '서아가 관리자 화면에서 운동화 가격을 세일가로 내립니다. 이미 캐시된 상품 목록·상세·장바구니 화면은 언제 새 가격으로 바뀔까요?',
    impactList: ['상품 목록 카드', '상품 상세 페이지', '장바구니 배지']
  }
];
