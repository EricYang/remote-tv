'use strict';   

angular.module('myApp')
    .controller('BroadcastCtrl',['$scope','$rootScope','modal','cfpLoadingBar',function($scope,$rootScope,modal,cfpLoadingBar){

        $scope.alerts=[];
        $scope.expries=10;
        $scope.messageTypes=[{val:1,name:'一般訊息'},{val:2,name:'緊急訊息'}];
        $scope.scanTypes=[{val:'ia32',name:'模式一'},{val:'x64',name:'模式二'}];
        $scope.speeds=[{val:0,name:'固定位置'},{val:1,name:'慢速跑馬燈'},{val:2,name:'中速跑馬燈'},{val:3,name:'快速跑馬燈'}];
        $scope.jsonObj={"MessageType":"1","Expires":10,Speed:'0',"Message":""}
        $scope.session=null;
        $scope.msg={failure:'傳送失敗',success:'傳送成功'};
        $scope.retry=0;
        $scope.selectedRoom='all';
        $scope.rooms=$rootScope.rooms;
        $scope.mywords=$rootScope.mywords;
        $scope.commonwords=$rootScope.commonwords;
        $scope.scanType=$rootScope.scanType;
        $scope.networks=$rootScope.networks;
        $scope.timeout;
        console.log(' $scope.scanType', $scope.scanType);
        $scope.$on('$viewContentLoaded', function readyToTrick() {
	    });

	//$scope.autoRooms=generatorAutoRoom();
        $scope.updateRoomName=function(){
            for(var i in $scope.rooms){
            for(var j in $scope.autoRooms){
                if($scope.rooms[i].num==$scope.autoRooms[j].num){
                    $scope.autoRooms[j].name=$scope.rooms[i].name;
                    }
                }
            }
            $scope.$apply();

        }
        $scope.reflash=function(){
            for(var i in $scope.mywords){
                if($scope.commonwords.hasOwnProperty(i)){
                    $scope.mywords[i]=$scope.commonwords[i];
                }else{
                    delete $scope.mywords[i];
                }
            }
        }   
        $scope.removeMyWord=function(index){
            delete $scope.mywords[index];
             $rootScope.mywords=$scope.mywords;
             localStorage.setItem('mywords',JSON.stringify($scope.mywords));
        }   
        $scope.addMyWord=function(){
            var commonword=JSON.parse($scope.selectedCommonword);
            $scope.mywords[commonword.id]=commonword;
             $rootScope.mywords=$scope.mywords;
             localStorage.setItem('mywords',JSON.stringify($scope.mywords));
        }

        $scope.closeAlert=function(index){
            $scope.alerts.splice(index,1);
        };
        var pushMsg=function(type,msg){
                          $scope.alerts.push({type:type ,msg:msg});
                          $scope.$apply();
        }
        var settingTimeout=function(name){
        return setTimeout(function(){
                             pushMsg('danger','傳送'+name+'失敗，連線逾時')
                            }, 5000);
        };
        var sendMessage=function(index,rooms){
            if(rooms[index].retry>=3){
                pushMsg('danger','傳送'+rooms[index].name+'失敗，連線逾時')
                return;
            }
            var timeout = settingTimeout(rooms[index].name);
            console.log('room.session',index,rooms[index].session);
            var params=_.clone($scope.jsonObj);
                params.MessageType=Number(params.MessageType);
                params.Expires=Number(params.Expires);
                params.Speed=Number(params.Speed);

            App.service.message(rooms[index].ip,rooms[index].session,params,function(error,data){ 
                clearTimeout(timeout);
                if(data){
                    console.log(rooms[index].ip,'data',error,data)
                    if(data.hasOwnProperty('OK')){
                        console.log('傳送成功');
                        rooms[index].retry=0;
                        rooms[index].num=data.OK.ring_room_num;
                        rooms[index].machine_id=data.OK.machine_id;
                        $scope.updateRoomName();
                    }else{
                        rooms[index].retry++;
                        loginAndSendMessage(index,rooms);
                    }
                    }else{
                        //delete  rooms[index];
                        //pushMsg('danger','傳送'+rooms[index].name+'失敗，連線逾時')
                        return;
                    }
                })
            }

        var loginAndSendMessage=function(index,rooms){
            var timeout = settingTimeout(rooms[index].name);
            App.service.login(rooms[index].ip,App.adminUser,App.adminPasswd,function(error,session){
                clearTimeout(timeout);
                if(session){
                    rooms[index].session=session;
                    sendMessage(index,rooms);
                    }else{
                        rooms[index].retry=0; 
                        pushMsg('danger','傳送'+rooms[index].name+'失敗，連線逾時')
                    }
            });
        }
        var loopMessage=function(){
            for(var i in $scope.rooms){
            if($scope.rooms[i].session){
                    sendMessage(i,$scope.rooms);
                }else{
                    loginAndSendMessage(i,$scope.rooms);
                }
            }
        }
        var sendMessageAuto=function(index,rooms){
            if(rooms[index].retry>=3){
                //pushMsg('danger','傳送'+rooms[index].name+'失敗，連線逾時')
                return;
            }
            var timeout = settingTimeout(rooms[index].name);
            console.log('room.session',index,rooms[index].session);
            var params=_.clone($scope.jsonObj);
                params.MessageType=Number(params.MessageType);
                params.Expires=Number(params.Expires);
                params.Speed=Number(params.Speed);

            App.service.message(rooms[index].ip,rooms[index].session,params,function(error,data){ 
                clearTimeout(timeout);
                if(data){
                    console.log(rooms[index].ip,'data',error,data)
                    if(data.hasOwnProperty('OK')){
                        console.log('傳送成功');
                        rooms[index].retry=0;
                        rooms[index].name=rooms[index].num=data.OK.ring_room_num;
                        rooms[index].machine_id=data.OK.machine_id;
                        $scope.updateRoomName();
                    }else{
                        rooms[index].retry++;
                        loginAndSendMessageAuto(index,rooms);
                    }
                    }else{
                        //pushMsg('danger','傳送'+rooms[index].name+'失敗，連線逾時')
                        return;
                    }
                })
            }
        var scanAuto=function(index,rooms){
            var timeout = setTimeout(function(){ delete rooms[index] }, 5000);
            App.service.machine(rooms[index].ip,function(error,data){
                clearTimeout(timeout);
                //console.log(rooms[index],error,session);
                if(data){
			if(rooms.hasOwnProperty(index)){
                        rooms[index].name=rooms[index].num=data.ring_room_num;
                        rooms[index].machine_id=data.machine_id;
                        rooms[index].token=data.token;
                        $scope.updateRoomName();
			}
                    }else{
                        if(rooms.hasOwnProperty(index)){
                            delete rooms[index];
                        }
                    }
            });
        }
        var loginAuto=function(index,rooms){
	console.log('auto login')
            var timeout = setTimeout(function(){ delete rooms[index] }, 5000);
            App.service.login(rooms[index].ip,App.adminUser,App.adminPasswd,function(error,session){
                clearTimeout(timeout);
                //console.log(rooms[index],error,session);
                if(session){
                    rooms[index].session=session;
                    }else{
                        if(rooms.hasOwnProperty(index)){
                            delete rooms[index];
                        }
                    }
            });
        }
        var loginAndSendMessageAuto=function(index,rooms){
            var timeout = setTimeout(function(){ delete rooms[index] }, 5000);
            App.service.login(rooms[index].ip,App.adminUser,App.adminPasswd,function(error,session){
                clearTimeout(timeout);
                //console.log(rooms[index].ip,error,session);
                if(session){
                    rooms[index].session=session;
                    sendMessage(index,rooms);
                    console.log('rooms',rooms)
                    }else{
                        if(rooms.hasOwnProperty(index)){
                            delete rooms[index];
                        }
                        //rooms[index].retry=0; 
                        //pushMsg('danger','傳送'+rooms[index].name+'失敗，連線逾時')
                    }
            });
        }
        var loopMessageAuto=function(){
            generatorAutoRoom(function(){
            console.log('rooms', $scope.autoRooms);
	    $scope.alerts.push({type: 'success',msg:'訊息已傳送!'});
            for(var i in $scope.autoRooms){
            if($scope.autoRooms[i].session){
                    sendMessageAuto(i,$scope.autoRooms);
                }else{
                    loginAndSendMessageAuto(i,$scope.autoRooms);
                }
            }

            setTimeout(function(){ 
	    $scope.alerts=[];
	    $scope.$apply(); 
	    }, 2000);

            });
        }
        var generatorAutoRoom=function(cb){
	    cfpLoadingBar.start();
            if($scope.autoRooms){
	    	cfpLoadingBar.complete();
                return cb();
            }
            var result_ary=[];
            async.eachSeries($scope.networks, function(network, callback) 
            {
                App.service.scanLAN(network.val,'443',$scope.scanType,function(back_ary){
                    result_ary=result_ary.concat(back_ary)
                    callback();
                })

            },
            function(err) 
            {
                if (err) { throw err; }
            for(var i in result_ary){
                var id='auto-'+i;
                var obj={id:id,name:id,session:null,ip:result_ary[i],retry:0}
                if(!$scope.autoRooms){
                     $scope.autoRooms={};
                }
                $scope.autoRooms[id]=obj;
            }
	    	cfpLoadingBar.complete();
                return cb();

                console.log('all done!!!');
            });
        }
        $scope.scanAllRooms=function(){
            $scope.autoRooms=null;
            $scope.alerts.push({type: 'success',msg:'掃描包廂中,請稍候!'});
            generatorAutoRoom(function(){
            for(var i in $scope.autoRooms){
                scanAuto(i,$scope.autoRooms);
            }
            console.log('$scope.autoRooms',JSON.stringify($scope.autoRooms))
	    $scope.alerts=[];
            setTimeout(function(){ $scope.$apply(); }, 5000);

            })
        }
        $scope.submit=function(){
            $scope.alerts=[];
            if($scope.jsonObj.Message.length>30){
                return pushMsg('danger','字數超過範圍，請減少至三十字內。')
            }
            var index=$scope.selectedRoom;
            return loopMessageAuto();
            if($scope.selectedRoom=='all'){
               return loopMessage();
                };
            console.log('index',index,$scope.rooms[index])
            if($scope.rooms[index].session){
                    sendMessage(index);
                }else{
                    loginAndSendMessage(index);
                }
        }
         $scope.$watch("scanType", function(){
             if($scope.scanType){
             $rootScope.scanType=$scope.scanType
             localStorage.setItem('scanType',$scope.scanType);
         }
         });
	$scope.closeAlert=function(index){
	    $scope.alerts.splice(index,1);
	        };
        $scope.addText=function(word){
            $scope.jsonObj.Message+=word;
        }
        $scope.cleanText=function(word){
            $scope.jsonObj.Message='';
        }
        $scope.reflash();
	setTimeout(function(){
	$scope.scanAllRooms();
	},100);
    }])
