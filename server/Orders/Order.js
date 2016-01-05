"use strict"; // required for class support in node (https://nodejs.org/en/docs/es6/)

let OrderAction = require("./OrderAction");

class Order {

    constructor(orderParams) {
        if(orderParams.action !== OrderAction.BID && orderParams.action !== OrderAction.ASK) {
            throw new Error("Invalid order action");
        }

        if(isNaN(orderParams.price)) {
            throw new Error("invalid price");
        }

        if(isNaN(orderParams.quantity)) {
            throw new Error("invalid quantity");
        }

        this.action = orderParams.action;
        this.price = orderParams.price;
        this.quantity = orderParams.quantity;
    }

    get isBid() {
        return this.action === OrderAction.BID;
    }

    get isAsk() {
        return this.action === OrderAction.ASK;
    }
}

module.exports = Order;