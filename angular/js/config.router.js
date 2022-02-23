'use strict';                                                                                                                                                 

angular.module('myApp')
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/tv3");
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
    .state('tv3', {
        url: "/tv3",
        views: {
            content: {
                templateUrl: 'angular/tpl/tv3.html',
                controller: 'Tv3Ctrl'
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
