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

  $scope.user = {
    fbid: '10152357995965379',
    username: 'Jose'
  };
})


.controller('HomeCtrl', function($scope) {
  $scope.lists = [{
    id: 1,
    title: 'BBQ on Sunday',
    total: 10,
    type: 'negative-total',
    image: 'bag'
  },{
    id: 2,
    title: 'Tesco\'s Groceries',
    total: 20,
    type: 'positive-total',
    image: 'book'
  },{
    id: 3,
    title: 'Households',
    total: 0,
    type: 'neutral-total',
    image: 'bookshelf'
  }];

  $scope.total = {
    value: 10,
    type: 'positive-total'
  };
})


.controller('ProductsCtrl', function($scope) {

  $scope.tobuy = [{
    id: 1,
    title: 'Potatoes'
  },{
    id: 2,
    title: 'Carrots'
  },{
    id: 3,
    title: 'Bananas'
  }];

  $scope.bought = [{
    id: 1,
    title: 'Carrots',
    owner: '10152357995965379',
    price: 10,
    date: 1412635438623,
    amended: false
  },{
    id: 2,
    title: 'Bananas',
    owner: '10152357995965379',
    price: 10,
    date: 1412635438623,
    amended: false
  },{
    id: 3,
    title: 'Potatoes',
    owner: '10152357995965379',
    price: 10,
    date: 1412635438623,
    amended: true
  },{
    id: 4,
    title: 'Apples',
    owner: '10152357995965379',
    price: 10,
    date: 1412635438623,
    amended: false
  }];

  $scope.total = {
    value: 10,
    type: 'positive-total'
  };

})


.controller('NewProductCtrl', function($scope) {

})


.controller('EditProductCtrl', function($scope) {

})


.controller('MembersCtrl', function($scope) {

})


.controller('NewListCtrl', function($scope) {

});
