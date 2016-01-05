var Order = require("./order/order");
var Trade = require("./trade/trade");

/**
 * Creates new Matcher
 * @constructor
 */
function Matcher() {
    this.bidOrders = []; // sorted lowest to highest price (best offer)
    this.askOrders = []; // sorted highest to lowest price (best offer)

    this.trades = []; // TODO: implement trades
}

Matcher.prototype.onNewOrder = function(order) {
    this.match(order, order.isBid() ? this.askOrders : this.bidOrders);
};

/**
 * Matches an order with potential candidate orders
 *
 * @param order new order that needs a match
 * @param candidates potential orders that can be matched
 * @returns {boolean} If order has been fully matched
 */
Matcher.prototype.match = function(order, candidates) {
    while(order.canMatch(candidates[0]) && order.quantity > 0) {
        var toMatch = candidates[0];

        if(order.quantity >= toMatch.quantity) {
            candidates.splice(0, 1); // fully matched, remove
            order = order.reduceQuantity(toMatch.quantity);
        } else {
            // partially matched, reduce quantity
            candidates[0] = new Order(toMatch.action, toMatch.price, toMatch.quantity - order.quantity);
            order = new Order(order.action, order.price, 0);
        }

        this.trades.push(new Trade(order, toMatch));
    }

    return !!candidates.quantity;
};

module.exports = Matcher;