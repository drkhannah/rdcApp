(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('depositService', depositService);

    depositService.$inject = ['$http', '$q', '$ionicHistory', '$state', '$ionicPopup'];

    /* @ngInject */
    function depositService($http, $q, $ionicHistory, $state, $ionicPopup) {
        var service = {
            loadAccounts: loadAccounts,
            cancelDeposit: cancelDeposit,
            type: undefined,
            account: undefined,
            amount: undefined,
            checksTotalAmount: undefined,
            checkAmount: undefined,
            checkFrontImage: undefined,
            checkBackImage: undefined,
            checks: []
        };

        return service;

        ////////////////

        function loadAccounts() {
            var defer = $q.defer();
            $http.get('data/depositAccounts.json')
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function (error) {
                    console.log('loadAccounts() error:' + error)
                });
            return defer.promise;
        }

        function cancelDeposit() {

            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            $ionicPopup.show({
                title: "Cancel Deposit",
                template: "Are you sure you want to completely cancel this deposit?",
                buttons: [{
                    text: 'No',
                    type: 'button-stable',
                    onTap: function(e) {
                        // e.preventDefault() will stop the popup from closing when tapped.
                        //e.preventDefault();
                        return false;
                    }
                }, {
                    text: 'YES',
                    type: 'button-positive',
                    onTap: function(e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        return true;
                    }
                }]
            }).then(function(res) {
                if(res) {
                    service.account = undefined;
                    service.type = undefined;
                    service.amount = undefined;
                    service.checkAmount = undefined;
                    service.checksTotalAmount = undefined;
                    service.checkFrontImage = undefined;
                    service.checkBackImage = undefined;
                    service.checks = [];
                    $ionicHistory.clearCache();
                    $state.go('app.deposit');

                    console.log ('depositService Object: ' + angular.toJson(service));
                } else {
                    console.log("Still doing deposit");
                }
            });
        }

    }
    
})();