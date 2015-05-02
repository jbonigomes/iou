'use strict';


angular.module('IOU', [
  'ionic',
  'firebase',
  'LocalStorageModule',
  'IOU.configuration',
  'IOU.routes',
  'IOU.controllers',
  'IOU.services',
  'IOU.directives',
  'IOU.filters'
])


.run(function($ionicPlatform, $state, $rootScope, $ionicListDelegate, Login) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    if(requireLogin && (!Login.isLoggedIn())) {
      event.preventDefault();
      $state.go('login');
    }

    $ionicListDelegate.closeOptionButtons();
  });
})


// http interceptors
// http://thecodebarbarian.com/2015/01/24/angularjs-interceptors
.config(function($httpProvider) {

  var logsOutUserOn401 = ['$q', '$state', function ($q, $state) {
    var success = function (response) {
      return response;
    };

    var error = function (response) {
      if (response.status === 401) {
        $state.go('login');
        return $q.reject(response);
      }
      else {
        return $q.reject(response);
      }
    };

    return function (promise) {
      return promise.then(success, error);
    };
  }];

  $httpProvider.responseInterceptors.push(logsOutUserOn401);

});
