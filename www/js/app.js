// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller('todolistCtrl', function($scope, $ionicPopup, $ionicListDelegate, todolistFactory) {
  $scope.tasks = [];
  // firebase.database().ref('tasks').once('value').then(function(data) {
  //   var list = data.val();

  //   for(var item in list) {
  //     if (list.hasOwnProperty(item)) {
  //       $scope.tasks.push({
  //         "id": item,
  //         "title": list[item]['title'],
  //         "complete": list[item]['complete']
  //       });
  //     }
  //   }
  // });
  // $scope.tasks = [
  //     {"title": "Task01", "complete": false},
  //     {"title": "Task02", "complete": true},
  //     {"title": "Task03", "complete": false},
  //     {"title": "Task04", "complete": false},
  //     {"title": "Task05", "complete": false}
  //   ];

  todolistFactory.init(function(data) {
    $scope.tasks = data;
  });

  $scope.editTask = function(task) {
    $scope.data = {response: task.title};
    $ionicPopup.prompt({
      title: "修改任務",
      okText: '提交',
      scope: $scope
    }).then(function(res) {
       if(res !== undefined) {
        task.title = $scope.data.response;
        $ionicListDelegate.closeOptionButtons();

        var updates = {};

        updates['/' + task.id + '/title'] = task.title;
        updates['/' + task.id + '/complete'] = task.complete;

        firebase.database().ref('tasks').update(updates);
       }
    });
  };

  $scope.deleteTask = function(task) {
    var index = $scope.tasks.indexOf(task);
    $scope.tasks.splice(index, 1);
    firebase.database().ref().child('tasks/' + task.id).remove();
  }

  $scope.newTask = function() {
    $ionicPopup.prompt({
      title: "新任務",
      template: "輸入新的任務:",
      inputPlaceholder: "請輸入任務名稱",
      okText: '創建任務'
    }).then(function(res) {
       if(res) {

        var newPostKey = firebase.database().ref().child('tasks').push().key;

        var updates = {};

        updates['/' + newPostKey + '/title'] = res;
        updates['/' + newPostKey + '/complete'] = false;

        firebase.database().ref('tasks').update(updates);

        $scope.tasks.push({
          id: newPostKey,
          title: res,
          complete: false
        });
       }
    });
  };
})

.factory('todolistFactory' , function() {
  var tasks = [];
  var results = {};

  function _init(callback) {
    firebase.database().ref('tasks').once('value').then(function(data) {
      var list = data.val();

      for(var item in list) {
        if (list.hasOwnProperty(item)) {
          tasks.push({
            "id": item,
            "title": list[item]['title'],
            "complete": list[item]['complete']
          });
        }
      }

      callback(tasks);
    });
  }

  results.init = _init;

  return results;
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
