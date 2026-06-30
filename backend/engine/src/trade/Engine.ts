import { BALANCES, FILLS, ORDERBOOK, ORDERS } from "../store/store";
import { Fill, Order } from "../types";
import { matchBid, placeOrder } from "./orderbook";

export const BASE_CURRENCY = "INR";

export function createOrder(market:string, price:number, quantity:number, userId:string, side:"buy"| "sell"){
    
    const baseAsset = market.split("_")[0];
    const quoteAsset = market.split("_")[1];

    const orderbook = ORDERBOOK.get(market);
    const userBalance = BALANCES.get(userId);
    
    if(!BALANCES.get(userId)) throw new Error("user does not exist");

    if(!orderbook) throw new Error("Market does not exist");
    if(!userBalance) throw new Error("User does not exist");

    if(!(userBalance[userId].available > price * quantity)) throw new Error("Insufficient Balance");
    
    checkAndLockFunds(quoteAsset, baseAsset, userId, quantity, price, side);    

    const order: Order = {
        orderId:Math.random().toString(36),
        market,
        price,
        quantity,
        userId,
        filled:0,
        side
    }

    const {fills, executedQuantity} = placeOrder(order);

    ORDERS.set(order.orderId, order);
    FILLS.push(...fills);

    updateBalances(userId, fills, baseAsset, quoteAsset, side);
    // Todo: free locked funds

    return {
        fills,
        executedQuantity,
        orderId: order.orderId
    }
}

function checkAndLockFunds(quoteAsset:string, baseAsset: string, userId:string, quantity:number, price:number, side:"buy" | "sell"){
    const currentUserBalance = BALANCES.get(userId);
    if(!currentUserBalance) throw new Error("No balance for this user")
    
    if(side === "buy"){
        if(!currentUserBalance[quoteAsset]) throw new Error("Asset balance not found");

        const userQuoteAssetBalance = currentUserBalance[quoteAsset];

        if(userQuoteAssetBalance.available < price * quantity){
            throw new Error("insufficient balance");
        }

        userQuoteAssetBalance.available = userQuoteAssetBalance.available - (price * quantity);

        userQuoteAssetBalance.locked = userQuoteAssetBalance.locked + (price * quantity);
        
    } else {
        if(!currentUserBalance[baseAsset]) throw new Error("Asset balance not found");
        
        const userBaseAssetBalance = currentUserBalance[baseAsset];

        if(userBaseAssetBalance.available < quantity) throw new Error("Insufficient balance");

        userBaseAssetBalance.available = userBaseAssetBalance.available -  quantity;

        userBaseAssetBalance.locked = userBaseAssetBalance.locked +  quantity;      
    }
}
function updateBalances(userId:string, fills:Fill[], baseAsset:string, quoteAsset:string, side:"buy"| "sell"){
    //baseAsset = TATA, quoteAsset = INR
    let fillCounter:number = 0;
    let otherUserId = "";
    if(side === "buy"){
        fills.forEach(fill => {
            // update baseAsset balance
            BALANCES.get(userId)![baseAsset].available += fill.qty;

            BALANCES.get(fill.otherUserId)![baseAsset].locked -= fill.qty;

            //update quoteAsset balance

            BALANCES.get(userId)![quoteAsset].locked -= fill.price * fill.qty;

            BALANCES.get(fill.otherUserId)![quoteAsset].available += fill.price * fill.qty;
            fillCounter += 1
        })
    } else {
        fills.forEach(fill => {
        // update baseAsset balance
        BALANCES.get(userId)![baseAsset].locked -= fill.qty;
        BALANCES.get(fill.otherUserId)![baseAsset].available += fill.qty;

        //update quoteAsset balance

        BALANCES.get(userId)![quoteAsset].available += fill.price * fill.qty;
        BALANCES.get(fill.otherUserId)![baseAsset].locked -= fill.price * fill.qty;
        
        fillCounter += 1
        
        })
    }
}

// TODO: free locked funds function

function onRamp(userId:string, amount:number){
    const userBalance = BALANCES.get(userId);
    if(!userBalance){
        BALANCES.set(userId,{
            [BASE_CURRENCY]: {
                available: amount,
                locked: 0
            }
        })
    } else{
        userBalance[BASE_CURRENCY].available += amount;
    }
}