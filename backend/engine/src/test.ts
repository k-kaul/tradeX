import { BALANCES, ORDERBOOK } from "./store/store";
import { BASE_CURRENCY, createOrder } from "./trade/Engine";
import { Order } from "./types";

export function seed(){
    BALANCES.set("1", {
        [BASE_CURRENCY] : {
            available: 1000,
            locked: 0
        }, "TATA" : {
            available: 10,
            locked: 0
        }, "RELIANCE": {
            available:1000,
            locked: 0
        }
    });

    BALANCES.set("2", {
        [BASE_CURRENCY] : {
            available: 2000,
            locked: 0
        }, "TATA" : {
            available: 100,
            locked: 0
        }, "RELIANCE": {
            available:1000,
            locked: 0
        }
    });

    BALANCES.set("3", {
        [BASE_CURRENCY] : {
            available: 1000,
            locked: 0
        }, "TATA" : {
            available: 100,
            locked: 0
        }, "RELIANCE": {
            available:1000,
            locked: 0
        }
    })
}
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
// ==========================================
// TEST 1 : Exact Match
// ==========================================

createOrder("TATA_INR", 100, 1, "1", "sell");
createOrder("TATA_INR", 100, 1, "2", "buy");


// ==========================================
// TEST 2 : Buy Price Greater Than Ask
// ==========================================

createOrder("TATA_INR", 100, 1, "1", "sell");
createOrder("TATA_INR", 110, 1, "2", "buy");


// ==========================================
// TEST 3 : No Match
// ==========================================

createOrder("TATA_INR", 120, 1, "1", "sell");
createOrder("TATA_INR", 100, 1, "2", "buy");


// ==========================================
// TEST 4 : Partial Fill
// ==========================================

createOrder("TATA_INR", 100, 5, "1", "sell");
createOrder("TATA_INR", 100, 2, "2", "buy");


// ==========================================
// TEST 5 : One Buyer Matches Multiple Sellers
// ==========================================

createOrder("TATA_INR", 100, 1, "1", "sell");
createOrder("TATA_INR", 100, 1, "3", "sell");

createOrder("TATA_INR", 200, 2, "2", "buy");


// ==========================================
// TEST 6 : One Large Buyer
// ==========================================

createOrder("TATA_INR", 100, 1, "1", "sell");
createOrder("TATA_INR", 100, 2, "3", "sell");

createOrder("TATA_INR", 100, 3, "2", "buy");


// ==========================================
// TEST 7 : Buyer Larger Than Available Liquidity
// ==========================================

createOrder("TATA_INR", 100, 2, "1", "sell");

createOrder("TATA_INR", 100, 5, "2", "buy");


// ==========================================
// TEST 8 : Different Prices
// ==========================================

createOrder("TATA_INR", 95, 1, "1", "sell");
createOrder("TATA_INR", 100, 1, "3", "sell");
createOrder("TATA_INR", 105, 1, "1", "sell");

createOrder("TATA_INR", 100, 3, "2", "buy");


// ==========================================
// TEST 9 : FIFO
// ==========================================

createOrder("TATA_INR", 100, 1, "1", "sell");
createOrder("TATA_INR", 100, 1, "3", "sell");

createOrder("TATA_INR", 100, 1, "2", "buy");


// ==========================================
// TEST 10 : Self Trade Prevention
// ==========================================

createOrder("TATA_INR", 100, 1, "1", "sell");
createOrder("TATA_INR", 100, 1, "1", "buy");


// ==========================================
// TEST 11 : Multiple Markets
// ==========================================

createOrder("TATA_INR", 100, 1, "1", "sell");
createOrder("RELIANCE_INR", 2000, 1, "1", "sell");

createOrder("TATA_INR", 100, 1, "2", "buy");


// ==========================================
// TEST 12 : Insufficient Seller Balance
// ==========================================

createOrder("TATA_INR", 100, 1000, "1", "sell");


// ==========================================
// TEST 13 : Insufficient Buyer Balance
// ==========================================

createOrder("TATA_INR", 100000, 100, "2", "buy");


// ==========================================
// TEST 14 : Unknown Market
// ==========================================

createOrder("APPLE_INR", 100, 1, "1", "buy");


// ==========================================
// TEST 15 : Unknown User
// ==========================================

createOrder("TATA_INR", 100, 1, "999", "buy");

console.log("current orderbook looks like this: ",ORDERBOOK)
console.log("current Balances looks like this: ",BALANCES)