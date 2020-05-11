
'use strict';

angular.module('myApp.printer.printer-directive', [])

.directive('appPrinter',function() {

    return {
        restrict:"E",
        templateUrl:"components/printer/printer.html",
        replace:"true",
        scope:{
            popupWinWidth:"@",
            popupWinHight:"@",
            popupWinTitle:"@",
            divIdArray:"="
        },
        link:function($scope,$element,$attrs){
            $scope.closeAlert=function(index){
                $scope.alerts.splice(index,1);
            };
            $scope.printDiv = function() {

                var headHtml='<head><script src="../bower_components/angular/angular.js"></script><link href="lib/css/bootstrap.min.css" rel="stylesheet"><link rel="stylesheet" type="text/css" href="app.css" /></head>';
                var bodyHtml='';
                var divAry=[];
                var popupWin = window.open('', $scope.popupWinTitle, "width="+$scope.popupWinWidth+",height="+$scope.popupWinHight);
                for(var i in $scope.divIdArray){
                    divAry[i]=document.getElementById($scope.divIdArray[i]).innerHTML;
                }

                popupWin.document.open();

                popupWin.document.write("<html>"+headHtml+"<body onload='window.print()'>" + divAry.join('<br/>')+ "</body></html>");
                popupWin.document.close();
            } 
        }
  };
});
