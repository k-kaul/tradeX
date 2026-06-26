import { ORDERBOOK } from "../store/store";
import { Fill, Order, OrderBook } from "../types";

export function placeOrder(order:Order){

    const { market, quantity, side } = order;
    const orderbook = ORDERBOOK.get(market);

    if(!orderbook) throw new Error("Orderbook not found");

    if(side === "buy"){
        const { executedQuantity, fills }= matchAsk(order);
        order.filled = executedQuantity;

        if(executedQuantity === quantity){
            return {
                executedQuantity,
                fills
            }
        }

        orderbook.bids.push(order);

        return{
            executedQuantity,
            fills
        }
        
    } else {
        const { executedQuantity, fills } = matchBid(order);
        order.filled = executedQuantity;
        if(executedQuantity === quantity){
            return {
                executedQuantity,
                fills
            }
        }

        orderbook.asks.push(order);

        return{
            executedQuantity,
            fills
        }
    }
}

export function matchBid(order: Order){
    const fills: Fill[] = [];
    let executedQuantity = 0;
    const orderbook = ORDERBOOK.get(order.market);
    if(!orderbook) throw new Error("Orderbook not found");
    const asks = orderbook.asks || [];

    for (const ask of asks){
        if(executedQuantity === order.quantity){
            break;
        }

        if(ask.price <= order.price && order.userId !== ask.userId){
            const remainigAsks = ask.quantity - ask.filled;
            const filledQuantity = Math.min((order.quantity - executedQuantity), remainigAsks); // filling order
            executedQuantity += filledQuantity; //updating no of executed quantities in each iteration
            ask.filled += filledQuantity; //updating filled quants in asks array
            //updating fills
            fills.push({
                fillId: String(Math.random()),
                symbol: order.market,
                price: ask.price,
                qty: filledQuantity,
                buyOrderId: Number(order.orderId),
                sellOrderId: Number(ask.orderId),
                createdAt: new Date().getTime(),
                otherUserId: ask.userId
            })       
        }
        
    }

    orderbook.asks = asks.filter(ask => ask.quantity > ask.filled)

    return {
        fills,
        executedQuantity
    }
}


function matchAsk(order:Order){
    const fills: Fill[] = [];
    let executedQuantity = 0;
    const orderbook = ORDERBOOK.get(order.market);
    if(!orderbook) throw new Error("Orderbook not found");

    const bids = orderbook.bids || [];

    for (const bid of bids){
        if(executedQuantity === order.quantity){
            break;
        }

        if(bid.price >= order.price && order.userId !== bid.userId){
            const remainigbidQty = bid.quantity - bid.filled;
            const filledQuantity = Math.min((order.quantity - executedQuantity), remainigbidQty); // filling order
            executedQuantity += filledQuantity; //updating no of executed quantities in each iteration
            bid.filled += filledQuantity; //updating filled quants in bids array
            //updating fills
            fills.push({
                fillId: String(Math.random()),
                symbol: order.market,
                price: bid.price,
                qty: filledQuantity,
                buyOrderId: Number(bid.orderId),
                sellOrderId: Number(order.orderId),
                createdAt: new Date().getTime(),
                otherUserId: bid.userId
            })       
        }
        
    }

    orderbook.bids = bids.filter(bid => bid.quantity > bid.filled)

    return {
        fills,
        executedQuantity
    }
}

export function cancelBid(order:Order){
    //canceling buy order
    const orderbook = ORDERBOOK.get(order.market);
    
    if(!orderbook){
        throw new Error("Orderbook not found")
    }

    const index = orderbook.bids.findIndex(x => x.orderId === order.orderId);

    if(index !== -1){
        const price = orderbook.bids[index].price;
        orderbook.bids.splice(index,1);

        return price
    }
}

export function cancelAsk(order:Order){
    //canceling sell order
    const orderbook = ORDERBOOK.get(order.market);
    if(!orderbook) throw new Error("Orderbook not found")
    const index = orderbook?.asks.findIndex(x => x.orderId === order.orderId);
    
    if(index !== -1){
        const price = orderbook.asks[index].price;
        orderbook.asks.splice(index,1)

        return price
    }
}

export function getOpenOrders(userId: string){
    const openOrders: Order[] = [];

    for (const orderbook of ORDERBOOK.values()){        
        openOrders.push(
            ...orderbook.bids.filter(bid => bid.userId === userId),
            ...orderbook.asks.filter(ask => ask.userId === userId)
        );
    }
    
    return openOrders;
    
}

export function getDepth(market:string){   
    const asksObj: {[key:string]:number} = {};
    const bidsObj: {[key:string]:number} = {};

    const asks : [string, string][] = [];
    const bids : [string, string][] = [];
    
    const orderbook = ORDERBOOK.get(market);

    if(!orderbook) throw new Error("orderbook not found")

    const marketAsks = orderbook.asks;
    const marketBids = orderbook.bids;

    for (let i=0; i<marketAsks.length; i++){
        const order = marketAsks[i];
        if(!asksObj[order.price]){
            asksObj[order.price] = 0;
        }

        asksObj[order.price] += order.quantity - order.filled;
    }

    for (let i=0; i<marketBids.length; i++){
        const order = marketBids[i];
        if(!bidsObj[order.price]){
            bidsObj[order.price] = 0;
        }

        bidsObj[order.price] += order.quantity - order.filled;
    }

    for(const price in asksObj){
        asks.push([price,asksObj[price].toString()]);
    }

    for(const price in bidsObj){
        bids.push([price,bidsObj[price].toString()]);
    }

    return {
        bids,
        asks
    }

}