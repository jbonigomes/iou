'use strict';


angular.module('IOU.filters', [])


.filter('iif', function () {
  return function(input, trueValue, falseValue) {
    return input ? trueValue : falseValue;
  };
});
