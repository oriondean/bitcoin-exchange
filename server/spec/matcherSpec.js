var Matcher = require("../app/matcher");
var Order = require("../app/order/order");

describe("Matcher", function() {
    var matcher;

    var matchSpy;

    beforeEach(function() {
        matcher = new Matcher();

        matchSpy = spyOn(matcher, "match").and.callThrough();
    });

    it("matches bid orders with ask orders", function() {
        var order = new Order("sell", 1, 1);

        matcher.onNewOrder(order);

        expect(matchSpy).toHaveBeenCalledWith(order, matcher.askOrders);
    });

    it("matches ask orders with bid orders", function() {
        var order = new Order("buy", 1, 1);

        matcher.onNewOrder(order);

        expect(matchSpy).toHaveBeenCalledWith(order, matcher.bidOrders)
    });

    it("removes any fully matched orders", function() {
        matcher.bidOrders = [new Order("sell", 15, 20)];

        expect(matcher.bidOrders.length).toBe(1);

        matcher.onNewOrder(new Order("buy", 15, 20));

        expect(matcher.bidOrders.length).toBe(0);
    });

    it("reduces quantity of any partially matched orders", function() {
        matcher.bidOrders = [new Order("sell", 25, 20)];

        matcher.onNewOrder(new Order("buy", 25, 10));

        expect(matcher.bidOrders[0].quantity).toBe(10);
    });

    it("adds new order if it isn't fully matched", function() {
        matcher.bidOrders = [new Order("sell", 25, 10)];

        matcher.onNewOrder(new Order("buy", 35, 20));

        expect(matcher.askOrders[0].quantity).toBe(10);
        expect(matcher.askOrders[0].price).toBe(35);
    });

    it("maintains sorting of bid orders by best offer when new one is added", function() {
        matcher.bidOrders = [new Order("sell", 15, 10), new Order("sell", 20, 10), new Order("sell", 25, 10)];

        matcher.onNewOrder(new Order("sell", 30, 10));
        expect(matcher.bidOrders.map(function(order) { return order.price })).toEqual([15, 20, 25, 30]);

        matcher.onNewOrder(new Order("sell", 7, 10));
        expect(matcher.bidOrders.map(function(order) { return order.price })).toEqual([7, 15, 20, 25, 30]);

        matcher.onNewOrder(new Order("sell", 23, 10));
        expect(matcher.bidOrders.map(function(order) { return order.price })).toEqual([7, 15, 20, 23, 25, 30]);
    });

    it("maintains sorting of ask orders by best offer when new one is added", function() {
        matcher.askOrders = [new Order("buy", 25, 10), new Order("buy", 20, 10), new Order("buy", 15, 10)];

        matcher.onNewOrder(new Order("buy", 30, 10));
        expect(matcher.askOrders.map(function(order) { return order.price })).toEqual([30, 25, 20, 15]);

        matcher.onNewOrder(new Order("buy", 7, 10));
        expect(matcher.askOrders.map(function(order) { return order.price })).toEqual([30, 25, 20, 15, 7]);

        matcher.onNewOrder(new Order("buy", 23, 10));
        expect(matcher.askOrders.map(function(order) { return order.price })).toEqual([30, 25, 23, 20, 15, 7]);
    });

    it("doesn't add new order if it is fully matched", function() {
        matcher.bidOrders = [new Order("sell", 25, 10)];

        matcher.onNewOrder(new Order("buy", 35, 10));

        expect(matcher.askOrders.length).toBe(0);
        expect(matcher.bidOrders.length).toBe(0);
    });

    it("matches bid order with best available ask order", function() {
        matcher.askOrders = [new Order("buy", 25, 10), new Order("buy", 24, 10)];

        matcher.onNewOrder(new Order("sell", 20, 10));

        expect(matcher.askOrders[0].price).toBe(24);
    });

    it("matches ask order with best available bid order", function() {
        matcher.bidOrders = [new Order("sell", 24, 10), new Order("sell", 25, 10)];

        matcher.onNewOrder(new Order("buy", 30, 10));

        expect(matcher.bidOrders[0].price).toBe(25);
    });
});