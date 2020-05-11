
'use strict';

angular.module('myApp.export.export-directive', [])

.directive('appExport',['modal',function(modal) {

    return {
        restrict:"E",
        templateUrl:"components/export/export.html",
        replace:"true",
        scope:{
            contentId:"@"
        },
        link:function($scope,$element,$attrs){
	    $scope.exportData = function () {
	      var html=document.getElementById($scope.contentId).innerHTML;
		var blob = new Blob([html], {
		    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
		});
		modal.newQuestionModal('sm',"xls","請輸入匯出檔名",function(filename){
        		saveAs(blob, filename);
		});
	    };
        }
  };
}]);
