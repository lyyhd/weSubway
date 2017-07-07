'use strict';

/**
 * @ngdoc service
 * @name newsubwayApp.questionService
 * @description
 * # questionService
 * Service in the newsubwayApp.
 */
angular.module('newsubwayApp')
  .service('questionService',questionService);
questionService.$injector = ["$http"];
function questionService($http) {

    var service = {
        getQuestions: getQuestions,
        getAnswer: getAnswer,
    };
    return service;


    function getQuestions() {
        return $http.get(Config.questions);
    }
    function getAnswer(questionId) {
        return $http.get(Config.answer,{params:{"questionId": questionId}});
    }
}
