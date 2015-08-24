
/* JavaScript content from app/core/signinService.js in folder common */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('signinService', signinService);

    signinService.$inject = ['$http', '$q'];

    /* @ngInject */
    function signinService($http, $q) {
        var service = {
            signin: signin,
            username: '',
            password: '',
            access: false
        };

        return service;

        ////////////////

        function signin() {
            var defer = $q.defer();
            $http.get('data/login.json')
                .success(function (data) {
                    defer.resolve(data);
                }).error(function(error){
                    console.log('historyDetail error: ' + error);
                });
            return defer.promise;
        }


    }

})();