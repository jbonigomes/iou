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
  };
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
  };
})


.factory('Facebook', function (ENV, $http) {

  var Facebook = {
    getPerson: function(fbid, token) {
      return $http.get(ENV.facebookEndpoint + fbid + '?access_token=' + token);
    },

    getFriends: function (fbid, token) {
      return $http.get(ENV.facebookEndpoint + fbid + '/friends?access_token=' + token);
    }
  };

  return Facebook;

})


.factory('MembersWithTotal', function() {

  return {
    list: function(members, products, userid) {

      var usersthatboughtsomething = [];

      // let's start getting the list total
      var listtotal = 0;

      // since we are looping, we may as well get how much each user spent too
      angular.forEach(products, function(product) {
        listtotal += parseFloat(product.price);

        if(usersthatboughtsomething[product.owner] === undefined) {
          usersthatboughtsomething[product.owner] = parseFloat(product.price);
        }
        else {
         usersthatboughtsomething[product.owner] += parseFloat(product.price);
        }
      });

      // let's find the list average
      var average = parseFloat(listtotal) / parseFloat(members.length);

      // let's get the percentage nested in our final array
      angular.forEach(members, function(member) {
        // we have to cater for users that did not buy anything too
        if(usersthatboughtsomething[member.data.id] === undefined) {
          usersthatboughtsomething[member.data.id] = 0;
        }

        // if the guy spent more than the average, then he is a creditor
        // if he spent less, he is a debtor
        // otherwise he is even
      });

      console.log(usersthatboughtsomething);
    }
  };

})


.factory('BoughtProducts', function($firebaseArray, GenericServices, localStorageService) {

  var BoughtProducts = $firebaseArray.$extend({
    total: function() {
      var total    = 0;
      var currUser = localStorageService.get('userId');

      angular.forEach(this.$list, function(product) {

        if(currUser === product.owner) {
          total = parseFloat(total) + parseFloat(product.price);
        }
        else {
          total = parseFloat(total) - parseFloat(product.price);
        }
      });

      return {
        value: Math.abs(total),
        type: GenericServices.priceType(total)
      };
    }
  });

  return function(listRef) {
    return new BoughtProducts(listRef);
  };
});
