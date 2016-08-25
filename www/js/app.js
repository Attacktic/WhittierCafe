
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
  })

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.vote', {
      url: '/vote',
      views: {
        'tab-vote': {
          templateUrl: 'templates/tab-vote.html',
          controller: 'VoteCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/vote/:chatId',
      views: {
        'tab-vote': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'VoteDetailCtrl'
        }
      }
    })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('create', {
    url: '/create',
    templateUrl: 'templates/tab-create.html',
    controller: 'CreateCtrl'
  })
  .state('tab.admin', {
    url: '/admin',
    views: {
      'tab-admin': {
        templateUrl: 'templates/tab-admin.html',
        controller: 'AdminCtrl'
      }
    }
  })

  $urlRouterProvider.otherwise('/tab/settings');

})
