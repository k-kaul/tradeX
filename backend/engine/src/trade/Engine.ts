import { BALANCES } from "../store/store";
import { Order } from "../types";

export function createOrder(order:Order){
    const { market, price, quantity, userId, side } = order;

    const baseAsset = market.split("_")[0];
    const quoteAsset = market.split("_")[1];
    
    if(!BALANCES.get(userId)) throw new Error("user does not exist")

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

function updateBalances(){

}