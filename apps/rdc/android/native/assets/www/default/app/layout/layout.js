
/* JavaScript content from app/layout/layout.js in folder common */
(function () {
    'use strict';

    angular
        .module('app.layout')
        .config(stateProvider)
        .controller('LayoutController', LayoutController);

    stateProvider.$inject = ['$stateProvider', '$urlRouterProvider'];
    LayoutController.$inject = ['$ionicModal', '$scope', 'signinService', '$state', '$ionicHistory'];

    /* @ngInject */
    function stateProvider($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                templateUrl: 'app/layout/layout.html',
                controller: 'LayoutController as vm'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app');
    }

    /* @ngInject */
    function LayoutController($ionicModal, $scope, signinService, $state, $ionicHistory) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.signin = signin;
        vm.usernameChange = usernameChange;
        vm.passwordChange = passwordChange;
        vm.signout = signout;
        vm.checkAccess = checkAccess;
        vm.title = 'KTT mRDC';
        vm.depositLink = 'DEPOSIT';
        vm.historyLink = 'HISTORY';
        vm.signoutLink = 'SIGNOUT';
        vm.username = signinService.username;
        vm.password = signinService.password;

        activate();

        ////////////////

        function activate() {
            checkAccess();
        }

        function checkAccess() {
            if(!signinService.access){
                $ionicModal.fromTemplateUrl('app/layout/signin.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show()
                });
            }
        }

        function signin(){
            if(signinService.username === 'admin' && signinService.password === 'admin')
                signinService.signin().then(function(){
                    signinService.access = true;
                    $scope.modal.hide();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicHistory.clearCache();
                    $state.go('app.deposit');
                })
        }

        function usernameChange() {
            signinService.username = vm.username;
        }

        function passwordChange() {
            signinService.password = vm.password;
        }

        function signout() {
            signinService.access = false;
            checkAccess();
        }
    }
})();