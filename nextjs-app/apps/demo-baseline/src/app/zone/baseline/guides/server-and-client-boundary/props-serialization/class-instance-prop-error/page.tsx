import { connection } from 'next/server'
import { InvalidValueReceiver } from '../components/InvalidValueReceiver'

class DiscountPolicy {
  constructor(private readonly percentage: number) {}

  apply(price: number) {
    return price * (1 - this.percentage / 100)
  }
}

export default async function ClassInstancePropErrorPage() {
  await connection()

  return <InvalidValueReceiver label="할인 정책" value={new DiscountPolicy(10)} />
}
