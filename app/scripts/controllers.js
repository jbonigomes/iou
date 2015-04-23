'use strict';

angular.module('IOU.controllers', [])


.controller('LoginCtrl', function($scope, $ionicModal, $firebaseAuth, $cordovaOauth, $state, IOURef, Login) {

  var auth = $firebaseAuth(IOURef);

  $scope.loginUIdata = {
    loginerror: false,
    acceptedterms: true
  }

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

  // must set this guy in the facebook app http://localhost/callback
  // $scope.login = function() {
  //   if($scope.loginUIdata.acceptedterms) {
  //     $cordovaOauth.facebook('379065752294307', ['email','user_friends']).then(function(result) {
  //       auth.$authWithOAuthToken('facebook', result.access_token).then(function(authData) {
  //         var userdata = {
  //           id: oauthdata.facebook.id,
  //           name: oauthdata.facebook.displayName,
  //           email: oauthdata.facebook.email,
  //           token: oauthdata.facebook.accessToken
  //         };

  //         Login.login(userdata);

  //         $state.go('app.home');
  //       }, function(error) {
  //         $scope.loginUIdata.loginerror = true;
  //       });
  //     }, function(error) {
  //       $scope.loginUIdata.loginerror = true;
  //     });
  //   }
  // };

  // must set this bad boy on facebook to
  // https://auth.firebase.com/v2/ioutest/auth/facebook/callback
  $scope.login = function () {

    if($scope.loginUIdata.acceptedterms === true) {
      auth.$authWithOAuthPopup('facebook', { scope: 'email,user_friends' }).then(function(oauthdata) {
        var userdata = {
          id: oauthdata.facebook.id,
          name: oauthdata.facebook.displayName,
          email: oauthdata.facebook.email,
          token: oauthdata.facebook.accessToken
        };

        Login.login(userdata);

        $state.go('app.home');
      }).catch(function(error) {
        $scope.loginUIdata.loginerror = true;
      });
    }
  };

})


.controller('AppCtrl', function($scope, localStorageService, Login) {

  $scope.userdata = {
    listid: null,
    noitems: true,
    showhomeicon: false,
    id: localStorageService.get('userId'),
    name: localStorageService.get('userName'),
    token: localStorageService.get('userToken'),
    email: localStorageService.get('userEmail')
  };

  $scope.logout = function() {
    Login.logout();
    window.location.reload();
  };
})


.controller('HomeCtrl', function($scope, $state, $firebaseArray, IOURef, ListsWithTotal) {

  var watcher = $firebaseArray(IOURef);

  $scope.userdata.showhomeicon = false;
  $scope.userdata.noitems = true;

  $scope.goToNew = function() {
    $state.go('app.newlist');
  }

  $scope.goToEdit = function(listId) {
    $state.go('app.editlist', { listid: listId });
  };

  $scope.delete = function(listId) {
    IOURef.child('lists').child(listId).remove();
  };

  $scope.refreshList = function() {
    ListsWithTotal(IOURef.child('lists')).$loaded(function(lists) {

      $scope.lists = lists.withTotals();
      
      if($scope.lists.lists.length > 0) {
        $scope.userdata.noitems = false;
      }

      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.refreshList();

  watcher.$watch(function() { $scope.refreshList(); });
})


.controller('NewListCtrl', function($scope, $state, IOURef) {

  $scope.userdata.showhomeicon = true;
  $scope.list = { name: '', image: 'bag', error: false };

  $scope.submit = function() {
    if($scope.list.name === '') {
      $scope.list.error = true;
    }
    else {
      var newList = {
        name: $scope.list.name,
        image: $scope.list.image,
        members: {}
      };

      newList.members[$scope.userdata.id] = true;

      IOURef.child('lists').push(newList);

      $state.go('app.home');
    }
  }
})


.controller('EditListCtrl', function($scope, $state, $stateParams, $firebaseObject, IOURef) {

  $scope.userdata.showhomeicon = true;

  var listref = IOURef.child('lists').child($stateParams.listid);

  $firebaseObject(listref).$loaded().then(function(list) {
    $scope.list = list;
  });

  $scope.submit = function() {
    if($scope.list.name === '') {
      $scope.list.error = true;
    }
    else {
      $scope.list.$save();
      $state.go('app.home');
    }
  }
})


.controller('ProductsCtrl', function($scope, $ionicModal, $stateParams, IOURef, $firebaseArray, $firebaseObject, BoughtProducts) {

  var watcher = $firebaseArray(IOURef);

  $scope.userdata.listid = $stateParams.listid;
  $scope.userdata.showhomeicon = true;
  $scope.userdata.noitems = true;

  $scope.product = {
    error: false,
    price: null,
    id: null
  }

  $ionicModal.fromTemplateUrl('templates/price.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.openModal = function(tobuyid) {
    $scope.modal.show();
    $scope.product.id = tobuyid;
  };

  $scope.buyitem = function() {

    var price = $scope.product.price;

    if(isNaN(price) || price === null || price === '' || price < 0) {
      $scope.product.error = true;
    }
    else {

      var baseref  = IOURef.child('lists').child($scope.userdata.listid);
      var tobuyref = baseref.child('tobuy').child($scope.product.id);

      $firebaseObject(tobuyref).$loaded().then(function(tobuy) {

        var tobuyname = tobuy.name;

        var newproduct = {
          amended: false,
          date: new Date().getTime(),
          name: tobuyname,
          owner: $scope.userdata.id,
          price: $scope.product.price
        };

        baseref.child('bought').push(newproduct);
        tobuyref.remove();

        $scope.product = {
          error: false,
          price: null,
          id: null
        };

        $scope.closeModal();

      });
    }
  };

  $scope.refreshList = function() {    
    var ref = IOURef.child('lists').child($stateParams.listid);

    BoughtProducts(ref.child('bought').orderByChild('date')).$loaded().then(function(products) {
      $scope.bought = products.reverse();

      if($scope.bought.length > 0) {
        $scope.userdata.noitems = false;
      }

      $firebaseArray(ref.child('tobuy').orderByChild('date')).$loaded().then(function(productstobuy) {
        $scope.tobuy = productstobuy.reverse();

        if($scope.tobuy.length > 0) {
          $scope.userdata.noitems = false;
        }

        $scope.$broadcast('scroll.refreshComplete');

      });
    });
  };

  $scope.refreshList();

  watcher.$watch(function() { $scope.refreshList(); });
})


.controller('NewProductCtrl', function($scope, $state, IOURef) {

  $scope.userdata.showhomeicon = true;
  $scope.product = {
    name: '',
    error: false
  };

  $scope.submit = function() {
    if($scope.product.name === '') {
      $scope.product.error = true;
    }
    else {
      var tobuy = {
        name: $scope.product.name,
        date: new Date().getTime(),
      };

      IOURef.child('lists').child($scope.userdata.listid).child('tobuy').push(tobuy);
      $state.go('app.products', { listid: $scope.userdata.listid });
    }
  };
})


.controller('EditProductCtrl', function($scope, $state, $stateParams, IOURef, Facebook, $firebaseObject) {

  var prodref = IOURef
    .child('lists')
    .child($scope.userdata.listid)
    .child('bought')
    .child($stateParams.productid);

  $scope.formerrors = {
    name: false,
    price: false
  };

  $scope.userdata.showhomeicon = true;
  
  $firebaseObject(prodref).$loaded().then(function(product) {

    $scope.product = product;

    Facebook.getPerson(product.owner, $scope.userdata.token).success(function(user) {
      $scope.username = user.name;
    });
  });

  $scope.submit = function() {

    var price = $scope.product.price;
    var name  = $scope.product.name;

    if(name === '' || name === null || name === undefined) {
      $scope.formerrors.name = true;
    }

    if(isNaN(price) || price === null || price === '' || price < 0) {
      $scope.formerrors.price = true;
    }

    if(!$scope.formerrors.name && !$scope.formerrors.price) {

      var updatedproduct = $firebaseObject(prodref);

      updatedproduct.name    = $scope.product.name;
      updatedproduct.date    = new Date().getTime();
      updatedproduct.owner   = $scope.product.owner;
      updatedproduct.price   = $scope.product.price;
      updatedproduct.amended = true;

      updatedproduct.$save().then(function() {
        $state.go('app.products', { listid: $scope.userdata.listid });
      });
    }
  };

  $scope.fetchMembers = function() {
    $state.go('app.assignmember', { productid: $stateParams.productid });
  };
})


.controller('AssignMemberCtrl', function($scope, $state, $stateParams, IOURef, Facebook, $firebaseArray, $firebaseObject, $q) {

  var baseref = IOURef
    .child('lists')
    .child($scope.userdata.listid);

  var membersref = baseref
    .child('members');

  var productref = baseref
    .child('bought')
    .child($stateParams.productid);

  $firebaseArray(membersref).$loaded().then(function(members) {

    var memberIds = [];

    angular.forEach(members, function(member) {
      if(member.$value) {
        memberIds.push(member.$id);
      }
    });

    $scope.members = [{
      name: $scope.userdata.name,
      id: $scope.userdata.id
    }];

    Facebook.getFriends($scope.userdata.id, $scope.userdata.token).success(function(friends) {
      angular.forEach(friends.data, function(friend) {
        if(memberIds.indexOf(friend.id) >= 0) {
          $scope.members.push(friend);
        }
      });
    });
  });

  $scope.selectMember = function(memberid) {

    $firebaseObject(productref).$loaded().then(function(product) {

      var updatedproduct = $firebaseObject(productref);

      updatedproduct.name    = product.name;
      updatedproduct.date    = new Date().getTime();
      updatedproduct.owner   = memberid;
      updatedproduct.price   = product.price;
      updatedproduct.amended = true;

      updatedproduct.$save().then(function() {
        $scope.goBack();
      });
    });
  };

  $scope.goBack = function() {
    $state.go('app.editproduct', { productid: $stateParams.productid });
  };
})


.controller('MembersCtrl', function($scope) {
  
  $scope.userdata.showhomeicon = true;

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

  $scope.userdata.showhomeicon = true;

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
});
