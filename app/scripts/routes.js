'use strict';

angular.module('IOU.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.newlist', {
    url: '/home/new',
    views: {
      'menuContent': {
        templateUrl: 'templates/new_list.html',
        controller: 'NewListCtrl'
      }
    }
  })

  .state('app.privacy', {
    url: '/privacy',
    views: {
      'menuContent': {
        templateUrl: 'templates/privacy.html'
      }
    }
  })

  .state('app.terms', {
    url: '/terms',
    views: {
      'menuContent': {
        templateUrl: 'templates/terms.html'
      }
    }
  })

  .state('app.products', {
    url: '/products/:listid',
    views: {
      'menuContent': {
        templateUrl: 'templates/products.html',
        controller: 'ProductsCtrl'
      }
    }
  })

  .state('app.editproduct', {
    url: '/products/edit/:listid',
    views: {
      'menuContent': {
        templateUrl: 'templates/edit_product.html',
        controller: 'EditProductCtrl'
      }
    }
  })

  .state('app.newproduct', {
    url: '/products/new',
    views: {
      'menuContent': {
        templateUrl: 'templates/new_product.html',
        controller: 'NewProductCtrl'
      }
    }
  })

  .state('app.members', {
    url: '/members/:listid',
    views: {
      'menuContent': {
        templateUrl: 'templates/members.html',
        controller: 'MembersCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/home');
});
