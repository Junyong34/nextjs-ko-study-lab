/**
 * @fileoverview useSceneController
 * 현재 장 인덱스와 이동만 관리한다. 각 데모 내부의 재생 상태(useCacheSequence 등)는 건드리지 않는다.
 */

import { useState } from 'react';
import { SCENES } from './scenes';

export function useSceneController() {
  const [index, setIndex] = useState(0);

  const goTo = (next: number) => {
    setIndex(Math.min(Math.max(next, 0), SCENES.length - 1));
  };

  return {
    index,
    scene: SCENES[index],
    total: SCENES.length,
    goTo,
    next: () => goTo(index + 1),
    prev: () => goTo(index - 1)
  };
}
