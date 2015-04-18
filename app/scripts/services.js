'use strict';


angular.module('IOU.services', [])

.factory('iouref', function(ENV) {
  return new Firebase(ENV.apiEndpoint);
});
