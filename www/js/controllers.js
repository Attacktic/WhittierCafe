angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,activeUser, $state, $localStorage) {
  $scope.$on('$ionicView.enter', function(e) {
    if(activeUser.needAuth()){
      $state.go('tab.settings');
    }
  });
})

.controller('ChatsCtrl', function($scope, Chats, activeUser, $state) {
$scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
  $scope.$on('$ionicView.enter', function(e) {
    if(activeUser.needAuth()){
      $state.go('tab.settings');
    }
  });
})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, activeUser, $state) {
  $scope.chat = Chats.get($stateParams.chatId);
  $scope.$on('$ionicView.enter', function(e) {
    if(activeUser.needAuth()){
      $state.go('tab.settings');
    }
  });
})

.controller('AccountCtrl', function($scope, Login, $state, StorageService, activeUser, $rootScope) {
  $scope.form = {};
  $scope.form.email = '';
  $scope.form.password = '';
  $scope.activeUser = function(){
    return activeUser.active();
  };
  $scope.verify = function(){
    Login.verifyUser($scope.form);
  };
  $scope.createredirect = function(){
    $state.go('create');
  };
  $scope.logout = function(){
    Login.logOut();
  };
})

.controller('CreateCtrl', function($scope, Signup, $state, StorageService, activeUser) {
  $scope.form = {};
  $scope.form.username = '';
  $scope.form.password = '';
  $scope.form.email = '';
  $scope.form.name = '';
  $scope.create = function(){
    Signup.createUser($scope.form);
  };
  $scope.loginredirect = function(){
    $state.go('tab.settings');
  };
})

.controller('AdminCtrl', function($rootScope, $scope, $state, StorageService, activeUser, Poll) {
  $scope.addPoll = {}
  $scope.addPoll.title = '';
  $scope.addPoll.active = false;
  $scope.addPoll.answers = [{text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}]
  $scope.addPoll.show = [true, true, true, true, true, true, true]
  $scope.$on('$ionicView.enter', function(e) {
    if(!activeUser.isAdmin()){
      $state.go('tab.settings');
    }
  });
  $rootScope.auth = function(){
    return activeUser.isAdmin()
  }
  $scope.unhide = function(){
    $scope.addPoll.show[$scope.addPoll.show.indexOf(true)] = !$scope.addPoll.show[$scope.addPoll.show.indexOf(true)]
  }
  $scope.createPoll = function(){
    var valid_answers = [];
    $scope.addPoll.answers.forEach(function(answer){
      if (answer.text !== ''){
        valid_answers.push(answer);
      }
    })
    Poll.createPoll({
      title: $scope.addPoll.title,
      answers: valid_answers,
      active: $scope.addPoll.active
    })
  }
})
