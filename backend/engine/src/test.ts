import { BALANCES, ORDERBOOK } from "./store/store";
import { createOrder, seed } from "./trade/Engine";
import { Order } from "./types";

seed();

function initalizeOrderbooks(){
    ORDERBOOK.set("TATA_INR", {
        bids: [],
        asks: [],
        currentPrice:0,
        baseAsset: "TATA",
        quoteAsset: "INR",
        lastTradeId: "",
        market: "TATA_INR"
    })

    ORDERBOOK.set("RELIANCE_INR", {
        bids: [],
        asks: [],
        currentPrice:0,
        baseAsset: "RELIANCE",
        quoteAsset: "INR",
        lastTradeId: "",
        market: "RELIANCE_INR"
    });

    ORDERBOOK.set("INFY_INR", {
        bids: [],
        asks: [],
        currentPrice:0,
        baseAsset: "INFY",
        quoteAsset: "INR",
        lastTradeId: "",
        market: "INFY_INR"
    });
};

initalizeOrderbooks();

function setDummyOrders(order:Order){
    const orderbook = ORDERBOOK.get(order.market);

    if(order.side === "buy"){
        orderbook?.bids.push(order);
    } else {
        orderbook?.asks.push(order);
    }
};
createOrder("TATA_INR",100,1,"1","sell");
createOrder("TATA_INR",100,1,"1","sell");
createOrder("TATA_INR",100,1,"1","sell");
createOrder("TATA_INR",100,1,"1","sell");
createOrder("TATA_INR",100,1,"1","sell");
createOrder("TATA_INR",100,1,"2","buy");
createOrder("TATA_INR",100,1,"2","buy");
createOrder("TATA_INR",100,1,"2","buy");
createOrder("TATA_INR",100,1,"2","buy");
createOrder("TATA_INR",100,1,"2","buy");

console.log(ORDERBOOK)
console.log(BALANCES)