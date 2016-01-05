var Order = require("../app/order/Order");

describe("Order", function() {
    describe("invalid order action", function() {
        it("is thrown if order is provided with any action other than buy/sell", function() {
            expect(function() {
                new Order({ action: "test", price: 0, quantity: 0 })
            }).toThrowError("Invalid order action");
        });

        it("isn't thrown for buy action", function() {
            expect(function() {
                new Order({ action: "buy", price: 0, quantity: 0 })
            }).not.toThrowError("Invalid order action");
        });

        it("isn't thrown for sell action", function() {
            expect(function() {
                new Order({ action: "sell", price: 0, quantity: 0 })
            }).not.toThrowError("Invalid order action");
        });
    });

    describe("invalid price", function() {
        it("is thrown if order is not provided a price", function() {
            expect(function() {
                new Order({ action: "sell", quantity: 0 })
            }).toThrowError("Invalid price");
        });

        it("is thrown if order is provided a non-numeral price", function() {
            expect(function() {
                new Order({ action: "sell", price: null, quantity: 0 })
            }).toThrowError("Invalid price");
        });

        it("isn't thrown if order is provided a numeral price", function() {
            expect(function() {
                new Order({ action: "sell", price: 0, quantity: 0 })
            }).not.toThrowError("Invalid price");
        });

        it("isn't thrown if order is provided a negative price", function() {
            expect(function() {
                new Order({ action: "sell", price: -10, quantity: 0 })
            }).not.toThrowError("Invalid price");
        });
    });

    describe("invalid quantity", function() {
        it("is thrown if order is not provided a quantity", function() {
            expect(function() {
                new Order({ action: "sell", price: 0 })
            }).toThrowError("Invalid quantity");
        });

        it("is thrown if order is provided a non-numeral quantity", function() {
            expect(function() {
                new Order({ action: "sell", price: 0, quantity: null })
            }).toThrowError("Invalid quantity");
        });

        it("isn't thrown if order is provided a numeral quantity", function() {
            expect(function() {
                new Order({ action: "sell", price: 0, quantity: 0 })
            }).not.toThrowError("Invalid quantity");
        });

        it("isn't thrown if order is provided a negative quantity", function() {
            expect(function() {
                new Order({ action: "sell", price: 0, quantity: -10 })
            }).not.toThrowError("Invalid quantity");
        });
    });
});