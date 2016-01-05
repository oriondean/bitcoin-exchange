"use strict"; // required for class support in node (https://nodejs.org/en/docs/es6/)

class OrderAction {
    static BID = "sell";
    static ASK = "buy";
}

module.exports = OrderAction;