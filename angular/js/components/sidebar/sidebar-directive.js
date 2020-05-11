
'use strict';

angular.module('myApp.sidebar.sidebar-directive', [])

.directive('appSidebar',function() {
    return {
        restrict:"E",
        templateUrl:"components/sidebar/sidebar.html",
        replace:"true",
        scope:{
            sData:"=",
            sEnvironment:"="
        },
        link:function($scope,$element,$attrs){
            $scope.getBoolean = function (value) { if (value === 'true') return true; else return false; };
            $attrs.$observe("ngShow",function( value ) {
                $element.css('visibility', $scope.getBoolean(value) ? 'visible' : 'hidden'); 
                }
            );
        }
  };
});
