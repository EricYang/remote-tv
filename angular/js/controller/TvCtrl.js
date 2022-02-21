'use strict';   

    var transCountrys=[
    {
    "_id": "592e5905df33801ad8203f3d",
    "name": "Hong Kong",
    "zht_name": "香港",
    "code": "HK"
    },
    {
    "_id": "592e5905df33801ad8203fe6",
    "name": "Singapore",
    "zht_name": "新加坡",
    "code": "SG"
    },
    {
    "_id": "592e5905df33801ad8203f24",
    "name": "Australia",
    "zht_name": "澳洲",
    "code": "AU"
    },
    {
      "_id": "592e5905df33801ad8203f9a",
      "name": "Taiwan",
      "zht_name": "台灣",
      "code": "TW"
    },
    {
      "_id": "592e5905df33801ad8203fa7",
      "name": "Malaysia",
      "zht_name": "馬來西亞",
      "code": "MY"
    },
    {
      "_id": "592e5905df33801ad8203f1f",
      "name": "United States",
      "zht_name": "美國",
      "code": "US"
    },
    {
      "_id": "592e5905df33801ad8203f85",
      "name": "Japan",
      "zht_name": "日本",
      "code": "JP"
    },
    {
      "_id": "592e5905df33801ad8203f53",
      "name": "China",
      "zht_name": "中國",
      "code": "CN"
    },
    ]

angular.module('myApp')
    .controller('TvCtrl',['$scope','$rootScope','$location','modal','cfpLoadingBar','webService',function($scope,$rootScope,$location,modal,cfpLoadingBar,webService){
    var path='https://iptv-org.github.io/iptv/index.country.m3u'
    
        $scope.transCountrys=transCountrys;
        $scope.type=$location.search().type
        $scope.disableCountry=false;

        console.log('type',$scope.type)

        $scope.findNameByCode=function(code){
        var result=null;
           $scope.transCountrys.map(function(a){
              if(a.code==code){
              result=a
              }        
              })  
              return result
        }

        $scope.selectedIndex=0
        $scope.selectedCountry={};
        $scope.changeCountry=function(country){

          $scope.selectedCountry=$scope.findNameByCode(country)
          
          console.log('$scope.selectedCountry',$scope.selectedCountry)
          if(!$scope.selectedCountry)return
         if(country=='III'){
           $scope.selectChannels=iqiyi.segments
         }else if(country.search('1818')!=-1){
         var time=Number(country.split('-')[1])
         var at=time*200
         var end=(time+1)*200
         console.log('at',at,'end',end)
        $scope.selectChannels=age1818.segments.slice(at,end)
         }else{
          $scope.selectChannels=$scope.channels.filter(function(channel){
            return channel.inf.tvgCountry==country
         })
         }
        }

        $scope.readm3u8=function(data){
         reader.read(data);
         return reader.getResult().segments 
        }

        $scope.normal=function(){
        webService.get(path,{},function(data){
         $scope.channels=$scope.readm3u8(data)
         $scope.countrys=[]
         $scope.channels.map(function(channel){
          if($scope.countrys.indexOf(channel.inf.tvgCountry)==-1){
            $scope.countrys.push(channel.inf.tvgCountry);
          }
         })
         console.log('$scope.countrys',$scope.countrys)
          $scope.countries=[]
          $scope.transCountrys.map(function(a){
            if($scope.countrys.indexOf(a.code)!=-1){
             $scope.countries.push(a)
            }
          })

          /*
          $scope.countries.push(
            {"name": "Audlt","zht_name": "限制級影視-1","code": "1818-0"})
          $scope.countries.push(
            {"name": "Audlt","zht_name": "限制級影視-2","code": "1818-1"})
          $scope.countries.push(
            {"name": "Audlt","zht_name": "限制級影視-3","code": "1818-2"})
          $scope.countries.push(
            {"name": "Audlt","zht_name": "限制級影視-4","code": "1818-3"})
          $scope.countries.push(
            {"name": "Audlt","zht_name": "限制級影視-5","code": "1818-4"})
          $scope.countries.push(
            {"name": "Audlt","zht_name": "限制級影視-6","code": "1818-6"})
          $scope.countries.push(
            {"name": "Audlt","zht_name": "限制級影視-7","code": "1818-7"})
            */
          $scope.countries.push(
            {
            "_id": "592e5905df33801ad8203f53",
            "name": "IQIYI",
            "zht_name": "愛奇藝影視",
            "code": "III"
            })
          $scope.countries=$scope.countries.sort(function(a,b){
           if(a.code > b.code)return -1
           if(a.code < b.code)return 1
           return 0
          })
          $scope.changeCountry('US')
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
        $scope.changeCountry($scope.selectedCountry.code)
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

        if($scope.type=='1818'){
        $scope.selectChannels=age1818.segments
        $scope.disableCountry=true;
        }else{
        $scope.normal();

        }
       
    }])
    .controller('Tv3Ctrl',['$scope','$rootScope','$location','modal','cfpLoadingBar','webService',function($scope,$rootScope,$location,modal,cfpLoadingBar,webService){
    var path="https://iptv-org.github.io/iptv/index.category.m3u"
    
        $scope.transCountrys=transCountrys;
        $scope.type=$location.search().type
        $scope.disableCountry=false;

        console.log('type',$scope.type)

        $scope.findNameByCode=function(code){
        var result=null;
           $scope.transCountrys.map(function(a){
              if(a.code==code){
              result=a
              }        
              })  
              return result
        }

        $scope.selectedIndex=0
        $scope.selectedCountry={};
        $scope.changeCountry=function(country){

          $scope.selectedCountry=$scope.findNameByCode(country)
          
          console.log('$scope.selectedCountry',$scope.selectedCountry)
          if(!$scope.selectedCountry)return
         if(country=='III'){
           $scope.selectChannels=iqiyi.segments
         }else if(country.search('1818')!=-1){
         var time=Number(country.split('-')[1])
         var at=time*200
         var end=(time+1)*200
         console.log('at',at,'end',end)
        $scope.selectChannels=age1818.segments.slice(at,end)
         }else{
          $scope.selectChannels=$scope.channels.filter(function(channel){
            return channel.inf.tvgCountry==country
         })
         }
        }

        $scope.readm3u8=function(data){
         reader.read(data);
         return reader.getResult().segments 
        }

        $scope.normal=function(){
        webService.get(path,{},function(data){
         $scope.channels=$scope.readm3u8(data)
        console.log('$scope.channels',$scope.channels)
         $scope.countrys=[]
         $scope.channels.map(function(channel){
          if($scope.countrys.indexOf(channel.inf.groupTitle)==-1){
            $scope.countrys.push(channel.inf.groupTitle);
          }
         })
         console.log('$scope.countrys',$scope.countrys)
          $scope.countries=[]
          $scope.transCountrys.map(function(a){
            if($scope.countrys.indexOf(a.code)!=-1){
             $scope.countries.push(a)
            }
          })

          $scope.countries=$scope.countries.sort(function(a,b){
           if(a.code > b.code)return -1
           if(a.code < b.code)return 1
           return 0
          })
          $scope.changeCountry('US')
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
        $scope.changeCountry($scope.selectedCountry.code)
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
