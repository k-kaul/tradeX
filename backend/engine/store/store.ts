import { OrderBook, Order, Fill, Balance } from "../types"

// export interface ORDERBOOK {
//     asks: Order[],
//     bids: Order[]
// }

export const BALANCES = new Map<string, Record<string, Balance[]>>();
export const ORDERBOOKS = new Map<string, OrderBook>();
export const ORDERS = new Map<string, Order>();
export const FILLS: Fill[] = []