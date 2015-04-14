'use strict';

angular.module('IOU.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal, $state) {

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

  $scope.user = {
    fbid: '10152357995965379',
    username: 'Jose'
  };

  $scope.listid = null;
})


.controller('HomeCtrl', function($scope) {

  $scope.goToList = function(listid) {
    $scope.listid = listid;
    $state.go('app.products');
  };

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


.controller('NewProductCtrl', function($scope, $ionicHistory) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }
})


.controller('EditProductCtrl', function($scope) {
  $scope.product = {
    id: 1,
    title: 'Carrots',
    owner: '10152357995965379',
    price: 10,
    date: 1412635438623,
    amended: false
  };
})


.controller('MembersCtrl', function($scope) {
  $scope.members = [{
    name: 'Nik',
    fbid: '10152357995965379',
    total: 10,
    type: 'positive-total'
  },{
    name: 'Andy',
    fbid: '10152357995965379',
    total: 10,
    type: 'negative-total'
  },{
    name: 'Gabe',
    fbid: '10152357995965379',
    total: 10,
    type: 'neutral-total'
  }];

  $scope.total = {
    value: 10,
    type: 'positive-total'
  };
})


.controller('NewListCtrl', function($scope) {

});
