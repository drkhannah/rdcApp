
/* JavaScript content from app/deposit/depositReview.js in folder common */
(function () {
    'use strict';

    angular
        .module('app.deposit')
        .config(stateProvider)
        .controller('DepositReviewController', DepositReviewController);

    stateProvider.$inject = ['$stateProvider'];
    DepositReviewController.$inject = ['accountsPromise', 'depositService', '$state', '$ionicHistory'];

    /* @ngInject */
    function stateProvider($stateProvider){
        $stateProvider
            .state('app.deposit-review', {
                url: '/deposit/deposit-review',
                views: {
                    'menuContent': {
                        templateUrl: 'app/deposit/depositReview.html',
                        controller: 'DepositReviewController as vm',
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
    function DepositReviewController(accountsPromise, depositService, $state, $ionicHistory) {
        /* jshint validthis: true */
        var vm = this;


        vm.activate = activate;
        vm.accountChange = accountChange;
        vm.addCheck = addCheck;
        vm.completeDeposit = completeDeposit;
        vm.deleteCheck = deleteCheck;
        vm.retake = retake;
        vm.getChecksTotal = getChecksTotal;
        vm.depositAmountChange = depositAmountChange;
        vm.cancelDeposit = depositService.cancelDeposit;
        vm.title = 'Deposit Review';
        vm.type = depositService.type;
        vm.amount = depositService.amount;
        vm.accounts = accountsPromise;
        vm.selectedAccount = depositService.account;
        vm.checks = depositService.checks;
        vm.checksTotalAmount = depositService.checksTotalAmount;

        activate();

        ////////////////

        function activate() {
            vm.getChecksTotal()
        }

        // calculate the amounts of checks in checks list and total them
        function getChecksTotal(){
            var total = 0;
            for(var i = 0; i < vm.checks.length; i++){
                var check = vm.checks[i];
                total += check.amount;
            }
            console.log('checks Total: ' + total);
            vm.checksTotalAmount = total;
        }

        function accountChange() {
            depositService.account = vm.selectedAccount;
            console.log('depositService Object: ' + angular.toJson(depositService));

        }

        function depositAmountChange() {
            vm.getChecksTotal();
            depositService.amount = vm.amount;
            console.log('depositService Object: ' + angular.toJson(depositService));

        }

        //Delete check from checks list, then retotal checks amount total
        function deleteCheck(index) {
            depositService.checks.splice(index, 1);
            vm.getChecksTotal();
            console.log ('depositService Object: ' + angular.toJson(depositService));
        }

        //retake image, deletes image from checks list, changes state to app.check-capture
        function retake(index) {
            $ionicHistory.clearCache();
            $state.go('app.capture-check');
            depositService.checks.splice(index, 1);
            vm.getChecksTotal();
            console.log ('depositService Object: ' + angular.toJson(depositService));
        }

        //changes state to app.check-capture
        function addCheck() {
            $ionicHistory.clearCache();
            $state.go('app.capture-check');
            console.log ('depositService Object: ' + angular.toJson(depositService));
        }

        // completes deposit
        function completeDeposit() {
            $ionicHistory.clearCache();
            $state.go('app.deposit-completed');
            console.log ('depositService Object: ' + angular.toJson(depositService));
        }

    }

})();