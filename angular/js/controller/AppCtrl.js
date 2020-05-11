'use strict';   

angular.module('myApp').controller('AppCtrl',['$scope','$rootScope',function($scope,$rootScope){
        $scope.version='1.0'//App.version();
        $scope.title='點餐資訊'//App.title;
        var init=true;
        if(init){
                $rootScope.rooms=localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):{}
                init=false;
            }
    }]);
