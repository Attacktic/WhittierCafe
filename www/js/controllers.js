angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,activeUser, $state, $localStorage) {
  $scope.$on('$ionicView.enter', function(e) {
    if(activeUser.needAuth()){
      $state.go('tab.settings');
    }
  });
})

.controller('Polls', function($scope, activeUser, $state, Poll) {
  $scope.polls = '';
  $scope.$on('$ionicView.enter', function(e) {
    if(activeUser.needAuth()){
      $state.go('tab.settings');
    }
  });
  $scope.getPolls = function(){
    Poll.getActive().then(function(data){
      $scope.polls = data.data;
    })
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, activeUser, $state) {
  $scope.chat = Chats.get($stateParams.chatId);
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

.controller('AdminCtrl', function($rootScope, $scope, $state, StorageService, activeUser, Poll, $cordovaCamera, $cordovaImagePicker, $ionicPlatform) {
  $rootScope.getPolls = function(){
    return Poll.getPolls().then(function(polls){
      Poll.parsePolls(polls);
    })
  }

  $scope.changeStatus = function(id){
    Poll.changeStatus(id)
    Poll.getPolls().then(function(polls){
      Poll.parsePolls(polls);
    })
  }

  $scope.clear = function(){
    $scope.addPoll.title = '';
    $scope.addPoll.active = false;
    $scope.addPoll.answers = [{text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}, {text:''}]
    $scope.addPoll.show = [true, true, true, true, true, true, true]
  }
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
    }).then(function(){
      console.log("created");
      Poll.getPolls().then(function(polls){
        Poll.parsePolls(polls);
      })
    })
  }
  $scope.deletePoll = function(id){
    Poll.deletePoll(id);
    Poll.getPolls().then(function(polls){
      Poll.parsePolls(polls);
    })
  }

$scope.images = [];

/*var fbAuth = fb.getAuth();
if(fbAuth) {
   var userReference = fb.child("users/" + fbAuth.uid);
   var syncArray = $firebaseArray(userReference.child("images"));
   $scope.images = syncArray;
} else {
  var userReference = fb.child("users/" + fbAuth.uid);
  var syncArray = $firebaseArray(userReference.child("images"));
  $scope.images = syncArray;
}*/

$scope.upload = function() {
   var options = {
       quality : 75,
       destinationType : Camera.DestinationType.DATA_URL,
       sourceType : Camera.PictureSourceType.CAMERA,
       allowEdit : true,
       encodingType: Camera.EncodingType.JPEG,
       popoverOptions: CameraPopoverOptions,
       targetWidth: 500,
       targetHeight: 500,
       saveToPhotoAlbum: false
   };
 }
});
