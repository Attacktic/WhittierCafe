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
  this.userData = function(username){
    var data = {username: username}
    return $http.post(`https://whcbackend.herokuapp.com/user/data`, username)
    .success(function(data){
      return data.data;
    })
    .error(function (error, status){
      console.log(error, status);
    });
  }
})

.service('Login', function($http, $localStorage, $state, $ionicPopup, $rootScope){
  showAlert = function(text) {
    var alertPopup = $ionicPopup.alert({
      title: text
    });
  };
  this.verifyUser = function(form){
    var url = `https://whcbackend.herokuapp.com/verify`
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
    var url = `https://whcbackend.herokuapp.com/createme`
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
  this.uploadImg = function(imgurl){
    var data = {imgurl: imgurl}
    return $http.post(`https://whcbackend.herokuapp.com/polls/upload`, data)
    .success(function(serverdata){
      return serverdata
    })
    .error(function (error, status){
      console.log(error, status);
    });
  }
  $rootScope.polls = [];
  this.getActive = function(){
    var url = `https://whcbackend.herokuapp.com/polls/active`
    return $http.get(url)
    .success(function(polls){
      return polls
    })
    .error(function (error, status){
      console.log(error, status);
    });
  }
  this.createPoll = function(form){
  var url = `https://whcbackend.herokuapp.com/createpoll`
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
    var url = `https://whcbackend.herokuapp.com/polls`
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
    var url = `https://whcbackend.herokuapp.com/polls/${id}/delete`
    $http.get(url)
    .success(function(response){
      console.log(response)
    })
    .error(function (error, status){
      console.log(error, status);
    });
  }
  this.changeStatus = function(id){
    var url = `https://whcbackend.herokuapp.com/polls/${id}/toggleActive`
    $http.get(url)
    .success(function(response){
      console.log(response)
    })
    .error(function (error, status){
      console.log(error, status);
    });
  }
})
