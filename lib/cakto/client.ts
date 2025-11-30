import type { CaktoTokenResponse, CaktoOffer, CaktoOrder } from "./types"

const CAKTO_API_BASE_URL = "https://api.cakto.com.br"
const CAKTO_TOKEN_URL = `${CAKTO_API_BASE_URL}/o/token/`

let cachedToken: string | null = null
let tokenExpiresAt: number | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken
  }

  const clientId = process.env.CAKTO_CLIENT_ID
  const clientSecret = process.env.CAKTO_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Cakto credentials not configured")
  }

  const response = await fetch(CAKTO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to authenticate with Cakto: ${response.statusText}`)
  }

  const tokenData: CaktoTokenResponse = await response.json()

  cachedToken = tokenData.access_token
  tokenExpiresAt = Date.now() + tokenData.expires_in * 1000 - 60000 // Expire 1 min early

  return tokenData.access_token
}

async function makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAccessToken()

  const response = await fetch(`${CAKTO_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Cakto API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export async function listOffers(): Promise<{ results: CaktoOffer[] }> {
  return makeAuthenticatedRequest("/api/offers/")
}

export async function getOffer(offerId: string): Promise<CaktoOffer> {
  return makeAuthenticatedRequest(`/api/offers/${offerId}/`)
}

export async function getOrder(orderId: string): Promise<CaktoOrder> {
  return makeAuthenticatedRequest(`/api/orders/${orderId}/`)
}

export async function listOrders(params?: { customer?: string }): Promise<{ results: CaktoOrder[] }> {
  const queryParams = new URLSearchParams()
  if (params?.customer) {
    queryParams.append("customer", params.customer)
  }

  const endpoint = queryParams.toString() ? `/api/orders/?${queryParams.toString()}` : "/api/orders/"

  return makeAuthenticatedRequest(endpoint)
}
