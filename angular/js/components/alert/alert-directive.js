
'use strict';

angular.module('myApp.alert.alert-directive', [])

.directive('appAlert',function() {

    return {
        restrict:"E",
        templateUrl:"angular/js/components/alert/alert.html",
        replace:"true",
        scope:{
            alerts:"="
        },
        link:function($scope,$element,$attrs){
        }
  };
});
