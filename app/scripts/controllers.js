'use strict';

angular.module('IOU.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('HomeCtrl', function($scope) {
  $scope.lists = [{
    id: 1,
    title: 'BBQ on Sunday',
    total: 10,
    type: 'negative'
  },{
    id: 2,
    title: 'Tesco\'s Groceries',
    total: 20,
    type: 'positive'
  },{
    id: 3,
    title: 'Households',
    total: 0,
    type: 'neutral'
  }];

  $scope.total = {
    value: 10,
    type: 'negative'
  };
})

.controller('PrivacyCtrl', function() {

})

.controller('TermsCtrl', function() {
  
});
