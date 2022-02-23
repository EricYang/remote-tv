
angular.module('myApp')
    .controller('Tv3Ctrl',['$scope','$rootScope','$location','modal','cfpLoadingBar','webService',function($scope,$rootScope,$location,modal,cfpLoadingBar,webService){
    var path="resource/index.category.m3u"
    
        $scope.transCountrys=transCountrys;
        $scope.type=$location.search().type
        $scope.disableCountry=false;

        console.log('type',$scope.type)

        $scope.findNameByCode=function(code){
        var result=null;
           $scope.groupsO.map(function(a){
              if(a.code.toLowerCase()==code.toLowerCase()){
              result=a
              }        
              })  
              return result
        }

        $scope.selectedIndex=0
        $scope.selectedGroup={};
        $scope.changeGroup=function(group){
          
          $scope.selectedGroup=$scope.findNameByCode(group)
          if(!$scope.selectedGroup)return
          $scope.selectChannels=$scope.channels.filter(function(channel){
            return channel.inf.groupTitle==group
         })
        }

        $scope.readm3u8=function(data){
         reader.read(data);
         return reader.getResult().segments 
        }

        $scope.normal=function(){
        webService.get(path,{},function(data){
         $scope.channels=$scope.readm3u8(data)
        //console.log('$scope.channels',$scope.channels)
         $scope.groups=[]
         $scope.channels.map(function(channel){
          if($scope.groups.indexOf(channel.inf.groupTitle)==-1){
            $scope.groups.push(channel.inf.groupTitle);
          }
         })
         $scope.groupsO=[]
         $scope.groups.map((g)=>{
         $scope.groupsO.push({code:g,name:g,zht_name:g})
         })
         //console.log('$scope.groups',$scope.groups)

          $scope.groupsO=$scope.groupsO.sort(function(a,b){
           if(a.code > b.code)return -1
           if(a.code < b.code)return 1
           return 0
          })
          $scope.changeGroup('Sports')
        })
        }

        $scope.nextChannel=function(){
        $scope.selectedIndex+=1
        if($scope.selectChannels.length<=$scope.selectedIndex)$scope.selectedIndex=0
          $scope.switchChannel(null,$scope.selectedIndex)
        }
        $scope.backChannel=function(){
        $scope.selectedIndex-=1
        if($scope.selectedIndex<0)$scope.selectedIndex=0
          $scope.switchChannel(null,$scope.selectedIndex)
        }

        $scope.searchTv=function(){
        if($scope.search_input!='' && $scope.search_input){
        $scope.changeGroup($scope.selectedGroup.code)
        console.log('$scope.selectChannels',$scope.selectChannels)
          $scope.selectChannels=$scope.selectChannels.filter((n)=>{
          return (n.inf.title.toLowerCase().search($scope.search_input.toLowerCase())!=-1)
          })
          }
          
        }


        $scope.switchChannel=function(url,index){
        if(!url)url=$scope.selectChannels[index].url
        $scope.selectedIndex=index
        $scope.tvTitle=$scope.selectChannels[index].inf.title
        console.log('url',url)
          player.src({ type: "application/x-mpegURL",
          src:url });
          player.load()
         // player.play()
            var playPromise = player.play();

          if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Automatic playback started!
                // Show playing UI.
                player.pause()
                })
            .catch(error => {
                // Auto-play was prevented
                // Show paused UI.
                console.log('error')
                });
          }

        }

        $scope.normal();

       
    }])
