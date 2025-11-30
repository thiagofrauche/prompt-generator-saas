export interface CaktoProduct {
  id: string
  name: string
  price: number
  type: "unique" | "subscription"
}

export interface CaktoOffer {
  id: string
  name: string
  price: number
  product: string
  type: "unique" | "subscription"
  status: "active" | "disabled"
}

export interface CaktoOrder {
  id: string
  refId: string
  status: "processing" | "waiting_payment" | "paid" | "refunded" | "chargeback" | "canceled"
  type: "unique" | "subscription"
  amount: string
  customer: {
    name: string
    email: string
    phone?: string
    docType?: "cpf" | "cnpj"
    docNumber?: string
  }
  paidAt?: string
  createdAt: string
}

export interface CaktoWebhookEvent {
  event: string
  order: CaktoOrder
  timestamp: string
}

export interface CaktoTokenResponse {
  access_token: string
  expires_in: number
  token_type: "Bearer"
  scope: string
}
