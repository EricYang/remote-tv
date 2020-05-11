
'use strict';                                                                                                                                                 

angular.module('myApp')
.factory('webService',['$rootScope',"$http",function($rootScope,$http){
    return {
        login:function(path,cb){
             $http({
                url:path,
                method:'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-Mifos-Platform-TenantId': 'default' } 
                }).success(function(data,header,config,status){
                    cb('success',data);
                }).error(function(data,header,config,status){
                    cb('error');
                });
        },
        post:function(path,params,cb){
             $http({
                url:path,
                method:'POST',
		        params:params,
                headers: {'Content-Type': 'application/json'} 
                }).success(function(data,header,config,status){
                    //console.log('success get item',data,header,config,status);
                    cb('success',data);
                }).error(function(data,header,config,status){
                    console.log('error get item',data,header,config,status);
                    cb('error');
                });
        },
        get:function(path,item,cb){
             $http({
                url:path,
                method:'GET',
                params:item,
                }).success(function(data,header,config,status){
                cb(data)
                }).error(function(data,header,config,status){
                    console.log('error create',data,header,config,status);
                    cb('error');
                });
        }


    }
}])

