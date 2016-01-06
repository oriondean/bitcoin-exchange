var _ = require("underscore");
var Trade = require("./trade/trade");

/**
 * Creates new Matcher
 * @constructor
 */
function Matcher() {
    this.bidOrders = []; // sorted lowest to highest price (best offer)
    this.askOrders = []; // sorted highest to lowest price (best offer)

    this.trades = [];
}

/**
 * Attempts to match new order with existing orders, otherwise adds it to be matched
 * @param newOrder
 */
Matcher.prototype.onNewOrder = function(newOrder) {
    var order = this.match(newOrder, newOrder.isBid() ? this.askOrders : this.bidOrders);

    if(order) {
        var index;

        if(order.isBid()) {
            index = _.sortedIndex(this.bidOrders, order, function(order) { return order.price });
            this.bidOrders.splice(index, 0, order);
        } else {
            index = _.sortedIndex(this.askOrders, order, function(order) { return -order.price });
            this.askOrders.splice(index, 0, order);
        }
    }
};

/**
 * Matches an order with potential candidate orders
 *
 * @param toMatch new order that needs a match
 * @param candidates potential orders that can be matched
 * @returns {order} null if order has been fully matched, otherwise remaining part of order
 */
Matcher.prototype.match = function(toMatch, candidates) {
    var order = toMatch;

    while(!!candidates[0] && order.canMatch(candidates[0])) {
        var existingOrder = candidates[0];

        // match at existing order's price, and lowest quantity
        this.trades.push(new Trade(existingOrder.price, Math.min(existingOrder.quantity, order.quantity)));

        if(order.quantity >= existingOrder.quantity) {
            candidates.splice(0, 1); // existing fully matched, remove

            if(order.quantity === existingOrder.quantity) {
                return null; // new order fully matched
            }

            order = order.reduceQuantity(existingOrder.quantity);
        } else {
            candidates[0] = existingOrder.reduceQuantity(order.quantity); // existing partially matched
            return null; // new order fully matched
        }
    }

    return order;
};

module.exports = Matcher;