'use strict';

/**
 * @ngdoc service
 * @name newsubwayApp.passengerService
 * @description
 * # passengerService
 * Service in the newsubwayApp.
 */
angular.module('newsubwayApp')
  .service('passengerService', passengerService);
passengerService.$injector = ["$http"];
function passengerService($http) {

    var service = {
        createJsSdkOrder: createJsSdkOrder,
        getDiscount:getDiscount,
    };
    return service;

    function createJsSdkOrder(products) {
        return $http.post(Config.createJsSdkOrder, {products: products})
    }
    function getDiscount() {
        return $http.get(Config.order_discount)
    }
}
