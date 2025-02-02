type MakePaystackGetRequest = {
  endPoint: string
  method: 'GET'
}

type MakePaystackPostRequest<Body> = {
  endPoint: string
  method: 'POST'
  body: Body
}

export type PaystackSuccessResponse<
  Message extends string,
  Data extends object,
> = {
  status: true
  message: Message
  data: Data
}

export type MakePaystackRequest<Body> = {
  endPoint: string
} & (MakePaystackGetRequest | MakePaystackPostRequest<Body>)

type Currency = 'GHS'

export type InitializeTransaction = {
  email: string
  amount: string
  currency: Currency
}

export type InitializeTransactionResponse = {
  authorization_url: string
  access_code: string
  reference: string
}

export type TransactionSuccessResponse = {
  id: number
  domain: 'test' | 'live'
  status: 'success' | 'abandoned' | 'failed'
  reference: string
  amount: number
  message: unknown | null
  gateway_response:
    | 'Successful'
    | 'The transaction was not completed'
    | 'Declined'
  paid_at: string | null // ISO 8601 format date
  created_at: string // ISO 8601 format date
  currency: Currency
  fees: number | null
  plan: unknown | null
  split: Record<string, unknown>
  order_id: string | null
  createdAt: string // ISO 8601 format date
  transaction_date: string // ISO 8601 format date
}

export type ChargeSuccessEvent = {
  event: 'charge.success'
  data: TransactionSuccessResponse
}
