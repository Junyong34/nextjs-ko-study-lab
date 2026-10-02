import { CacheStatus } from '../components/CacheStatus'

// 목록이 없는 형제 화면. 이 라우트에 있는 동안 상품 목록 컴포넌트는 언마운트돼 있다.
export default function NoticePage() {
  return <CacheStatus />
}
