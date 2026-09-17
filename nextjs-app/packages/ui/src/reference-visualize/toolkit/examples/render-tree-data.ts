/**
 * @fileoverview examples/render-tree-data.ts
 * App Router 렌더 트리 데모의 트리·세그먼트 데이터.
 * readyAt은 재생 진행도(0~1) 기준이며, 셸 → 스트리밍 → 수화 순서를 그대로 반영한다.
 */

import type { RenderTreeNode, UrlSegmentSpec } from '../components/structure';

export const TREE: RenderTreeNode = {
  id: 'root',
  kind: 'rsc',
  title: 'Root Layout',
  file: 'app/layout.tsx',
  readyAt: 0.06,
  detail: '<html>/<body>를 소유하는 서버 컴포넌트. 라우트가 바뀌어도 다시 렌더되지 않고 그대로 유지된다.',
  children: [
    {
      id: 'products-layout',
      kind: 'rsc',
      title: 'Products Layout',
      file: 'app/products/layout.tsx',
      readyAt: 0.16,
      detail: 'products 세그먼트가 소유하는 중첩 레이아웃. 상품 목록과 상세가 공통으로 쓰는 껍데기다.',
      children: [
        {
          id: 'page',
          kind: 'rsc',
          title: 'Product Page',
          file: 'app/products/[id]/page.tsx',
          readyAt: 0.28,
          detail: '[id] 동적 세그먼트를 params로 받아 하위를 합성한다. 여기까지가 즉시 flush 되는 셸이다.',
          children: [
            {
              id: 'details',
              kind: 'suspense',
              title: 'ProductDetails',
              file: '<Suspense fallback={<Skeleton/>}>',
              readyAt: 0.46,
              detail:
                'await getProduct(id)가 끝날 때까지 스켈레톤이 자리를 지킨다. 이 경계 밖은 이미 화면에 떠 있다.',
              children: [
                {
                  id: 'gallery',
                  kind: 'client',
                  title: 'ImageGallery',
                  file: "'use client' Carousel.tsx",
                  readyAt: 0.8,
                  detail:
                    '썸네일 클릭·스와이프를 처리하는 클라이언트 컴포넌트. HTML은 부모와 함께 도착하지만, 수화되기 전까지는 눌러도 반응하지 않는다.'
                }
              ]
            },
            {
              id: 'reviews',
              kind: 'suspense',
              title: 'Reviews',
              file: '<Suspense fallback={<Skeleton/>}>',
              readyAt: 0.6,
              detail:
                'await getReviews()는 더 느리지만 ProductDetails를 기다리게 하지 않는다. 경계마다 독립적으로 도착한다.',
              children: [
                {
                  id: 'cart',
                  kind: 'client',
                  title: 'AddToCartButton',
                  file: "'use client' AddToCart.tsx",
                  readyAt: 0.92,
                  detail:
                    '장바구니 담기 onClick을 소유한다. 선택적 수화 덕분에 이 버튼을 먼저 누르면 우선순위가 이쪽으로 옮겨진다.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const SEGMENTS: UrlSegmentSpec[] = [
  { label: '/', file: 'app/layout.tsx', nodeId: 'root' },
  { label: 'products', file: 'app/products/layout.tsx', nodeId: 'products-layout' },
  { label: '42', file: 'app/products/[id]/page.tsx', nodeId: 'page' }
];
