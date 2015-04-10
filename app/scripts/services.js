'use strict';

angular.module('iou.services', [])

.factory('iouref', function($firebaseArray) {
    var ref = new Firebase('https://ioutest.firebaseio.com/');
    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
);
