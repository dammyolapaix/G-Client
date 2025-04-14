import 'server-only'

import { env } from '@/env/server'

import {
  InitializeTransaction,
  InitializeTransactionResponse,
  MakePaystackRequest,
  PaystackSuccessResponse,
} from './types'

class Paystack {
  private readonly PAYSTACK_SECRET_KEY = env.PAYSTACK_SECRET_KEY
  private readonly BASE_URL = 'https://api.paystack.co'

  private makePaystackRequest = async <
    Body,
    ResponseMessage extends string,
    ResponseData extends object,
  >(
    request: MakePaystackRequest<Body>
  ): Promise<null | PaystackSuccessResponse<ResponseMessage, ResponseData>> => {
    const { method, endPoint } = request

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
      },
    }

    // If the method is POST, include the body in the request
    if (method === 'POST' && request.body) {
      fetchOptions.body = JSON.stringify(request.body)
    }

    const response = await fetch(`${this.BASE_URL}${endPoint}`, fetchOptions)

    if (!response.ok) return null

    const data = (await response.json()) as PaystackSuccessResponse<
      ResponseMessage,
      ResponseData
    >

    return data
  }

  initializeTransaction = async (body: InitializeTransaction) =>
    await this.makePaystackRequest<
      InitializeTransaction,
      'Authorization URL created',
      InitializeTransactionResponse
    >({
      endPoint: '/transaction/initialize',
      method: 'POST',
      body,
    })
}

const paystack = new Paystack()

export default paystack
