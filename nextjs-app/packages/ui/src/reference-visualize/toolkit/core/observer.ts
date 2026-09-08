/**
 * @fileoverview Canvas Resize and Visibility Observers
 * ResizeObserver와 IntersectionObserver를 추상화하여 브라우저 환경에서 안전하게 관측 및 정리(cleanup)합니다.
 */

export interface ResizeCallbackData {
  width: number;
  height: number;
}

/**
 * 요소 크기 변화를 관측하고 안전한 정리 함수를 반환합니다.
 */
export function observeElementResize(
  element: HTMLElement,
  onResize: (data: ResizeCallbackData) => void
): () => void {
  if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
    return () => {};
  }

  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;

    let width = 0;
    let height = 0;

    if (entry.contentBoxSize) {
      const box = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
      width = box.inlineSize;
      height = box.blockSize;
    } else {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    }

    if (width > 0 && height > 0) {
      onResize({ width, height });
    }
  });

  observer.observe(element);
  return () => observer.disconnect();
}

/**
 * 뷰포트 교차 여부(가시성)를 관측하여 화면에 보일 때만 렌더링되도록 돕습니다.
 */
export function observeVisibility(
  element: HTMLElement,
  onChange: (isVisible: boolean) => void
): () => void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return () => {};
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry) {
      onChange(entry.isIntersecting);
    }
  });

  observer.observe(element);
  return () => observer.disconnect();
}
