'use client';

/**
 * @fileoverview RoleBadge
 * 현재 장의 역할(방문자 유준 / 운영자 서아)을 보여주는 배지.
 */

import React from 'react';
import { ROLE_EMOJI, ROLE_TITLE, type SceneRole } from './scenes';

const ROLE_STYLE: Record<SceneRole, string> = {
  visitor: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
  operator:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
};

interface RoleBadgeProps {
  role: SceneRole;
  roleName: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, roleName }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_STYLE[role]}`}
  >
    <span aria-hidden>{ROLE_EMOJI[role]}</span>
    <span>
      {roleName} · {ROLE_TITLE[role]}
    </span>
  </span>
);
