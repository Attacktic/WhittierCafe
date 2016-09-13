angular.module('starter.services', [])

.service("activeUser", function($localStorage, $rootScope, $state){
  $rootScope.hidden = true;
  this.active = function(){
    if ($localStorage.user || $localStorage.admin){
      return true;
    } else {
      return false;
    }
  };
  this.needAuth = function(){
    return !this.active()
  };
  this.isAdmin = function(){
    return $localStorage.admin ? true:false;
  }
})

.service('Login', function($http, $localStorage, $state, $ionicPopup, $rootScope){
  showAlert = function(text) {
    var alertPopup = $ionicPopup.alert({
      title: text
    });
  };
  this.verifyUser = function(form){
    var url = `http://localhost:3000/verify`
    var data = {
      email: form.email,
      pass: form.password
    }
    $http.post(url, data)
    .success(function(response){
      if (response === "login verified"){
        if (form.email === "dev@admin" || form.email === "admin@admin"){
          $localStorage.admin = form.email;
          $rootScope.hidden = false;
          $state.go('tab.admin');
        } else {
          $localStorage.user = form.email;
          $rootScope.hidden = true;
          $state.go('tab.dash');
        }
      } else {
        showAlert('Invalid Email/Password Combination');
      }
    })
    .error(function (error, status){
      console.log(error, status);
    });
  };
  this.logOut = function(){
    delete $localStorage.user;
    delete $localStorage.admin;
    $rootScope.hidden = true;
  };
})

.service("Signup", function($http, $ionicPopup, $state, $localStorage){
  showAlert = function(text) {
    var alertPopup = $ionicPopup.alert({
      title: text,
    });
  };
  this.createUser = function(form){
    var url = `http://localhost:3000/createme`
    var data = {
      pass: form.password,
      email: form.email,
      name: form.name
    }
    $http.post(url, data)
    .success(function(response){
      if (response[0] === "c"){
        $localStorage.user = form.email;
        $state.go('tab.dash');
      } else {
        showAlert('Email already in use');
      }
    })
    .error(function (error, status){
      console.log(error, status);
    });
  };
})

.factory('Chats', function() {
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory ("StorageService", function ($localStorage) {
  return {
    getAll: function() {
      return $localStorage.things;
    },
    add: function (thing) {
      $localStorage.things.push(thing);
    },
    remove: function (thing) {
      $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
    }
  };
})

.service("Poll", function($localStorage, $rootScope, $state, $http){
  $rootScope.polls = [];
  this.createPoll = function(form){
  var url = `http://localhost:3000/createpoll`
  var data = form;
  return $http.post(url, data)
  .success(function(response){
    console.log("created a poll")
  })
  .error(function (error, status){
    console.log(error, status);
  });
  }
  this.getPolls = function(){
    var url = `http://localhost:3000/polls`
    return $http.get(url)
    .success(function(polls){
      return polls
    })
    .error(function (error, status){
      console.log(error, status);
    });
  }
  this.parsePolls = function(data){
    $rootScope.polls = [];
    for (var i = 0; i < data.data.length; i++) {
      $rootScope.polls.push(data.data[i])
    }
    return $rootScope.polls
  }
  this.getRootPolls = function(){
    return $rootScope.polls;
  }
  this.deletePoll = function(id){
    var url = `http://localhost:3000/polls/${id}/delete`
    $http.get(url)
    .success(function(response){
      console.log(response)
    })
    .error(function (error, status){
      console.log(error, status);
    });
  }
})
