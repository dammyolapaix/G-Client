import crypto from 'crypto'

import { env } from '@/env/server'

export async function POST(request: Request) {
  try {
    const reqBody = await request.json()

    const hash = crypto
      .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(reqBody))
      .digest('hex')

    if (hash == request.headers.get('x-paystack-signature')) {
      // Retrieve the request's body
      const event = reqBody
      // Do something with event
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
