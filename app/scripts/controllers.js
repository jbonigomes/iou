'use strict';

angular.module('IOU.controllers', [])


.controller('LoginCtrl', function($scope, $ionicModal) {
  $ionicModal.fromTemplateUrl('templates/terms_modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.termsmodal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/privacy_modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.privacymodal = modal;
  });

  $scope.closeTermsModal = function() {
    $scope.termsmodal.hide();
  };

  $scope.openTermsModal = function() {
    $scope.termsmodal.show();
  };

  $scope.closePrivacyModal = function() {
    $scope.privacymodal.hide();
  };

  $scope.openPrivacyModal = function() {
    $scope.privacymodal.show();
  };

  $scope.acceptedterms = true;

  var ref = new Firebase("https://josefirebaseseed.firebaseio.com/");

  // prefer pop-ups, so we don't navigate away from the page
  ref.authWithOAuthPopup("facebook", function(error, authData) {
    console.log('doing fb');
    if (error) {
      console.log('err fb');
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        // fall-back to browser redirects, and pick up the session
        // automatically when we come back to the origin page
        ref.authWithOAuthRedirect("google", function(error) { /* ... */ });
      }
    } else if (authData) {
      console.log('success fb');
      // user authenticated with Firebase
    }
  });
})


.controller('AppCtrl', function($scope, $state) {

  $scope.user = {
    fbid: '10152357995965379',
    username: 'Jose'
  };

  $scope.listid = null;

  $scope.noitems = false;
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


.controller('ProductsCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/price.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.openModal = function() {
    $scope.modal.show();
  };

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


.controller('AddMemberCtrl', function($scope) {
  $scope.members = [{
    name: 'Nik',
    fbid: '10152357995965379'
  },{
    name: 'Andy',
    fbid: '10152357995965379'
  },{
    name: 'Gabe',
    fbid: '10152357995965379'
  }];
})


.controller('NewListCtrl', function($scope) {

});
