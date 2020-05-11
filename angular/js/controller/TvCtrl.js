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
    var pathCountries="https://api.aaa4u.info/public/countries"
    $scope.selectedIndex=0
        $scope.changeCountry=function(country){
         $scope.selectChannels=$scope.channels.filter(function(channel){
            return channel.inf.tvgCountry==country
         })
        }
        webService.get(pathCountries,{},function(transCountry){
        $scope.transCountrys=transCountry.data;

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
        })
        $scope.nextChannel=function(){
        $scope.selectedIndex+=1
        if($scope.selectChannels.length<=$scope.selectedIndex)$scope.selectedIndex=0
          var url=$scope.selectChannels[$scope.selectedIndex].url
          var idx=$scope.selectedIndex
          $scope.switchChannel(url,idx)
        }
        $scope.backChannel=function(){
        $scope.selectedIndex-=1
        if($scope.selectedIndex<0)$scope.selectedIndex=0
          var url=$scope.selectChannels[$scope.selectedIndex].url
          var idx=$scope.selectedIndex
          $scope.switchChannel(url,idx)
        }

        $scope.switchChannel=function(url,index){
        $scope.selectedIndex=index
        console.log('url',url)
          player.src({ type: "application/x-mpegURL",
          src:url });
          player.load()
          player.play()

        }
       
    }])
    .controller('LineUserInfoCtrl',['$scope','$rootScope','modal','cfpLoadingBar',function($scope,$rootScope,modal,cfpLoadingBar){
    $scope.profile={userId:'xxxxxx',displayName:'name'}
    liff.getProfile().then(function (profile) {
    $scope.profile=profile;
    console.log('profile',profile)

    }).catch(function (error) {
        window.alert("Error getting profile: " + error);
    });
    }])
    .controller('LineUserEditorCtrl',['$scope','$rootScope','modal','cfpLoadingBar','webService','$location',function($scope,$rootScope,modal,cfpLoadingBar,webService,$location){
    $scope.user={userId:'xxxxxx',displayName:'name'}
    $scope.genderArray=[{key:'female',name:'女'},{key:'male',name:'男'}]
    $scope.classArray=['未分類','家人','親戚','朋友','同事','客戶','名人']
    $scope.isUser=false;

    $scope.init=()=>{
    $scope.customer={gender:'male',classname:"未分類"};
    }

    $scope.getParams=()=>{
    console.log("$routeParams",$location.search())
    if(getUrlParameter('isUser')){
    $scope.isUser=true;
    }
    if(getUrlParameter('name')){
    $scope.customer.name=getUrlParameter('name')
    }
    if(getUrlParameter('classname')){
    $scope.customer.classname=getUrlParameter('classname')
    }
    if(getUrlParameter('gender')){
    $scope.customer.gender=getUrlParameter('gender')
    }
    if(getUrlParameter('birthday')){
    $scope.customer.birthday=new Date(getUrlParameter('birthday'))
    }
    }
      $scope.init()
      $scope.getParams()

      const dateToString= (_date)=>{
      if(_date instanceof Date){
      return _date.getFullYear()+"/"+Number(_date.getMonth()+1)+"/"+_date.getDate()
      //return _date.toISOString().replace('-', '/').split('T')[0].replace('-', '/').substr(0,10)
      }else{
      return _date
      }
      }

      try{
      liff.getProfile().then(function (profile) {
      $scope.user=profile;
      $scope.customer.uid=profile.userId
      console.log('profile',profile)

      }).catch(function (error) {
          window.alert("Error getting profile: " + error);
      });
      }catch(err){
      }
        
        $scope.closeAlert=function(i,alerts){
         $scope.alerts.splice(i,1);
        }
        
        $scope.ok=function(){
        let theshop=$scope.customer
        $scope.alerts=[];
        if(!theshop.classname || !theshop.gender || !theshop.name || !theshop.birthday ){
        $scope.alerts.push({msg:"沒有填寫完整",type:'warning'})
        return true
        }else{
        let thedata=$scope.customer;
        thedata.birthday=dateToString($scope.customer.birthday);
        let path="https://api.aaa4u.info/nine/customer"
        if($scope.isUser){
        path="https://api.aaa4u.info/nine/user"
        }
        webService.add(path,thedata,function(data){
        if(data.error){
        $scope.alerts.push({msg:data.error,type:'warning'})
        }else{
        $scope.alerts.push({msg:data.msg,type:'warning'})
        $scope.customer_old=$scope.customer;
        $scope.init()
        $scope.customer.classname=$scope.customer_old.classname;
        $scope.customer.uid=$scope.user.userId
        }
         
        })

        }
        }
        
        $scope.save = function() {
        //webService.add("https://49671979.ngrok.io/api/internal/owners",$scope.user,function(){

        //})
        }
    }])
