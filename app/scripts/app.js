'use strict';

angular.module('IOU', [
  'ionic',
  'firebase',
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
});
