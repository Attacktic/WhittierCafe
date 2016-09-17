angular.module('starter.filters', [])

.filter('capitalize', function(){
  return function (str){
    return str ? str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}) : str;
  }
})
