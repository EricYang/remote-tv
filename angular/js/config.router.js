'use strict';                                                                                                                                                 

angular.module('myApp')
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/tv");
    var header = {
        templateUrl: 'angular/tpl/header.html',
        controller: function($scope) {}
    }
    var footer = {
        templateUrl: 'angular/tpl/footer.html',
        controller: function($scope) {}

    }
    $stateProvider
    .state('tv', {
        url: "/tv",
        views: {
            content: {
                templateUrl: 'angular/tpl/tv.html',
                controller: 'TvCtrl'
            },
        }
    })
    .state('setting-networks', {
        url: "/setting/networks",
        views: {
            header: header,
            content: {
                templateUrl: 'angular/tpl/networks.html',
                controller: 'NetworksCtrl'
            },
            footer: footer
        }
    })
}]);
