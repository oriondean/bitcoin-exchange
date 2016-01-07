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
        var order = new Order("bid", 1, 1);

        matcher.onNewOrder(order);

        expect(matchSpy).toHaveBeenCalledWith(order, matcher.askOrders);
    });

    it("matches ask orders with bid orders", function() {
        var order = new Order("ask", 1, 1);

        matcher.onNewOrder(order);

        expect(matchSpy).toHaveBeenCalledWith(order, matcher.bidOrders)
    });

    it("removes any fully matched orders", function() {
        matcher.bidOrders = [new Order("bid", 15, 20)];

        expect(matcher.bidOrders.length).toBe(1);

        matcher.onNewOrder(new Order("ask", 15, 20));

        expect(matcher.bidOrders.length).toBe(0);
    });

    it("reduces quantity of any partially matched orders", function() {
        matcher.bidOrders = [new Order("bid", 25, 20)];

        matcher.onNewOrder(new Order("ask", 25, 10));

        expect(matcher.bidOrders[0].quantity).toBe(10);
    });

    it("adds new order if it isn't fully matched", function() {
        matcher.bidOrders = [new Order("bid", 25, 10)];

        matcher.onNewOrder(new Order("ask", 35, 20));

        expect(matcher.askOrders[0].quantity).toBe(10);
        expect(matcher.askOrders[0].price).toBe(35);
    });

    it("maintains sorting of bid orders by best price when new one is added", function() {
        matcher.bidOrders = [new Order("bid", 15, 10), new Order("bid", 20, 10), new Order("bid", 25, 10)];

        matcher.onNewOrder(new Order("bid", 30, 10));
        expect(matcher.bidOrders.map(function(order) { return order.price })).toEqual([15, 20, 25, 30]);

        matcher.onNewOrder(new Order("bid", 7, 10));
        expect(matcher.bidOrders.map(function(order) { return order.price })).toEqual([7, 15, 20, 25, 30]);

        matcher.onNewOrder(new Order("bid", 23, 10));
        expect(matcher.bidOrders.map(function(order) { return order.price })).toEqual([7, 15, 20, 23, 25, 30]);
    });

    it("maintains sorting of bid orders by time when new one is added", function() {
        matcher.bidOrders = [new Order("bid", 15, 10), new Order("bid", 15, 15)];

        matcher.onNewOrder(new Order("bid", 15, 20));

        expect(matcher.bidOrders[2].quantity).toBe(20);
    });

    it("maintains sorting of ask orders by best price when new one is added", function() {
        matcher.askOrders = [new Order("ask", 25, 10), new Order("ask", 20, 10), new Order("ask", 15, 10)];

        matcher.onNewOrder(new Order("ask", 30, 10));
        expect(matcher.askOrders.map(function(order) { return order.price })).toEqual([30, 25, 20, 15]);

        matcher.onNewOrder(new Order("ask", 7, 10));
        expect(matcher.askOrders.map(function(order) { return order.price })).toEqual([30, 25, 20, 15, 7]);

        matcher.onNewOrder(new Order("ask", 23, 10));
        expect(matcher.askOrders.map(function(order) { return order.price })).toEqual([30, 25, 23, 20, 15, 7]);
    });

    it("maintains sorting of ask orders by time when new one is added", function() {
        matcher.askOrders = [new Order("ask", 15, 10), new Order("ask", 15, 15)];

        matcher.onNewOrder(new Order("ask", 15, 20));

        expect(matcher.askOrders[2].quantity).toBe(20);
    });

    it("doesn't add new order if it is fully matched", function() {
        matcher.bidOrders = [new Order("bid", 25, 10)];

        matcher.onNewOrder(new Order("ask", 35, 10));

        expect(matcher.askOrders.length).toBe(0);
        expect(matcher.bidOrders.length).toBe(0);
    });

    it("matches bid order with best available ask order", function() {
        matcher.askOrders = [new Order("ask", 25, 10), new Order("ask", 24, 10)];

        matcher.onNewOrder(new Order("bid", 20, 10));

        expect(matcher.askOrders[0].price).toBe(24);
    });

    it("matches ask order with best available bid order", function() {
        matcher.bidOrders = [new Order("bid", 24, 10), new Order("bid", 25, 10)];

        matcher.onNewOrder(new Order("ask", 30, 10));

        expect(matcher.bidOrders[0].price).toBe(25);
    });

    it("matches orders at existing orders price", function() {
        matcher.bidOrders = [new Order("bid", 10, 15)];

        matcher.onNewOrder(new Order("ask", 20, 15));

        expect(matcher.trades[0].price).toBe(10);
        expect(matcher.trades[0].quantity).toBe(15);
    });

    it("matches orders at lowest quantity between them", function() {
        matcher.bidOrders = [new Order("bid", 10, 15)];

        matcher.onNewOrder(new Order("ask", 10, 30));

        expect(matcher.trades[0].price).toBe(10);
        expect(matcher.trades[0].quantity).toBe(15);
    });

});