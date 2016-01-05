var OrderAction = require("./orderAction");

function Order(orderParams) {
    if(orderParams.action !== OrderAction.BID && orderParams.action !== OrderAction.ASK) {
        throw new Error("Invalid order action");
    }

    if(orderParams.price == null || isNaN(orderParams.price)) {
        throw new Error("Invalid price");
    }

    if(orderParams.quantity == null || isNaN(orderParams.quantity)) {
        throw new Error("Invalid quantity");
    }

    this.action = orderParams.action;
    this.price = orderParams.price;
    this.quantity = orderParams.quantity;
}

Order.prototype.isBid = function() { return this.action === OrderAction.BID };

Order.prototype.isAsk = function() { return this.action === OrderAction.ASK };

Order.prototype.canMatch = function(order) {
    if(this.isBid() === order.isBid()) return false; // can't match two bid/ask orders

    return order.isBid() ? order.price <= this.price : order.price >= this.price;
};

module.exports = Order;