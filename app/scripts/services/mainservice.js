'use strict';

/**
 * @ngdoc service
 * @name newsubwayApp.mainService
 * @description
 * # mainService
 * Service in the newsubwayApp.
 */
angular.module('newsubwayApp')
  .service('mainService', function ($http) {
      this.inject=["$http"];

      var service = {
          orders: orders,
          recycle: recycle,
      };
      return service;

    function orders(uid,status) {
      console.log('get orders server');
         return $http.get(Config.order_url, {params:{"user_id": uid, "status": status}});
    }
    function recycle(orderId) {
        return $http.get(Config.url_prefix+'/order/'+orderId+'/recycle');
    }
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
