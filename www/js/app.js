var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters', 'ngStorage', 'ngCordova', 'firebase'])
var fb = new Firebase("https://whittiercafeimages.firebaseio.com/");
app.run(function($ionicPlatform) {
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
app.config(function($stateProvider, $urlRouterProvider) {
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

  .state('tab.polls', {
      url: '/polls',
      views: {
        'tab-polls': {
          templateUrl: 'templates/tab-polls.html',
          controller: 'Polls'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
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
