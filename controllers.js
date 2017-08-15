var aMailServices = angular.module('aMail', ["ngRoute"]);
aMailServices.filter("searchFor", function() {
  return function(messages, searchString) {
    if (!searchString) {
      return messages;
    }

    var result = [];
    angular.forEach(messages, function(message) {
      if (message.sender.toLowerCase() == searchString.toLowerCase() || 
          message.subject.toLowerCase() == searchString.toLowerCase()) {
        result.push(message);
      }
    });

    return result;
  };
});

aMailServices.service("messageService", function() {
  var seed = 0;
  var messages = [
    {id: seed++, 
     sender: 'jean@somecompany.com', 
     subject: 'Hi there, old friend',
     date: 'Dec 7, 2013 12:32:00', 
     recipients: ['greg@somecompany.com'],
     message: 'Hey, we should get together for lunch sometime and catch up.'
      +'There are many things we should collaborate on this year.'},
    {id: seed++,  
     sender: 'maria@somecompany.com',
     subject: 'Where did you leave my laptop?',
     date: 'Dec 7, 2013 8:15:12', 
     recipients: ['greg@somecompany.com'],
     message: 'I thought you were going to put it in my desk drawer.'
      +'But it does not seem to be there.'}, 
    {id: seed++, 
     sender: 'bill@somecompany.com', 
     subject: 'Lost python',
     date: 'Dec 6, 2013 20:35:02', 
     recipients: ['greg@somecompany.com;ddd@somecompany.com'],
     message: 'Nobody panic, but my pet python is missing from her cage.'
      +'She doesn\'t move too fast, so just call me if you see her.'} 
  ]

  this.send = function(message) {
    message.id = seed++;
    var temp = message.recipients.split(";");
    message.recipients = [];
    var i;
    for (i in temp) {
      message.recipients.push(temp[i]);
    }

    messages.push(message);
  }

  this.view = function(id) {
    var i;
    for (i in messages) {
      if (messages[i].id == id) {
        return messages[i];
      }
    }
  }

  this.list = function() {
    return messages;
  }
});
// Set up our mappings between URLs, templates, and controllers
function emailRouteConfig($routeProvider) {
  $routeProvider.
    when('/', {
      controller: "listController",
      templateUrl: 'list.html'
    }).
// Notice that for the detail view, we specify a parameterized URL component
// by placing a colon in front of the id
    when('/detail/:id', {
      controller: "detailController",
      templateUrl: 'detail.html'
    }).
    when('/newMessage/', {
      controller: "composeController",
      templateUrl: 'newMessage.html'
    }).
    otherwise({
      redirectTo: '/list.html'
    });
}

// Set up our route so the AMail service can find it
aMailServices.config(emailRouteConfig);
aMailServices.controller("composeController", function($scope, messageService) {
  $scope.send = function() {
    messageService.send($scope.message);
  }
});

aMailServices.controller("detailController", function($scope, messageService, $routeParams) {
  $scope.message = messageService.view($routeParams.id);
  
});

aMailServices.controller("listController", function($scope, messageService) {
  $scope.messages = messageService.list();
  $scope.curPage = 0;
  $scope.pageSize = 5;
  $scope.numberOfPages = function() {
    return Math.ceil($scope.messages.length / $scope.pageSize);
  }
});

angular.module("aMail").filter("pagination", function() {
  return function(input, start) {
    start = +start;
    return input.slice(start);
  }
});
