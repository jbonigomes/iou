'use strict';


angular.module('IOU.services', [])

.factory('IOURef', function(ENV) {
  return new Firebase(ENV.apiEndpoint);
})

.factory('GenericServices', function() {
  return {
    priceType: function(price) {
      if(price > 0) {
        return 'positive-total';
      }
      else if(price < 0) {
        return 'negative-total';
      }

      return 'neutral-total';
    },

    membersToArr: function(members) {
      var membersArr = [];

      angular.forEach(members, function(member, key) {
        if(member) {
          membersArr.push(key);
        }
      });

      return membersArr;
    }
  }
})

.factory('Login', function(localStorageService, IOURef) {
  var Login = {
    login: function(userdata) {
      localStorageService.set('userId', userdata.id);
      localStorageService.set('userName', userdata.name);
      localStorageService.set('userToken', userdata.token);
      localStorageService.set('userEmail', userdata.email);

      return true;
    },

    logout: function() {
      localStorageService.clearAll();
      IOURef.unauth();

      return true;
    },

    isLoggedIn: function() {
      return IOURef.getAuth();
    }
  };

  return Login;
})


.factory('ListsWithTotal', function($firebaseArray, GenericServices, localStorageService) {

  var ListWithTotal = $firebaseArray.$extend({
    withTotals: function() {
      var total     = 0;
      var fullLists = [];
      var currUser  = localStorageService.get('userId');

      angular.forEach(this.$list, function(list) {
        var innertotal = 0;

        if(GenericServices.membersToArr(list.members).indexOf(currUser) >= 0) {

          angular.forEach(list.bought, function(product) {

            if(currUser === product.owner) {
              total      = parseFloat(total) + parseFloat(product.price);
              innertotal = parseFloat(innertotal) + parseFloat(product.price);
            }
            else {
              total      = parseFloat(total) - parseFloat(product.price);
              innertotal = parseFloat(innertotal) - parseFloat(product.price);
            }
          });

          fullLists.push({
            data: list,
            total: Math.abs(innertotal),
            type: GenericServices.priceType(innertotal)
          });
        }
      });

      return {
        lists: fullLists,
        value: Math.abs(total),
        type: GenericServices.priceType(total)
      };
    }
  });

  return function(listRef) {
    return new ListWithTotal(listRef);
  }
});
