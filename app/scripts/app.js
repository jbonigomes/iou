'use strict';

angular.module('IOU', [
  'ionic',
  'firebase',
  'ngCordovaOauth',
  'LocalStorageModule',
  'IOU.configuration',
  'IOU.routes',
  'IOU.controllers',
  'IOU.services',
  'IOU.directives',
  'IOU.filters'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  // $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
  //   if($state.includes('login') && (storage.get('FbId') === undefined)) {
  //     ev.preventDefault();
  //     $state.go('login');
  //   }
  // });
});
