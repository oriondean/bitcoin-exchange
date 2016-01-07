var OrderAction = require("./orderAction");

/**
 * Immutable order object
 *
 * @param action order's action (bid or ask)
 * @param price order price
 * @param quantity order quantity
 * @constructor
 * */
function Order(action, price, quantity) {
    if(action !== OrderAction.BID && action !== OrderAction.ASK) {
        throw new Error("Invalid order action");
    }

    if(price == null || isNaN(price)) {
        throw new Error("Invalid price");
    }

    if(quantity == null || isNaN(quantity) || quantity <= 0) {
        throw new Error("Invalid quantity");
    }

    this.action = action;
    this.price = price;
    this.quantity = quantity;

    Object.freeze(this); // immutable
}

/**
 * If order is a bid order
 * @returns {boolean} true if order is a bid order, otherwise false
 */
Order.prototype.isBid = function() { return this.action === OrderAction.BID };

/**
 * Returns true if order can be matched with given counterpart
 * @param order
 * @returns {boolean} true if can be matched, otherwise false
 */
Order.prototype.canMatch = function(order) {
    if(this.isBid() === order.isBid()) return false; // can't match two bid/ask orders

    return this.isBid() ? this.price <= order.price : this.price >= order.price;
};

/**
 * Returns true if the order has a worse price than given counterpart
 * @param order
 * @returns {boolean} true if worse price
 */
Order.prototype.hasWorsePrice = function(order) {
    if(this.isBid() !== order.isBid()) {
        throw new Error("Cannot compare prices between orders with different actions")
    }

    return this.isBid() ? this.price > order.price : this.price < order.price;
};

/**
 * Returns new order object with reduced quantity
 * @param amount amount to reduce existing quantity by
 * @returns {Order}
 */
Order.prototype.reduceQuantity = function(amount) {
    return new Order(this.action, this.price, this.quantity - amount);
};

module.exports = Order;