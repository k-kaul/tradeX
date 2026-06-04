import { OrderBook, Order, Fill, Balance } from "../types"

type UserBalances = Record<string, Balance>
export const BALANCES = new Map<string, UserBalances>();
export const ORDERBOOK = new Map<string, OrderBook>();
export const ORDERS = new Map<string, Order>();
export const FILLS: Fill[] = []