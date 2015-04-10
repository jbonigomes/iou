'use strict';

angular.module('iou.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

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
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams, iouref) {

  $scope.users = iouref.users;

  // we add chatMessages array to the scope to be used in our ng-repeat
  $scope.logs = iouref.logs;

  $scope.addLogs = function() {
    // calling $add on a synchronized array is like Array.push(),
    // except that it saves the changes to Firebase!
    $scope.logs.$add({
      bought: {},
      image: 'lightbulb',
      members: {
        '10152357995965379': true
      },
      name: 'A test log list'
    });

    // reset the message input
    // $scope.message = "";
  };
});
