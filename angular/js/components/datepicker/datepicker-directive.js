
'use strict';

angular.module('myApp.datepicker.datepicker-directive', [])

.directive('appDatepicker',function() {

    return {
        restrict:"E",
        templateUrl:"components/datepicker/datepicker.html",
        replace:"true",
        scope:{
            dpTitle:"@",
            dpDate:"=",
	    dpYear:"@",
	    dpMonth:"@",
	    dpDay:"@"
        },
        pre: function($scope,$element,$attrs) {
            // pre-link code here...
        },
        link:function($scope,$element,$attrs){
	if($scope.dpYear)$scope.ch_year0=Number($scope.dpYear);
	if($scope.dpMonth)$scope.ch_month=Number($scope.dpMonth);
	if($scope.dpDay)$scope.ch_day=Number($scope.dpDay);
	var chinese_year_rate=1911;
	var update=function(){
	  $scope.ch_year=$scope.ch_year0+chinese_year_rate;
	  var date=$scope.ch_year+'/'+$scope.ch_month+'/'+$scope.ch_day;
	  $scope.dpDate=new Date(date);
	if(!$scope.dpDate.isValid()){
		$scope.dpDate=null;
	} 
	}
	var init=function(){
	if($scope.dpDate){
        $scope.ch_year0=$scope.dpDate.getFullYear()-chinese_year_rate;
	$scope.ch_month=$scope.dpDate.getMonth()+1;
	$scope.ch_day=$scope.dpDate.getDate();
        }else{
	update();
	}
	}
	$scope.$watch('dpDate',function(){
		init();
	});
	$scope.$watch('ch_year0',function(){
		update();
	});
	$scope.$watch('ch_month',function(){
		update();
	});
	$scope.$watch('ch_day',function(){
		update();
	});
        }
  };
});
