'use strict';


angular.module('IOU.services', [])

.factory('IOURef', function(ENV) {
  return new Firebase(ENV.apiEndpoint);
})

.factory('Login', function(localStorageService) {
  var Login = {
    login: function(userdata) {
      localStorageService.set('userId', userdata.id);
      localStorageService.set('userName', userdata.name);
      localStorageService.set('userToken', userdata.token);
      localStorageService.set('userEmail', userdata.email);
    },

    logout: function() {
      localStorageService.clearAll();
    };
  };
});
