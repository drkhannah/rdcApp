(function () {
    'use strict';

    angular
        .module('app.deposit')
        .config(stateProvider)
        .controller('CaptureCheckController', CaptureCheckController);

    stateProvider.$inject = ['$stateProvider'];
    CaptureCheckController.$inject = ['accountsPromise', 'depositService', '$state', '$ionicHistory', '$timeout', '$ionicPopup'];

    /* @ngInject */
    function stateProvider($stateProvider){
        $stateProvider
            .state('app.capture-check', {
                url: '/deposit/capture-check',
                views: {
                    'menuContent': {
                        templateUrl: 'app/deposit/catureCheck.html',
                        controller: 'CaptureCheckController as vm',
                        resolve: {
                            accountsPromise: function(depositService){
                                return depositService.loadAccounts();
                            }

                        }
                    }
                }
            })
    }

    /* @ngInject */
    function CaptureCheckController(accountsPromise, depositService, $state, $ionicHistory, $timeout, $ionicPopup) {
        /* jshint validthis: true */
        var vm = this;


        vm.activate = activate;
        vm.accountChange = accountChange;
        vm.miSnapCheckFront = miSnapCheckFront;
        vm.miSnapCheckBack = miSnapCheckBack;
        vm.submitCheck = submitCheck;
        vm.depositAmountChange = depositAmountChange;
        vm.checkAmountChange = checkAmountChange;
        vm.cancelCheck = cancelCheck;
        vm.cancelDeposit = depositService.cancelDeposit;
        vm.title = 'Capture Check';
        vm.type = depositService.type;
        vm.amount = depositService.amount;
        vm.checkAmount = undefined;
        vm.accounts = accountsPromise;
        vm.selectedAccount = depositService.account;
        vm.checks = depositService.checks;
        vm.checkFrontImage = depositService.checkFrontImage;
        vm.checkBackImage = depositService.checkBackImage;
        vm.frontCheckLoading = false;
        vm.backCheckLoading = false;


        activate();

        ////////////////

        function activate() {

        }

        function accountChange() {
            depositService.account = vm.selectedAccount;
            console.log('depositService Object: ' + angular.toJson(depositService));

        }

        function depositAmountChange() {
            depositService.amount = vm.amount;
            console.log('depositService Object: ' + angular.toJson(depositService));

        }

        function checkAmountChange() {
            depositService.checkAmount = vm.checkAmount;
            console.log('depositService Object: ' + angular.toJson(depositService));

        }

        function miSnapCheckFront(){

            if(cordova !== undefined){
            vm.frontCheckLoading = true;
            cordova.exec(
                // Register the callback handler
                function callback(data) {
                    //console.log('original Image: ' + data.OriginalImage);
                    //console.log('Encoded Image: ' + data.EncodedImage);
                    //console.log('result dictionary: ' + angular.toJson(data.ResultDictionary));
                    depositService.checkFrontImage = data.EncodedImage;
                    vm.checkFrontImage = depositService.checkFrontImage;
                    console.log('vm.checkfrontimage : ' + vm.checkFrontImage);
                    console.log('depositService checkfrontimage : ' + depositService.checkFrontImage);
                    vm.frontCheckLoading = false;
                    $state.go($state.current, {}, {reload: true});
                    console.log('after reload vm.checkfrontimage : ' + vm.checkFrontImage);
                    console.log('after reload depositService checkfrontimage : ' + depositService.checkFrontImage);
                },
                // Register the errorHandler
                function errorHandler(err) {
                    alert('MiSnap is Cancelled: ' + err);
                },
                // Define what class to route messages to
                'MiSnapPlugin',
                // Execute this method on the above class
                'cordovaCallMiSnap',
                //Arguments
                []);
            } else {
                alert('You need to be on a device for this to work')
            }


            /*$timeout(function() {
                vm.frontCheckLoading = false;
                depositService.checkFrontImage = accountsPromise[0].checkFrontImage;
                vm.checkFrontImage = depositService.checkFrontImage;
                console.log ('depositService Object: ' + angular.toJson(depositService));
            }, 3000);*/
        }

        function miSnapCheckBack(){
            vm.backCheckLoading = true;

            $timeout(function() {
                vm.backCheckLoading = false;
                depositService.checkBackImage = accountsPromise[0].checkBackImage;
                vm.checkBackImage = depositService.checkBackImage;
                console.log ('depositService Object: ' + angular.toJson(depositService));
            }, 3000);
        }

        function submitCheck() {
            vm.frontCheckLoading = true
            depositService.loadAccounts().then(vm.frontCheckLoading = false);
                $ionicHistory.clearCache();
                $state.go('app.deposit-review');

                depositService.checks.push({
                    "checkFrontImage": vm.checkFrontImage,
                    "checkBackImage": vm.checkBackImage,
                    "amount": vm.checkAmount
                });
                depositService.checkFrontImage = undefined;
                depositService.checkBackImage = undefined;
                depositService.checkAmount = undefined;

                console.log('depositService Object: ' + angular.toJson(depositService));
        }

        function cancelCheck() {
            $ionicPopup.show({
                title: "Dont Save Check",
                template: "Are you sure you don't want to save this check to your deposit?",
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
                    $ionicHistory.clearCache();
                    $state.go('app.deposit-review');
                    depositService.checkAmount = undefined;
                    depositService.checkFrontImage = undefined;
                    depositService.checkBackImage = undefined;
                    console.log('depositService Object: ' + angular.toJson(depositService));
                } else {
                    console.log("Don't Cancel Check Submition");
                }
            });
        }
    }

})();