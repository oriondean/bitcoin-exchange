/**
 * Immutable trade object
 *
 * @param aggressor order which caused the trade to happen
 * @param matched existing order that was matched by new order entering market
 * @constructor
 */
function Trade(aggressor, matched) {
    this.buyOrder = aggressor.isBid() ? matched : aggressor;
    this.sellOrder = aggressor.isBid() ? aggressor : matched;

    this.aggressor = aggressor;

    this.created = Date.now();

    Object.freeze(this); // immutable
}

module.exports = Trade;