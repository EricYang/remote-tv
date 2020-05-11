
'use strict';

angular.module('myApp.table.table-directive', [])

.directive('appTable',function() {

    return {
        restrict:"E",
        templateUrl:"components/table/table.html",
        replace:"true",
        scope:{
            items:"=",
            itemTitles:'=',
            onDelete:'&',
            onDisable:'&',
            editKey:'@',
	    schema:"=",
	    collection:"=",
            
        },
        link:function($scope,$element,$attrs){
            $scope.reverse = true;
            $scope.predicate = 'id';
    $scope.displayVal=function(index,n,id,titles){
	if(id=='status'){
		if(n==0)
		  return '停用';
		else
		  return '正常';
	}
        if(angular.isObject(n)){
		if(titles[index].hasOwnProperty('display')){
                return n[titles[index].display];
		}
		if(titles[index].type=='Array'|| $scope.titles[index].type=='Object'){
		return n
		}
        }else{
            return n;
        }
    };
    $scope.DisplayChYear=function(_date,hasChWord,hasHour){
	var date;
	var hms='';
	if(!_date) return ;
	if( _date instanceof Date && !isNaN(_date.valueOf())){
	date=_date;
	}else{
	date=new Date(_date);
	}
	function addZero(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}
	if(hasHour)hms=" "+addZero(date.getHours())+':'+addZero(date.getMinutes())+':'+addZero(date.getSeconds());
	if(hasChWord) {return (date.getFullYear()-1911)+'年'+addZero(date.getMonth()+1)+'月'+addZero(date.getDate())+'日';
	}else{ return (date.getFullYear()-1911)+'/'+addZero(date.getMonth()+1)+'/'+addZero(date.getDate())+hms;}
    }
    $scope.order = function(title) {
	var predicate=title.id;
	if(title.hasOwnProperty('display')){
	predicate=title.id+'.'+title.display;
	}
	if(title.type=='Array'){
	predicate=title.id;
	}
	if(title.hasOwnProperty('sort')){
	predicate=title.sort;
	}
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
        //console.log('predicate',predicate,$scope.reverse);
    };
	  $scope.deleteItem = function (item) {
                    $scope.onDelete({item:item});
                }
	  $scope.toggleItem = function (item) {
                    $scope.onDisable({item:item});
                }


        }
  };
});
