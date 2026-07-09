export interface Balance{
    available: number;
    locked: number;
}

export interface Order {
    orderId: string;
    market: string;
    price: number;
    quantity: number;
    userId: string;
    filled: number;
    side: "buy" | "sell";
}

export interface OrderBook {
    bids: Order[];
    asks: Order[];
    currentPrice: number;
    baseAsset: string;
    quoteAsset: string;
    lastTradeId: string;
    market:string;
}

export interface Fill {
  fillId: string;
  symbol: string;
  price: number;
  qty: number;
  buyOrderId?: string;
  sellOrderId?: string;
  createdAt: number;
  otherUserId:string;
}