
angular.module('myApp.modal',[])
.factory('modal',['$uibModal',function($modal){
    var loginModalInstance
    var loginModal=function(size,cb){
        loginModalInstance= $modal.open({
            templateUrl: 'components/modal/loginModal.html',
            controller:['$scope','$modalInstance',function($scope, $modalInstance) {
                $scope.title = '大V管理系統';
                $scope.alerts=[];
                $scope.ok = function () {
                    cb($scope.user,this);
                };
            }],
            backdrop:'static',
            backdropClick:true,
            windowClass:'loginModalWin',
            size: size,
            resolve: {
                title: function () {
                    return '大V管理系統';
                }
            }
        });
    loginModalInstance.result.then(function () {
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });

    }
    var newGroupModal = function (size,cb) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'components/modal/addNewGroupModal.html',
            controller: function($scope, $modalInstance, title) {
                $scope.title = title;
                $scope.group={name:'',vip:0};
                $scope.alerts=[];
                $scope.ok = function () {
                    if($scope.form.$valid){
                        $modalInstance.close($scope.group);
                    }else{
                        if($scope.alerts.length<1){
                            $scope.alerts.push({type: 'danger',msg: 'please check out your input data.'});
                        }
                    }
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: size,
            resolve: {
                title: function () {
                    return '新增客戶群組';
                }
            }
        });

        modalInstance.result.then(function (newGroup) {
            cb(newGroup);
            console.log('created:',newGroup);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    var newQuestionModal = function (size,type,msg,cb) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'components/modal/addNewQuestionModal.html',
            controller: ['$scope','$modalInstance','title',function($scope, $modalInstance, title) {
		$scope.filename='';
		$scope.filetype='.'+type;
		$scope.message=msg;
		$scope.title=title;
                $scope.ok = function () {
                    $modalInstance.close($scope.filename+$scope.filetype);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }],
            size: size,
            resolve: {
                title: function () {
                    return '系統訊息';
                }
            }
        });
        modalInstance.result.then(function (result) {
            cb(result);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    var newAlertModal = function (size,type,file_name,cb) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'angular/js/components/modal/addNewAlertModal.html',
            controller: ['$scope','$modalInstance','title',function($scope, $modalInstance, title) {
		$scope.type=type;
		$scope.comment='';
		if(type=="DELETE"){
                $scope.message="請問確定要將"+file_name+"刪除嗎？"
		}else if(type=="STOP_CUSTOMER_STATUS"){
		$scope.message=file_name;
		}else{
		$scope.message=file_name;
		}
		$scope.title=title;
                $scope.ok = function () {
		var result=$scope.comment||true;
                    $modalInstance.close(result);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }],
            size: size,
            resolve: {
                title: function () {
                    return '系統訊息';
                }
            }
        });
        modalInstance.result.then(function (result) {
            cb(result);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    var newCustomerModal = function (size,customers,cb) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'components/modal/addNewCustomerModal.html',
            controller:['$scope','$modalInstance','title',function($scope, $modalInstance, title) {
                $scope.title = title;
                $scope.customers=customers;
                $scope.ok = function () {
                    if($scope.form.$valid){
                        $modalInstance.close($scope.selected);
                    }else{
                        if($scope.alerts.length<1){
                            $scope.alerts.push({type: 'danger',msg: 'please check out your input data.'});
                        }
                    }
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }],
            size: size,
            resolve: {
                title: function () {
                    return '新增合約客戶';
                }
            }
        });
        modalInstance.result.then(function (selected) {
            cb(selected);
            console.log('renew list:',selected);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    var selectedModal = function (size,data,cb) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'components/modal/selectedModal.html',
            controller:['$scope','$modalInstance','title', function($scope, $modalInstance, title) {
                $scope.title = title;
                $scope.items=data;
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.ok = function (selected) {
                     $modalInstance.close(selected);
                };
            }],
            size: size,
            resolve: {
                title: function () {
                    return '選擇遠端來源檔案:';
                }
            }
        });
        modalInstance.result.then(function (selected) {
            cb(selected);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    var watchGroupAuthModal = function (size,data,service,cb) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'components/modal/watchGroupAuthModal.html',
            controller:['$scope','$modalInstance','title',function($scope, $modalInstance, title) {
                $scope.groupAuth=data;
                $scope.cancel = function (act) {
                    $modalInstance.dismiss('cancel');
                };
                $scope.update = function () {
                    service.updateGroupsAuth($scope.groupAuth._id,$scope.groupAuth,function(msg,error){
			cb('update',msg);
                        $modalInstance.dismiss('cancel');
			});
                };
                $scope.delete = function () {
                    service.deleteGroupsAuth($scope.groupAuth._id,function(msg){
			cb('delete',msg);
                        $modalInstance.dismiss('cancel');
			});
                };
                $scope.options=[{lab:'無',val:0},
				{lab:'唯讀',val:1},
				{lab:'可編輯',val:2},
				{lab:'最大權限',val:3}];
                $scope.options2=[{lab:'無',val:0},
                                {lab:'有',val:1}];
                $scope.items=[{chname:"客戶",name:"customers",level:0,type:1},
                                {chname:"期數",name:"terms",level:0,type:1},
                                {chname:"合約",name:"contracts",level:0,type:1},
                                {chname:"管理員",name:"accounts",level:0,type:1},
                                {chname:"列印",name:"print",level:0,type:2},
                                {chname:"進階搜尋",name:"query",level:0,type:2},
                                {chname:"紀錄",name:"logger",level:0,type:2}];
	    $scope.change=function(event){
		console.log('change',$scope.groupAuth);
		} 
            }],
            size: size,
            resolve: {
                title: function () {
                    return '觀看權限:';
                }
            }
        });
        modalInstance.result.then(function (selected) {
            cb(selected);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    var newPermissionGroupModal = function (size,cb) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'components/modal/addNewPermissionGroupModal.html',
            controller: ['$scope','$modalInstance','title',function($scope, $modalInstance, title) {
                $scope.title = title;
                $scope.options=[{lab:'無',val:0},
                                {lab:'唯讀',val:1},
                                {lab:'可編輯',val:2},
                                {lab:'最高權限',val:3}];
                $scope.options2=[{lab:'無',val:0},
                                {lab:'有',val:1}];
                $scope.items=[{chname:"客戶",name:"customers",level:0,type:1},
                                {chname:"期數",name:"terms",level:0,type:1},
                                {chname:"合約",name:"contracts",level:0,type:1},
                                {chname:"管理員",name:"accounts",level:0,type:1},
                                {chname:"列印",name:"print",level:0,type:2},
                                {chname:"進階搜尋",name:"query",level:0,type:2},
                                {chname:"紀錄",name:"logger",level:0,type:2}];
                $scope.permits={};
                for(var i=0;i<$scope.items.length;i++){
                    $scope.permits[$scope.items[i]['name']]='0';
                }
                $scope.name="xx部門";
                $scope.result={}
                $scope.ok = function () {
                    var permit=[];
                    for(var j in $scope.permits){
                    var obj={name:j,level:$scope.permits[j]};
                    permit.push(obj);
                    }
                    $scope.result={
                        name:$scope.name,
                        permit:permit
                    };
                    $modalInstance.close($scope.result);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }],
            size: size,
            resolve: {
                title: function () {
                    return '新增權限群組';
                }
            }
        });

        modalInstance.result.then(function (pg) {
            cb(pg);
            console.log('renew pg:',pg);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };


    return {
        loginModal : loginModal,
        newGroupModal : newGroupModal,
        newCustomerModal : newCustomerModal,
        newPermissionGroup:newPermissionGroupModal,
        watchGroupAuth:watchGroupAuthModal,
	newAlertModal:newAlertModal,
	newQuestionModal:newQuestionModal,
	selectedModal:selectedModal,
        closeLoginModal:function(){
            loginModalInstance.close();
        }
    }

}])
