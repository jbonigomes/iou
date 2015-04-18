'use strict';

angular.module('IOU', [
  'ionic',
  'firebase',
  'ngCordovaOauth',
  'IOU.configuration',
  'IOU.routes',
  'IOU.controllers',
  'IOU.services',
  'IOU.directives',
  'IOU.filters'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default
    // (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  // $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
  //   // if route requires auth and user is not logged in
  //   if($state.includes('login') && (storage.get('FbId') === undefined)) {
  //     // redirect back to login
  //     ev.preventDefault();
  //     $state.go('login');
  //   }
  // });
});

// http interceptors
// .config(['$httpProvider', function($httpProvider) {

//   var logsOutUserOn401 = ['$q', '$location', function ($q, $location) {
//     var success = function (response) {
//       return response;
//     };

//     var error = function (response) {
//       if (response.status === 401) {
//         //redirect them back to login page
//         $location.path('/');

//         return $q.reject(response);
//       }
//       else {
//         return $q.reject(response);
//       }
//     };

//     return function (promise) {
//       return promise.then(success, error);
//     };
//   }];

//   $httpProvider.responseInterceptors.push(logsOutUserOn401);

// }]);
