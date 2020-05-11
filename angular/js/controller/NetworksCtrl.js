
'use strict';   

angular.module('myApp').controller('NetworksCtrl',['$scope','$rootScope',function($scope,$rootScope){
    $scope.deleteNetwork=function(index){
        console.log('index',index)
       delete $scope.networks[index];
    }
    $scope.addNetwork=function(index){
        var obj;
        var id=App.getID();
            while ($scope.networks.hasOwnProperty(id)){
                id=App.getID() 
            }
        $scope.networks[id]={id:id,val:''};
    }
    var pattern=/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
         $scope.networks=$rootScope.networks;
         $scope.$on("$destroy", function(){
             console.log('destroy');
             for(var i in $scope.networks){
                 if($scope.networks[i].val==''){
                     delete $scope.networks[i];
                     continue;
                 }
             }
             $rootScope.networks=$scope.networks;
             localStorage.setItem('networks',JSON.stringify($scope.networks));
         });
    }]);
