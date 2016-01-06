/**
 * Immutable trade object
 *
 * @param price trade price
 * @param quantity trade quantity
 * @constructor
 */
function Trade(price, quantity) {
    this.price = price;
    this.quantity = quantity;

    Object.freeze(this); // immutable
}

module.exports = Trade;