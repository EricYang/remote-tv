
'use strict';   

angular.module('myApp').controller('CommonwordsCtrl',['$scope','$rootScope',function($scope,$rootScope){
    $scope.commonwords=$rootScope.commonwords;
    $scope.newWord='';
    $scope.newName='';
    $scope.pageIndex=0;
    $scope.removeWord=function(key){
        if($scope.pageIndex==0)return;
        var index=$scope.commonwords[$scope.pageIndex].words.indexOf(key);
        console.log(key,index);
        $scope.commonwords[$scope.pageIndex].words.splice(index,1);
    }
    $scope.removePage=function(index){
            delete $scope.commonwords[index];
        }   
    $scope.switchPage=function(index){
        $scope.pageIndex=index;
    }
    $scope.addNewWord=function(index){
        if($scope.newWord!=''){
            
        console.log($scope.commonwords[index].words,$scope.newWord);
            $scope.commonwords[index].words.push($scope.newWord);
        $scope.commonwords[index].words=_.uniq($scope.commonwords[index].words);
        console.log($scope.commonwords[index].words);
            $scope.newWord='';
        console.log($scope.commonwords)
        }else{
            //fail 
            console.log('未輸入字句');
        }
    }
    $scope.addNewPage=function(){
        if($scope.newName!=''){
        var obj;
        var id=App.getID();
        while ($scope.rooms.hasOwnProperty(id)){
            id=App.getID()
        }
        $scope.commonwords[id]={id:id,name:$scope.newName,words:[]};
        $scope.newName='';
        $scope.pageIndex=id;
        }else{
            //fail 
            console.log('未輸入名字');
        }
    }
         $scope.$on("$destroy", function(){
             console.log('destroy');
             $rootScope.commonwords=$scope.commonwords;
             localStorage.setItem('commonwords',JSON.stringify($scope.commonwords));
         });
    }]);
