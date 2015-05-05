'use strict';


angular.module('IOU.directives', [])

.directive('ionSearch', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      getData: '&source',
      model: '=?',
      search: '=?filter'
    },

    link: function(scope, element, attrs) {

      attrs.minLength = attrs.minLength || 0;
      scope.placeholder = attrs.placeholder || '';
      scope.search = {value: ''};

      if(attrs.class) {
        element.addClass(attrs.class);
      }

      if(attrs.source) {
        scope.$watch('search.value', function (newValue) {
          if(newValue.length > attrs.minLength) {
            scope.getData({str: newValue}).then(function (results) {
              scope.model = results;
            });
          } else {
            scope.model = [];
          }
        });
      }

      scope.clearSearch = function() {
        scope.search.value = '';
      };
    },
    templateUrl: 'templates/search.html'
  };
});
