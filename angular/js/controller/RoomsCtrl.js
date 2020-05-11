
'use strict';   

angular.module('myApp').controller('RoomsCtrl',['$scope','$rootScope',function($scope,$rootScope){
    $scope.deleteRoom=function(index){
        console.log('index',index)
       delete $scope.rooms[index];
    }
    $scope.addRoom=function(index){
        var obj;
        var id=App.getID();
            while ($scope.rooms.hasOwnProperty(id)){
                id=App.getID() 
            }
        $scope.rooms[id]={id:id,name:'',session:null,ip:'',retry:0};
    }
    var pattern=/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
         $scope.rooms=$rootScope.rooms;
         $scope.$on("$destroy", function(){
             console.log('destroy');
             for(var i in $scope.rooms){
                 if($scope.rooms[i].name=='' || isNaN($scope.rooms[i].num)){
                     delete $scope.rooms[i];
                     continue;
                 }
             }
             $rootScope.rooms=$scope.rooms;
             localStorage.setItem('rooms',JSON.stringify($scope.rooms));
         });
        /* $scope.$on("$destroy", function(){
             console.log('destroy');
             for(var i in $scope.rooms){
                 if($scope.rooms[i].name==''||$scope.rooms[i].ip==''){
                     delete $scope.rooms[i];
                     continue;
                 }
                 if(!pattern.test($scope.rooms[i].ip)){
                     console.log('沒過測試',pattern.test($scope.rooms[i].ip))
                     delete $scope.rooms[i];
                 }
             }
             $rootScope.rooms=$scope.rooms;
             localStorage.setItem('rooms',JSON.stringify($scope.rooms));
         });*/
    //{'room-1':{id:'room-1',name:'第一包廂',session:null,ip:'192.168.1.173',retry:0}}
    }]);
