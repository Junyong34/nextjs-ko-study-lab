import assert from 'node:assert/strict'
import { test } from 'node:test'
import { judge } from './judge.ts'

test('하드 로드에서 시작한 슬롯의 default 화면도 소프트 이동 뒤 유지되면 일치한다', () => {
  const soft = {
    path: '/settings',
    via: 'soft',
    previousScreens: { children: 'shoes', cart: 'shoes', promo: 'default' },
    screens: { children: 'settings', cart: 'shoes', promo: 'default' },
  }

  assert.equal(judge(null, soft, {})[0].state, 'pass')
})

test('이동 전 슬롯 화면이 바뀌면 불일치한다', () => {
  const soft = {
    path: '/shoes',
    via: 'soft',
    previousScreens: { children: 'home', cart: 'home', promo: 'home' },
    screens: { children: 'shoes', cart: 'shoes', promo: 'default' },
  }

  assert.equal(judge(null, soft, {})[0].state, 'fail')
})
