import { BALANCES, ORDERBOOK } from "../store/store";
import { Fill, Order } from "../types";
import { placeOrder } from "./orderbook";

export function createOrder(order:Order){
    const { market, price, quantity, userId, side } = order;

    const baseAsset = market.split("_")[0];
    const quoteAsset = market.split("_")[1];
    
    if(!BALANCES.get(userId)) throw new Error("user does not exist");

    if(!ORDERBOOK.get(market)) throw new Error("Market does not exist");



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
    if(side === "buy"){
        fills.forEach(fill => {
            // update baseAsset balance
            BALANCES.get(userId)![baseAsset].available += fill.qty;

            BALANCES.get(fill.otherUserId)![baseAsset].locked -= fill.qty;

            //update quoteAsset balance

            BALANCES.get(userId)![quoteAsset].locked -= fill.price * fill.qty;

            BALANCES.get(fill.otherUserId)![quoteAsset].available += fill.price * fill.qty;
        })
    } else {
        fills.forEach(fill => {
        // update baseAsset balance
        BALANCES.get(userId)![baseAsset].locked -= fill.qty;
        BALANCES.get(fill.otherUserId)![baseAsset].available += fill.qty;

        //update quoteAsset balance

        BALANCES.get(userId)![quoteAsset].available += fill.price * fill.qty;
        BALANCES.get(fill.otherUserId)![quoteAsset].locked -= fill.price * fill.qty;
        })
        
    }
}