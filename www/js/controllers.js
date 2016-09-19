angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,activeUser, $state, $localStorage) {
  $scope.$on('$ionicView.enter', function(e) {
    if(activeUser.needAuth()){
      $state.go('tab.settings');
    }
  });
})

.controller('Polls', function($scope, activeUser, $state, Poll) {
  $scope.user_id = ''
  $scope.getUser = function(){
    activeUser.userData().then(function(data){
      $scope.user_id = data.data.rows[0].id;
    })
  }
  $scope.hasVoted = function(){
    return Poll.getActive().then(function(polls){
      polls.data.forEach(function(poll){
          poll.answers.forEach(function(answer){
            answer.votes.forEach(function(vote){
              console.log(vote.user_id, $scope.user_id);
              if(vote.user_id == $scope.user_id){
                poll.voted = true;
              } else {
                console.log("false");
              }
            })
          })
      });
      return polls.data;
    });
  }
  $scope.polls = '';
  $scope.getPolls = function(){
    $scope.hasVoted().then(function(polls){
      $scope.polls = polls;
    })
  }

  $scope.$on('$ionicView.enter', function(e) {
    if(activeUser.needAuth()){
      $state.go('tab.settings');
    }
    $scope.getUser();
    $scope.getPolls();
  });
  $scope.vote = function(id){
    Poll.addVote(id).then(function(){
      $scope.getPolls()
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
  $scope.user = ''
  $scope.getUser = function(){
    activeUser.userData().then(function(data){
      $scope.user = data.data.rows[0];
    })
  }
  $scope.$on('$ionicView.enter', function(e) {
    $scope.getUser();
  });
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

.controller('AdminCtrl', function($rootScope, $scope, $state, StorageService, activeUser, Poll, $cordovaImagePicker, $ionicPlatform, $firebaseArray, $cordovaCamera) {
  var fb = new Firebase("https://whittiercafeimages.firebaseio.com/");
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
    $scope.addPoll.answers = [{text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}]
    $scope.addPoll.show = [true, true, true, true, true, true, true]
  }
  $scope.addPoll = {}
  $scope.addPoll.title = '';
  $scope.addPoll.active = false;
  $scope.addPoll.answers = [{text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}, {text:'', img:''}]
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
  $scope.upload = function(index) {
    var userReference = fb.child("data/");
    var syncArray = $firebaseArray(userReference.child("images"));
          var options = {
              quality : 75,
              destinationType : Camera.DestinationType.DATA_URL,
              sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
              allowEdit : true,
              encodingType: Camera.EncodingType.JPEG,
              popoverOptions: CameraPopoverOptions,
              targetWidth: 500,
              targetHeight: 200,
              saveToPhotoAlbum: false
          };
          $cordovaCamera.getPicture(options).then(function(imageData) {
              syncArray.$add({image: imageData}).then(function(key) {
                  $scope.addPoll.answers[index].img = "'"+key + "'";
              });
          }, function(error) {
              console.error(error);
          });
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
    Poll.deletePoll(id).then(function(){
      Poll.getPolls().then(function(polls){
        Poll.parsePolls(polls);
      })
    })
  }
  $scope.resetVotes = function(pollid){
    Poll.resetVotes(pollid).then(function(){
      Poll.getPolls().then(function(polls){
        Poll.parsePolls(polls);
      })
    })
  }
//https://whittiercafeimages.firebaseio.com/data/images/-KS28pm3kpzxwkElm5l-
});
