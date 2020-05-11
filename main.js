//const cmd=require('./lib/cmd.js')
//const request=require('request');
//const https = require('https');
//const async = require('async');
var cmd,request,https,async,gui
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//var gui = require('nw.gui'); //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)

// Get the current window

/*
var win = gui.Window.get();
win.on ('open', function(){
console.log('loading')
    });
win.on ('loaded', function(){
console.log('loaded')
    });
*/

var App={
    adminUser:'admin',
    adminPasswd:'987654321',
    version:function(){
        return cmd.getVersion();
    },
    title:'無聲廣播系統',
    getID:function () {
        return '_' + Math.random().toString(36).substr(2, 9);
         },
    service:{
        login:function(ip,user,passwd,cb){
        var uri='https://'+ip+'/app_login.cgi?user='+user+'&passwd='+passwd+'&token=curl_test';
        request(uri, function (error, response, body) {
            console.log('login:',error,body,'by ',ip);
            if (!error && response.statusCode == 200) {
                var jsonBody,session;
                 try{  
                     jsonBody=JSON.parse(body)
                     }catch(e){
                        return cb(e,null)
                     }
                     if(jsonBody.hasOwnProperty('OK')){
                     session=jsonBody.OK.session
                     }

                      console.log(session) // Show the HTML for the Google homepage.
                     return cb(null,session);
                  }
                  
                  return cb(error,null);
            })

        },
        message:function(ip,session,jsonObj,cb){
        var uri='https://'+ip+"/broadcast_msg.cgi?session="+session
        var query = {
            url:uri,
            json:jsonObj,
            headers:{
                "content-type": "application/json"
            }
        };
        console.log('json',jsonObj);
        request.post(query, function (error, response, body) {
            console.log('message:',error,body,'by',ip);
                  cb(error,body);
              if (!error && response.statusCode == 200) {
                  console.log(body) // Show the HTML for the Google homepage.
                      }else{
                      console.log(error) // Show the HTML for the Google homepage.
                      }
                    })

        },
        machine:function(ip,cb){
        var uri='https://'+ip+"/machine.cgi";
        var query = {
            url:uri,
            headers:{
                "content-type": "application/json"
            }
        };
        request(query, function (error, response, body) {
            console.log('machine:',error,body);
              if (!error && response.statusCode == 200) {
                var jsonBody,data;
                 try{  
                     jsonBody=JSON.parse(body)
                     }catch(e){
                        return cb(e,null)
                     }
                     if(jsonBody.hasOwnProperty('OK')){
                     data=jsonBody.OK
                     }
                    return cb(error,data);
                      }else{
                      console.log(error) // Show the HTML for the Google homepage.
                        return cb(error,null)

                      }
                    })

        },
	pingLAN:function(ip,cb){
	var Ping = require('ping-wrapper');


	// load configuration from file 'config-default-' + process.platform
	// Only linux is supported at the moment
	Ping.configure();

	var ping = new Ping(ip);
	ping.timeout=setTimeout(function(){
	    ping.stop();
	        console.log('timeout');
		return cb(null);
	    
	    },5000);

	ping.on('ping', function(data){
	ping.stop();
	clearTimeout(ping.timeout);
		if(data){
	    	console.log('Ping', data.host);
	    	return cb(ip);
	    	}else{
	    	console.log('Ping fail',ip);
		return cb(null)
	    	}
	    });

	    ping.on('fail', function(data){
	    ping.stop();
	    clearTimeout(ping.timeout);
	        console.log('Fail', data.match);
		if(ping.timeout){
		return cb(null)
		}
		});
	},
        scanLANforX32:function(LAN,port,cb){

            var result_ary=[];
            
            var num=256;
	    
            for(var i=255; i >=1; i--){
                var ip=LAN+'.'+i;
		this.pingLAN(ip,function(data){
			if(data){
			 result_ary.push(data);
			}
			num--;
			console.log('num:',num , data)
			if(num==1){
			console.log('send result array',result_ary);
			return cb(result_ary);
			}

			
		});
		}
		

        },
        scanLAN:function(LAN,port,type,cb){
		if(type=='ia32'){
		this.scanLANforX32(LAN,port,cb)
		}else{
		this.scanLANforX64(LAN,port,cb)
		}
		

        },
	scanLANforX64:function(LAN,port,cb){
		var net    = require('net'), Socket = net.Socket;

		var checkPort = function(port, host, callback) {
			var socket = new Socket(), status = null;

			socket.on('connect', function() {status = 'open';socket.end();});
			socket.setTimeout(1500);
			socket.on('timeout', function() {status = 'closed';socket.destroy();});
			socket.on('error', function(exception) {status = 'closed';});
			socket.on('close', function(exception) {callback(null, status,host,port);});

			socket.connect(port, host);
		}   

		var result_ary=[];
		var num=255;
		for(var i=1; i <=255; i++){
			var ip=LAN+'.'+i;
			checkPort(port, ip, function(error, status, host, port){
					if(status == "open"){
					console.log("Reader found: ", host, port, status);
					result_ary.push(host);
					}
					num--;
					if(num<=1){
					cb(result_ary);
					}
					}); 
		}
	}


    }
}
