'use strict';   

function nofind(){
  var img=event.srcElement;
    img.src='https://vignette.wikia.nocookie.net/russel/images/c/cc/Channel_27_Test_Card_%281995-2001%29.png/revision/latest?cb=20190531022914'
      img.οnerrοr=null; 
      }

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
};

angular.module('myApp')
    .controller('TvCtrl',['$scope','$rootScope','modal','cfpLoadingBar','webService',function($scope,$rootScope,modal,cfpLoadingBar,webService){
    var path='https://iptv-org.github.io/iptv/index.country.m3u'
    $scope.transCountrys=[
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
      "zht_name": "中華民國",
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
      "zht_name": "美國爸爸",
      "code": "US"
    },
    {
      "_id": "592e5905df33801ad8203f85",
      "name": "Japan",
      "zht_name": "小日本",
      "code": "JP"
    },
    {
      "_id": "592e5905df33801ad8203f53",
      "name": "China",
      "zht_name": "中華民國淪陷區",
      "code": "CN"
    },
    ]
        $scope.findNameByCode=function(code){
        var result={};
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
          console.log($scope.selectedCountry)
          $scope.selectChannels=$scope.channels.filter(function(channel){
            return channel.inf.tvgCountry==country
         })
        }


        webService.get(path,{},function(data){
         reader.read(data);
         console.log('result', reader.getResult());
         $scope.channels=reader.getResult().segments
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
          $scope.countries=$scope.countries.sort(function(a,b){
           if(a.code > b.code)return -1
           if(a.code < b.code)return 1
           return 0
          })
          $scope.changeCountry('TW')
        })

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

        $scope.switchChannel=function(url,index){
        if(!url)url=$scope.selectChannels[index].url
        $scope.selectedIndex=index
        $scope.tvTitle=$scope.selectChannels[index].inf.title
        console.log('url',url)
          player.src({ type: "application/x-mpegURL",
          src:url });
          player.load()
          player.play()

        }
       
    }])
