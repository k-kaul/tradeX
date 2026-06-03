import { OrderBook, Order, Fill, Balance } from "../types"

export const BALANCES = new Map<string, Record<string, Balance>>();
export const ORDERBOOK = new Map<string, OrderBook>();
export const ORDERS = new Map<string, Order>();
export const FILLS: Fill[] = []