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


.factory('MembersWithTotal', function(GenericServices) {

  return {
    list: function(members, products, userid) {

      var weight = 0;
      var average = 0;
      var listtotal = 0;
      var totaloverspent = 0;
      var memberswithtotals = [];
      var usersthatboughtsomething = {};

      // let's start getting the list total
      // since we are looping, we may as well get how much each user spent
      angular.forEach(products, function(product) {
        listtotal += parseFloat(product.price);

        if(usersthatboughtsomething[product.owner] === undefined) {
          usersthatboughtsomething[product.owner] = parseFloat(product.price);
        }
        else {
         usersthatboughtsomething[product.owner] += parseFloat(product.price);
        }
      });

      // we have to cater for users that did not buy anything too
      angular.forEach(members, function(member) {
        if(usersthatboughtsomething[member.data.id] === undefined) {
          usersthatboughtsomething[member.data.id] = 0;
        }
      });

      // let's find the list average
      average = parseFloat(listtotal) / parseFloat(members.length);

      // and the total overspent
      angular.forEach(usersthatboughtsomething, function(value) {
        if(value > average) {
          totaloverspent += parseFloat(value) - parseFloat(average)
        }
      });

      // we now need to know if the logged user is a debtor, a creditor or is even
      // if the logged user is a creditor, then the debtors owe him money
      if(usersthatboughtsomething[userid] > average) {

        // from everything that has been overspent, the current user has
        // overspent a percentage of it, we need to calculate that
        weight = ((parseFloat(usersthatboughtsomething[userid]) - parseFloat(average)) * parseFloat(100)) / parseFloat(totaloverspent);

        // we can now build our return array
        angular.forEach(usersthatboughtsomething, function(value, key) {
          // ignoring creditors, those who are even and the current logged user
          if(key !== userid && value < average) {
            var totaldebt = ((parseFloat(average) - parseFloat(value)) * parseFloat(weight)) / parseFloat(100);
            var returnobj = {
              id: key,
              name: 'testname',
              total: Math.abs(totaldebt),
              type: 'negative-total'
            };

            memberswithtotals.push(returnobj);
          }
          else if(key !== userid) {
            var returnobj = {
              id: key,
              name: 'testname',
              total: 0,
              type: 'neutral-total'
            };

            memberswithtotals.push(returnobj);
          }
        });
      }
      // if the logged user is a debtor, then he owes money to the creditors
      else if (usersthatboughtsomething[userid] < average) {

        var totaltopayback = parseFloat(average) - parseFloat(usersthatboughtsomething[userid]);

        // we can now build our return array
        angular.forEach(usersthatboughtsomething, function(value, key) {
          // ignoring debtors, those who are even and the current logged user
          if(key !== userid && value > average) {

            // From the total to pay back, a debtor has to pay the due percentage
            // for each of the creditors
            weight = (parseFloat(value) * parseFloat(100)) / parseFloat(totaloverspent);

            var totaldebt = (parseFloat(weight) * parseFloat(totaltopayback)) / parseFloat(100);
            var returnobj = {
              id: key,
              name: 'testname',
              total: Math.abs(totaldebt),
              type: 'negative-total'
            };

            memberswithtotals.push(returnobj);
          }
          else if(key !== userid) {
            var returnobj = {
              id: key,
              name: 'testname',
              total: 0,
              type: 'neutral-total'
            };

            memberswithtotals.push(returnobj);
          }
        });

      }
      // otherwise, he is even with everyone
      else {
        angular.forEach(usersthatboughtsomething, function(value, key) {
          if(key !== userid) {
            var returnobj = {
              id: key,
              name: 'testname',
              total: 0,
              type: 'neutral-total'
            };

            memberswithtotals.push(returnobj);
          }
        });
      }

      return {
        members: memberswithtotals,
        total: {
          value: Math.abs(parseFloat(usersthatboughtsomething[userid]) - parseFloat(average)),
          type: GenericServices.priceType(parseFloat(usersthatboughtsomething[userid]) - parseFloat(average))
        }
      };
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
