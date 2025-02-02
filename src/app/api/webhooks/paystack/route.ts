import crypto from 'crypto'

import { env } from '@/env/server'
import course from '@/features/courses'
import { ChargeSuccessEvent } from '@/lib/payments/types'

export async function POST(request: Request) {
  try {
    const reqBody = (await request.json()) as ChargeSuccessEvent

    const hash = crypto
      .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(reqBody))
      .digest('hex')

    if (hash == request.headers.get('x-paystack-signature')) {
      switch (reqBody.event) {
        case 'charge.success':
          await course.services.enrollLearnerToCourse(reqBody.data)

          break

        default:
          console.log(`Unhandled event type ${reqBody.event}`)
      }
    }
  } catch (error) {
    return new Response(`Webhook error: ${(error as Error).message}`, {
      status: 400,
    })
  }

  return new Response('Success!', {
    status: 200,
  })
}
