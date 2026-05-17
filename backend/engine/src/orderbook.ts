const BASE_CURRENCY = "INR"

export interface Order {
    orderId: string;
    price: number;
    quantity: number;
    userId: string;
    filled: number;
    side: "buy" | "sell";
}

export interface Fill {
    price: number;
    quantity: number;
    tradeId: string;
    otherUserId: string;
    markerOrderId: string;
}

export class OrderBook {
    bids: Order[];
    asks: Order[];
    currentPrice: number;
    baseAsset: string;
    quoteAsset: string = BASE_CURRENCY;
    lastTradeId: string;
        
    constructor(bids: Order[], asks: Order[], currentPrice: number, baseAsset: string, lastTradeId: string){
        this.bids = bids;
        this.asks = asks;
        this.currentPrice = currentPrice;
        this.baseAsset = baseAsset;
        this.lastTradeId = lastTradeId;
    }

    
}