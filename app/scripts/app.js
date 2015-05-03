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
});
