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

// messages sent from api to engine
interface CreateOrderMessage{
    type: "CREATE_ORDER";
    data: {
        market: string;
        price: number;
        quantity: number;
        userId: string;
        side: "buy" | "sell";       
    }
}

interface CancelOrderMessage {
    type: "CANCEL_ORDER";
    data: {
        orderId:string;
        market:string;
    }
}

interface OnRampMessage {
    type: "ON_RAMP";
    data: {
        userId:string;
        amount:number;
    }
}

interface GetDepthMessage {
    type: "GET_DEPTH";
    data: {
        market: string;
    }
}

interface GetOpenOrdersMessage {
    type: "GET_OPEN_ORDERS";
    data: {
        userId: string;
    }
}

export type MessagesFromApi = CreateOrderMessage | CancelOrderMessage | OnRampMessage | GetDepthMessage | GetOpenOrdersMessage;
// end

// messages sent from engine back to Api
