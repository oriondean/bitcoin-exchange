'use strict';
var module = angular.module('order-book', []);

module.directive("orderBook", function() {
    // directive definition docs: https://docs.angularjs.org/api/ng/service/$compile#directive-definition-object
    return {
        restrict: "E",
        scope: {},
        templateUrl: "scripts/order-book/template.html",
        controller: function() {
            this.orders = [
                { action: "Buy", price: 15.5, quantity: 32.5 },
                { action: "Buy", price: 22.3, quantity: 55.1 },
                { action: "Sell", price: 25.5, quantity: 159.5 },
                { action: "Buy", price: 6.5, quantity: 8.5 }
            ];
        },
        controllerAs: "controller"
    };
});
