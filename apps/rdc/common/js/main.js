function wlCommonInit(){
	/*
	 * Use of WL.Client.connect() API before any connectivity to a MobileFirst Server is required. 
	 * This API should be called only once, before any other WL.Client methods that communicate with the MobileFirst Server.
	 * Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
    */

	WL.Client.connect({
		onSuccess: onConnectSuccess,
		onFailure: onConnectFailure
	});
	     
	 function onConnectSuccess() {
		 //sniff for environment
		 console.log('onConnectSuccess');
		 var env = WL.Client.getEnvironment();
		 if (env === WL.Environment.IPHONE || env === WL.Environment.IPAD) {
			 document.body.classList.add('platform-ios');
		 } else if (env === WL.Environment.ANDROID) {
			 document.body.classList.add('platform-android');
		 }

		 //bootstrap angular
		 angular.element(document).ready(function () {
			 angular.bootstrap(document, ['app']);
		 });
	 }

	 function onConnectFailure() {
		 console.log('onConnectFailure');
	 }
}
