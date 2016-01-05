var Order = require("../app/order/order");

describe("Order", function() {
    describe("invalid order action", function() {
        it("is thrown if order is provided with any action other than buy/sell", function() {
            expect(function() {
                new Order("test", 1, 1);
            }).toThrowError("Invalid order action");
        });

        it("isn't thrown for buy action", function() {
            expect(function() {
                new Order("buy", 1, 1);
            }).not.toThrowError("Invalid order action");
        });

        it("isn't thrown for sell action", function() {
            expect(function() {
                new Order("sell", 1, 1);
            }).not.toThrowError("Invalid order action");
        });
    });

    describe("invalid price", function() {
        it("is thrown if order is not provided a price", function() {
            expect(function() {
                new Order("sell", undefined, 1);
            }).toThrowError("Invalid price");
        });

        it("is thrown if order is provided a non-numeral price", function() {
            expect(function() {
                new Order("sell", null, 1);
            }).toThrowError("Invalid price");
        });

        it("isn't thrown if order is provided a numeral price", function() {
            expect(function() {
                new Order("sell", 1, 1);
            }).not.toThrowError("Invalid price");
        });

        it("isn't thrown if order is provided a negative price", function() {
            expect(function() {
                new Order("sell", -10, 1);
            }).not.toThrowError("Invalid price");
        });

        it("isn't thrown if order is provided a positive price", function() {
            expect(function() {
                new Order("sell", 5, 1);
            }).not.toThrowError("Invalid price");
        });
    });

    describe("invalid quantity", function() {
        it("is thrown if order is not provided a quantity", function() {
            expect(function() {
                new Order("sell", 1);
            }).toThrowError("Invalid quantity");
        });

        it("is thrown if order is provided a non-numeral quantity", function() {
            expect(function() {
                new Order("sell", 1, null);
            }).toThrowError("Invalid quantity");
        });

        it("is thrown if order is provided a zero quantity", function() {
            expect(function() {
                new Order("sell", 1, 0);
            }).toThrowError("Invalid quantity");
        });

        it("is thrown if order is provided a negative quantity", function() {
            expect(function() {
                new Order("sell", 1, -10);
            }).toThrowError("Invalid quantity");
        });

        it("isn't thrown if order is provided a positive quantity", function() {
            expect(function() {
                new Order("sell", 1, 5);
            }).not.toThrowError("Invalid quantity");
        });
    });

    describe("can match", function() {
        it("returns false for orders with the same action", function() {
            var order = new Order("buy", 1, 1);
            expect(order.canMatch(new Order("buy", 1, 1))).toBe(false);

            order = new Order("sell", 1, 1);
            expect(order.canMatch(new Order("sell", 1, 1))).toBe(false);
        });

        it("returns true if order prices are equal", function() {
            var order = new Order("buy", 1, 1);
            expect(order.canMatch(new Order("sell", 1, 1))).toBe(true);

            order = new Order("sell", 1, 1);
            expect(order.canMatch(new Order("buy", 1, 1))).toBe(true);
        });

        it("returns false if buy order price is lower than sell order price", function() {
            var order = new Order("buy", 1, 1);
            expect(order.canMatch(new Order("sell", 2, 1))).toBe(false);
        });

        it("returns false if sell order price is higher than buy order price", function() {
            var order = new Order("sell", 2, 1);
            expect(order.canMatch(new Order("buy", 1, 1))).toBe(false);
        });
    });
});