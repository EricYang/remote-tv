/*
 * AjaxTCR Library
 * Software License Agreement (BSD License)
 *
 * Copyright © 2007, Pint, Inc.
 * All rights reserved.
 *
 * Redistribution and use of this software in source and binary forms,
 * with or without modification, are permitted provided that the
 * following conditions are met:
 *
 *   - Redistributions of source code must retain the above
 *      copyright notice, this list of conditions and the following
 *      disclaimer.
 * 
 *   - Redistributions in binary form must reproduce the above
 *      copyright notice, this list of conditions and the
 *      following disclaimer in the documentation and/or other materials
 *      provided with the distribution.
 *
 *   - Neither the name of Pint Inc. nor the names of its contributors
 *      may be used to endorse or promote products derived from this
 *      software without specific prior written permission of Pint Inc.
 *
 *
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Docs are generated using java -jar app/js.jar app/run.js -t=templates/htm -d=../docs ../ajaxtcr.js
 * OR for private included: java -jar app/js.jar app/run.js -p -t=templates/htm -d=../docsall ../ajaxtcr.js
 */

/**
 * @fileOverview The AjaxTCR library was built to support "Ajax: The Complete Reference".
 * The primary purpose to cover all aspects of communications including XHR, fallback transports,
 * request queue, response queue, caching, templates, many entries to callbacks, form serialization, and proper 
 * history management.
 * The library also includes supporting functions for data manipulation, dom access, event handling,
 * persistence, as well as caching, templates, and history outside of the scope of communications. 
 * @name ajaxtcr.js
 */


/**
* The AjaxTCR global namespace object.  
* @class AjaxTCR
* @static
*/

var AjaxTCR = {};

/**
 * The communication class of the library.  Contains communication methods
 * as well as subclasses for caching, queueing, collecting statistics, and accessing 
 * cookies
 * @class AjaxTCR.comm
 * @static
 */
AjaxTCR.comm = {
	
/******************************************  Constants  ******************************************/

/** readyState constants as defined by w3c */
 UNSENT : 0,
 OPEN :   1,
 SENT : 2,
 LOADING : 3,
 DONE : 4,

/** Default HTTP request method 
 * @private
 */
DEFAULT_REQUEST_METHOD : "GET",

/** Default async option 
 * @private
 */
DEFAULT_ASYNC : true,

/** Default option to prevent browser caching of request.  
 * Only  works with XHRs and is done by setting the "If-Modified-Since" header 
 * @private
 */
DEFAULT_PREVENT_CACHE: false,
  
/** Default Request Content Type  
 * @private
 */
DEFAULT_CONTENT_TYPE : "application/x-www-form-urlencoded",

/** Default Request Content Transfer Encoding  
 * @private
 */
DEFAULT_CONTENT_TRANSFER_ENCODING : "",

/** Default indicate transport scheme used.  If set will include the transport scheme in the headers or payload  
 * @private
 */
DEFAULT_TRANSPORT_INDICATOR : true,

/** Default timeout in ms.   
 * @private
 */
DEFAULT_TIMEOUT : 0,

/** Default number of Retries  
 * @private
 */
DEFAULT_RETRIES : 0,
 
/** Default show progress  
 * @private
 */
DEFAULT_SHOW_PROGRESS : false,

/** Default time to revisit our progress callback if monitoring progress  
 * @private
 */
DEFAULT_PROGRESS_INTERVAL : 1000,

/** Default enforce order.  If set, it will enforce order on all requests that have the value set, but not those without  
 * @private
 */
DEFAULT_ENFORCE_ORDER : false,

/** Default Cache Response  
 * @private
 */
DEFAULT_CACHE_RESPONSE : false,

/** Default to put the responseText into outputTarget  
 * @private
 */
DEFAULT_USE_RAW : true,

/** Default one way transmission.  Will not call any callbacks if set 
 * @private
 */
DEFAULT_ONEWAY : false,

/** Default signature to use to sign request.  Places value in the header  
 * @private
 */
DEFAULT_REQUEST_SIGNATURE : "X-Signature",

/** Default option if the response is signed  
 * @private
 */
DEFAULT_SIGNED_RESPONSE : false,

/** Default transport scheme  
 * @private
 */
DEFAULT_TRANSPORT : "xhr",

/** Default transport string value.  Name of the header or payload value that will be sent with request  
 * @private
 */ 
DEFAULT_TRANSPORT_HEADER : "X-Requested-By",

/** Default values to set the transport value to. 
 * @private
 */
DEFAULT_XHR_TRANSPORT_VALUE: "XHR",
DEFAULT_IFRAME_TRANSPORT_VALUE: "iframe",
DEFAULT_IMAGE_TRANSPORT_VALUE: "image",
DEFAULT_SCRIPT_TRANSPORT_VALUE: "HTMLScriptTag",

/** Fallback to another transport if XHR fails  
 * @private
 */
DEFAULT_FALLBACK : true,

/** Default fallback transport scheme  
 * @private
 */
DEFAULT_FALLBACK_TRANSPORT: "iframe",

/** Default output handing.  Places responseText into outputTarget with this method  
 * @private
 */
DEFAULT_INSERTION_METHOD : "replace",

/** Cache the template  
 * @private
 */
DEFAULT_CACHE_TEMPLATE : true,

/** Default location for rendering templates  
 * @private
 */
DEFAULT_TEMPLATE_RENDER : "client",

/** Constant for server defined template file  
 * @private
 */
TEMPLATE_SERVER_DEFINED : "dynamic",


/****************************************** Private Properties ****************************************************/
 
/** the request id counter  
 * @private
 */	
 _requestID : 0,  	

/** request counter shows outstanding requests  
 * @private
 */
_requestsOutstanding : 0,
 
/** the statuses for possible network errors
 *  3507 = library error flag 
 * @private
 */
 _networkErrorStatus : new Array(0, 408, 504, 3507, 12002, 12007, 12029, 12030, 12031, 12152),
 
 
 /*****************************************  GETTERS/SETTERS ***********************************/

/**
 * Updates a default value in the AjaxTCR.comm namespace.
 * 
 * @param {string} option The name of the option to update
 * @config {string} DEFAULT_REQUEST_METHOD Possible values - any valid HTTP Method.  Default: "GET"
 * @config {boolean} DEFAULT_ASYNC Default: true 
 * @config {boolean}DEFAULT_PREVENT_CACHE Default: false,
 * @config {string} DEFAULT_CONTENT_TYPE Default : "application/x-www-form-urlencoded",
 * @config {string} DEFAULT_CONTENT_TRANSFER_ENCODING Default : "",
 * @config {boolean}DEFAULT_TRANSPORT_INDICATOR Default : true,
 * @config {integer} DEFAULT_TIMEOUT Default : 0,
 * @config {integer} DEFAULT_RETRIES Default : 0,
 * @config {boolean} DEFAULT_SHOW_PROGRESS Default : false,
 * @config {integer} DEFAULT_PROGRESS_INTERVAL Default : 1000,
 * @config {boolean} DEFAULT_ENFORCE_ORDER Default : false,
 * @config {boolean} DEFAULT_CACHE_RESPONSE Default : false,
 * @config {boolean} DEFAULT_USE_RAW Default : true,
 * @config {boolean} DEFAULT_ONEWAY Default : false,
 * @config {string} DEFAULT_REQUEST_SIGNATURE Default : "X-Signature",
 * @config {boolean} DEFAULT_SIGNED_RESPONSE Default : false,
 * @config {string} DEFAULT_TRANSPORT Default : "xhr",
 * @config {string} DEFAULT_TRANSPORT_HEADER Default : "X-Requested-By",
 * @config {string} DEFAULT_XHR_TRANSPORT_VALUE Default : "XHR",
 * @config {string} DEFAULT_IFRAME_TRANSPORT_VALUE Default : "iframe",
 * @config {string} DEFAULT_IMAGE_TRANSPORT_VALUE Default : "image",
 * @config {string} DEFAULT_SCRIPT_TRANSPORT_VALUE Default : "HTMLScriptTag",
 * @config {boolean} DEFAULT_FALLBACK Default : true,
 * @config {string} DEFAULT_FALLBACK_TRANSPORT Default : "iframe",
 * @config {string} DEFAULT_INSERTION_METHOD Default : "replace",
 * @config {boolean} DEFAULT_CACHE_TEMPLATE Default : true,
 * @config {string} DEFAULT_TEMPLATE_RENDER Default : "client",
 * @config {string} TEMPLATE_SERVER_DEFINED Default : "dynamic",
 * @param {object} value  The value to set the option to.
 */								
setDefault : function(option, value){
	AjaxTCR.comm[option] = value;
},

/**
 * Retrieves the default value in the AjaxTCR.comm namespace for the given option
 * 
 * @param {string} option The name of the option to fetch
 * @return {string} The value of the passed in option
 */
getDefault : function(option){
	return AjaxTCR.comm[option]
},				


/******************************************  Public Methods  ******************************************/

/**
 * sendRequest - public method to create an Ajax style request
 * 
 * @param url 	string of URL to send request to
 * @param options  object containing the options for the request
 * @config {Boolean} async	Defines if the request should be asynchronous or not.  The default is true when not specified.
 * @config {string} cacheKey	By default, when cache is turned on, items are saved in cache using the URL of the object as a key.  If another value is desired you may set it through this property though you will be responsible for manually retrieving as the request system will use the URL of requests to determine if something is cached or not.	Default is URL of request
 * @config {Boolean} cacheResponse	Boolean to indicate if the response should be saved in the response cache.	Default is false
 * @config {Boolean} cacheTemplate	Indicates that if a cache is returned with the response if it should be saved in the template cache or not.	Default is true
 * @config {string} cookieName	The name of the cookie expected upon response when the transport type is image.  If specified the responseText will be populated with the value of this cookie only.  If unspecified responseText will contain the entire cookie and the developer is required to parse out the response manually.  Should be set if outputTarget is also specified with request.	Default is document.cookie
 * @config {Boolean} enforceOrder	Boolean to force every response that has this value set to be returned in the order in which it was sent, this means that requests may be held until previous requests arrive.	Default is false
 * @config {Boolean} fallback	Defines if the communication mechanism should fallback to another method if the XHR fails for some reason.  The fallback transport scheme is defined by fallbackTransport or the global default is consulted.	Default is true
 * @config {string} fallbackTransport Options are "iframe" | "script" | "image"  Defines the particular communication mechanism that should be used if XHRs fail for some reason fallback. If undefined the global default (iframe) is used unless it has been overridden.  .	Default is "iframe"
 * @config {object} headers  Array-of-Header Objects	An array of header objects to be sent with the request.  The header object must have two properties called name and value with the appropriate values.  It is set up in this manner to allow multiple values for a single name.  The library will append these together with ‘,’. Note that setting a Cookie header should be avoided particularly if more than one value is set and document.cookie should be used instead. 	Default is []
 * @config {object} history	Used to control the history mechanism on a request basis.  The passed object has three properties, saveResponse, id, and title. The saveResponse property indicates that the response will be cached and when a user backs up to the page in question another request will not be issued.  By default responses will not be saved. The id is the value used in the hash mark (ex. #currentState), the id is required.  The title property is used to set the title of the page so as to reflect the current state of the application.	Default is null
 * @config {string} insertionType  "insertBefore" | "insertAfter" | "firstChild" | "lastChild" | "replace" 	Used in conjunction with outputTarget to define how content returned should be handled relative to the element specified by the outputTarget value.  By default the returned content will replace the outputTarget element content. Other values include. <br />insertBefore put as element just before the specified element <br />insertAfter put as an element just after the specified element<br />firstChild put as the first child within the specified element<br />lastChild put as the last child within the specified element 	<br />Default is "replace" 
 * @config {string} method HTTP-method	Sets the method for the request to the string HTTP-method.  No limit to what is settable, though some XHR implementations will not support some methods and of course destinations may reject methods.  If unset a default method will be used.  Note that some browsers XHR implementations will not allow for extended HTTP methods and that alternate transfers may be even more restrictive (iframe - GET and POST, all other transports - GET only)	Default is "GET"
 * @config {function} onCreate	Called right after the XHR object is created.  Corresponds to readyState == 0.  Passes the request object.	Default is null
 * @config {Boolean} oneway	Indicates if the request is one way and thus if the response should be ignored.	Default is false
 * @config {function} onFail	Callback that is called when a server error occurs.  Most often this occurs when the status != 200.  Passes the request object along with a message describing the error.	Default is function () {}
 * @config {function} onLoading	Callback that is called with the xhr.readyState == 3.  This occurs when the data begins to come back.  Passes the request object.	Default is null
 * @config {function} onOpen	Callback that is called when the xhr.readyState == 1.  This occurs after xhr.open.  Passes the request object.	Default is null
 * @config {function} onPrefetch	Callback that is invoked when you are prefetching data but not yet using it.	Default is function (){} 
 * @config {function} onProgress	Callback invoked by default once every second.  Useful for updating the user to the progress of long requests.  Often used with the status object. You can override the default progressInterval of one second if desired.	Default is function () {}
 * @config {function} onReceived Callback that corresponds to readyState 4 but without having looked at the success or failure of the request yet, thus it will be called before onSuccess or onFail.	Default is null
 * @config {function} onRetry	Callback function that is called when retry is enabled.  Called very time a retry occurs.	Default is function () {}
 * @config {function} onSent	Callback that is called when the xhr.readyState = 2.  This occurs right after xhr.send().  Passes the request object.	Default is null
 * @config {function} onStatus	Callback that is invoked for the corresponding status code.  For example the callback for on404 is called when a response of 404 is received while an on500 is called when a 500 response code is received.	Default is undefined
 * @config {function} onSuccess	Primary callback that will be called whenever the request completes successfully with a status of 200.  Passes the response object as a parameter.	Default is function () {}
 * @config {function} onTimeout	Callback that is invoked when a timeout occurs.  If there are retries and continual failures this callback may be invoked numerous times.	Default is function () {}
 * @config {object} outputTarget	When specified the request’s responseText will be automatically inserted into the specified object using its innerHTML property.  The object should be a reference to a DOM element or a string to be used that references an existing DOM element by its id attribute.  The useRaw option can be set to false so that a user may desire to override the immediate placement of content but still use this property as a reference. 	Default is null
 * @config {string} password	The password to be used when addressing HTTP authentication challenges.  Only supported with the XHR transport. 	Default is ""
 * @config {string} payload	The payload is a properly encoded string (or object) to be submitted in a query string or message body depending on the HTTP method used.  Various AjaxTCR.data methods like encodeValue() and serializeForm() may be used to quickly form a payload. The payload must be in the format in which it is going to be used.	Default is ""
 * @config {Boolean} preventCache	When set to true, attempts to disable caching by setting the request header to a very old date.  Users may also desire to add a unique query string as well.	Default is false
 * @config {millisecond} progressInterval	This value is used to indicate how often the request should be polled for progress updates in milliseconds.  Defaults to 1 second (1000ms).
 * @config {string} requestContentType MimeType string	The content type on the request.  If the request is a POST, it will set the request Content-Type header to this value.  Will base form serialization on it as well.	Default is "application/x-www-form-urlencoded"
 * @config {string} requestContentTransferEncoding encodingType	Sets the Content-Transfer-Encoding header on the request to the defined value.	Default is ""
 * @config {string} requestSignature	Indicates the header used when signing requests and will contain the contents of signRequest property if it is set.	Default is "X-Signature"
 * @config {integer} retries	Indicates if a request should be retried if an error is encountered or a timeout occurs.   Set to false or 0 to not retry failed requests.  Set this value larger than 0 to indicate number of retries	Default is 0
 * @config {object} serializeForm	Automatically encodes the contents of the form specified as an object, id or name.  A default encoding of x-www-form-urlencoded will be used unless the requestContentType attribute is set.	Default is null
 * @config {Boolean} showProgress	Setting this property to true indicates that the progress event will fire.	Default is false
 * @config {string} signRequest "signature string"	Used to sign a request, typically it is an MD5 hash value that will be put in the Web page when generated by a server-side program.	Default is null
 * @config {Boolean} signedResponse	If the response is signed, the library will check the "Content-MD5" header in the response and compare it to a MD5 encoding of the responseText.  If they do not match, onFail is called and the responseText is not returned.	Default is false
 * @config {object} statusIndicator statusObject 	The property should be set to an object which contains visual display information for indicating status.  At this point it supports an object with a single property progress set to an object containing type which can be either image or text, imageSrc which is the URL of the image to use in the case type is set to image, and text is a string to use in the case the type is set to text.  A target property is set to the DOM id reference of the place the status should be displayed. 	Default is null
 * @config {string} template URL | "dynamic" 	If a URL is specified the template to apply to a response will be fetched.  If the string value of “dynamic” is used a server-side program will respond and include a template value either as a string or as URL to fetch.  These values are found in the response packet in JSON format at the properties templateText and templateURL respectively.  	Default is null
 * @config {string} templateRender "client" | "server"	String indicating if a template should be rendered on client or server, only works if the template property is set.  A default value of client is assumed when template is set but templateRender is not.	Default is "client"
 * @config {number} timeout	Indicates whether to timeout or not.  False or 0 indicates not to catch timeouts.  A number greater than 0 indicates the number of milliseconds before timing out.	Default is false
 * @config {string} transport "xhr" | "iframe" | "script" | "image"	Transport to make the request with.  By default this will be XHR though you can change it on a per request basis.  The global transport can be set with setDefault("transport",value) where value one of the defined strings.  The transport choice may change a request depending on the capabilities of the transport indicated. For example, image and script transports will not accept a POST request and will convert it into a GET if possible.	Default is "xhr"
 * @config {Boolean} transportIndicator	Indicates if Ajax indicating headers such as X-Requested-By: XHR should be included.  Normally defined by value AjaxTCR.comm.DEFAULT_TRANSPORT_INDICATOR. Setting as an option effects only the request made, use the general the getter/setter AjaxTCR.comm.setDefault("DEFAULT_TRANSPORT_INDICATOR", false);	Default is true
 * @config {Boolean} useRaw	By default this is set to true and is consulted when outputTarget is set.  If set to false the response’s payload will not be directly put into the outputTarget forcing you to manually perform any decode and placement. 	Default is true
 * @config {string} username	Used to specify the username for HTTP authentication challenges issued to a request.  Only usable with an XHR transport.	Default is ""
 * @config {Boolean} useRaw	This value is consulted when outputTarget is set.  If set to false the response’s payload will not be directly put into the outputTarget forcing you to manually perform any decode and placement. 	Default is true
 * @config {object} userVars	Value attached to the request/response object that may contain any form of user defined data.	Default is undefined
 * @return {object} The newly generated request object.
 */	
 sendRequest : function (url,options) {
 	
	var request = new Object();
		
	/* increment our requestId number */  
	request.requestID = ++AjaxTCR.comm._requestID;
	
	/* basic communication defaults */
	request.method = AjaxTCR.comm.DEFAULT_REQUEST_METHOD;
    request.async = AjaxTCR.comm.DEFAULT_ASYNC;
	request.preventCache = AjaxTCR.comm.DEFAULT_PREVENT_CACHE;
	request.requestContentType = AjaxTCR.comm.DEFAULT_CONTENT_TYPE;
	request.requestContentTransferEncoding = AjaxTCR.comm.DEFAULT_CONTENT_TRANSFER_ENCODING;
	request.payload = "";

	/* header management */
	request.headers = new Array();
	request.transportIndicator = AjaxTCR.comm.DEFAULT_TRANSPORT_INDICATOR;

	/* standard callbacks */
	request.onSuccess = function(){};
	request.onFail = function(){};
	
	/* callbacks associated with readyState changes */
	request.onCreate = null;
	request.onOpen = null;
	request.onSent = null;
	request.onLoading = null;
	request.onReceived = null;

	/* communication status flags */    
    request.abort = false;
	request.inProgress = true;
	request.received = false;
	
	/* progress management */
	request.showProgress = AjaxTCR.comm.DEFAULT_SHOW_PROGRESS;
	request.progressInterval = AjaxTCR.comm.DEFAULT_PROGRESS_INTERVAL;
	request.onProgress = function (){};
	request.progressTimerID = null;
	
	/* timeout parameters */
	request.timespent = 0;
	request.timeout = AjaxTCR.comm.DEFAULT_TIMEOUT;
	request.onTimeout = function(){};
	request.timeoutTimerID = null;

    /*  retry parameters */
	request.retries = AjaxTCR.comm.DEFAULT_RETRIES;
	request.retryCount = 1;
	request.onRetry = function (){};
	
	/* sequencing */
	request.inQueue = false;
	request.responseQueueID = 0;
	request.enforceOrder = AjaxTCR.comm.DEFAULT_ENFORCE_ORDER;

	/* cache management */
	request.cacheResponse = AjaxTCR.comm.DEFAULT_CACHE_RESPONSE;
	request.fromCache = false;
	
	/* Prefetch */
	request.onPrefetch = function(){};
	request.isPrefetch = false;

    /* payload serialization */
	request.serializeForm = null;
	request.hasFile = false;

    /* output handling */
	request.outputTarget = null;
	request.useRaw = AjaxTCR.comm.DEFAULT_USE_RAW;
	request.insertionType = AjaxTCR.comm.DEFAULT_INSERTION_METHOD;
	
	/* transmission type */
	request.oneway = AjaxTCR.comm.DEFAULT_ONEWAY;
	
	/* authentication */
	request.username = null;
	request.password = null;
	
	/* security */
	request.requestSignature = AjaxTCR.comm.DEFAULT_REQUEST_SIGNATURE;
	request.signRequest = null;
	request.signedResponse = AjaxTCR.comm.DEFAULT_SIGNED_RESPONSE;

	/* history */
	request.history = null;
	
	/* transport/fallback */
	request.transport = AjaxTCR.comm.DEFAULT_TRANSPORT;
	request.fallback = AjaxTCR.comm.DEFAULT_FALLBACK;
	request.fallbackTransport = AjaxTCR.comm.DEFAULT_FALLBACK_TRANSPORT;
	request.cookieName = null;
	
	/* Templates */
	request.template = null;
	request.templateRender = AjaxTCR.comm.DEFAULT_TEMPLATE_RENDER;

	request.cacheTemplate = AjaxTCR.comm.DEFAULT_CACHE_TEMPLATE;
	request.shortTermCacheTemplate = false;
	
	request.statusIndicator = null;
	
    /* apply options defined by user */
    for (option in options)
      request[option] = options[option];
	  
	if (request.isPrefetch)
		request.cacheResponse = true;
		
	/* Enable backguard if necessary */
	if (AjaxTCR.history._backGuardEnabled == AjaxTCR.history.BACK_GUARD_INITIALIZED)
		AjaxTCR.history._activateBackGuard();
		
	/* Check for/Fetch template */
	if (request.template && request.template != AjaxTCR.comm.TEMPLATE_SERVER_DEFINED && request.templateRender == "client")
	{
		if (!AjaxTCR.template.getFromCache(request.template))
		{
			request.enforceOrder = true;
			AjaxTCR.comm.sendRequest(request.template, {shortTermCacheTemplate:true, enforceOrder:true});
		}
	}
	else if (request.template && request.template != AjaxTCR.comm.TEMPLATE_SERVER_DEFINED && request.templateRender == "server")
	{
		if (request.payload != "")
			request.payload += "&";
		request.payload += "templateURL=" + request.template;
	}
	  
	/* Serialize the given form if request.serialize is set */
	if (request.serializeForm)
	{
		/* Serialize given form */
		var newPayload = AjaxTCR.data.serializeForm(request.serializeForm,request.requestContentType);
		
		/* check to see if we have a fileupload situation */
		if (newPayload == "fileupload")
			request.hasFile = true;
		else
		{
			/* Check to see if payload exists */
			if (request.payload)
			{
				/* If payload is an object, use serializeObject otherwise append to end of the new payload */
				if (typeof(request.payload) == "object") 
					newPayload = AjaxTCR.data.serializeObject(newPayload, request.payload, request.requestContentType);
				else if (request.requestContentType == AjaxTCR.comm.DEFAULT_CONTENT_TYPE)
					newPayload += "&" + request.payload;  
			}
			
			request.payload = newPayload;
			
			/* Get all values into string format */
			if (request.requestContentType == "application/json")
	  			request.payload = AjaxTCR.data.encodeJSON(request.payload);
			else if (request.requestContentType == "text/xml")
				request.payload = AjaxTCR.data.serializeXML(request.payload);
				
			/* Encode it in base64 if that's set */
			if (request.requestContentTransferEncoding == "base64")
				request.payload = AjaxTCR.data.encode64(request.payload);
		}
	}
	
	/* Add to history */
	if (request.history)
		AjaxTCR.history.init(function(){});
		
	if (request.history && !request.history.saveResponse)
		AjaxTCR.history.addToHistory(request.history.id, "", request.history.title, url,  options);
  
  	/* If there is a file, we need to handle differently */
	if (request.hasFile)
		request.transport = "iframe";
	
	/* normalize the transport value */	
	request.transport = request.transport.toLowerCase();
	
	if (request.transport == "script" || request.transport == "image")
		request.method = "GET";
	
	if (request.method.toUpperCase() == "GET" && request.payload != "")
		request.url = url + "?" + request.payload;
	else
	    request.url = url;
		 
	if (request.method.toUpperCase() == "POST")
		request.postBody = request.payload;
	else
	    request.postBody = null;
	    	
		
	/* Add a queueID if necessary */
	if (request.enforceOrder)
		request.responseQueueID = AjaxTCR.comm.queue._responseQueue.maxID++;
		
	var cachedResponse = null;
	/* Check if the item is in the cache first */
	if (request.cacheResponse)
	{
		/* Check to see if we have a key for our cache */
		if (request.cacheKey == undefined)
			request.cacheKey = request.url;
	
		cachedResponse = AjaxTCR.comm.cache.get(request.cacheKey);
		if (cachedResponse)
			AjaxTCR.comm.cache._handleCacheResponse(request, cachedResponse);
	}
		
	/* invoke the request */
	if (!cachedResponse)
		AjaxTCR.comm._makeRequest(request);
	

    /* return object for local control */
    return request;	
 },		
 
 
 /**
  * Public method that will abort any passed request object and clean up
  * any timers for showing requqest state
  * 
  * @param {object} request The request object generated through sendRequest.
  */
 abortRequest : function(request) {
 	     
	/* set the abort flag */
 	request.abort = true;
									 
	/* clear inProgress flag */
	request.inProgress = false;
									 
	/* abort the request */	
	request.xhr.abort();
									 
	/* decrement outstand request count */
	AjaxTCR.comm._requestsOutstanding--;
									 
	/* clear any timeout timers */
	clearTimeout(request.timeoutTimerID);
	request.timeoutTimerID = null;
									 
	/* stop showing progress */
	if (request.progressTimerID)
	  {
	   clearTimeout(request.progressTimerID);
	   request.progressTimerID = null;
	  }
										
	/* Remove Progress Indicators */
	if (request.statusIndicator)
	  {
		AjaxTCR.comm._removeProgressStatus(request.statusIndicator);
	  }									
},

/******************************************  Private Methods  ******************************************/
 	 
 
 /**
 * _createXHR - private method acting as a wrapper to make an XMLHttpRequest object.  Trys native
 *              object first and then ActiveX control.  Returns null if fails.
 * 
 * @private
 * @return {object} Either the native XHR Object or the most current ActiveX version supported.
 */	
 _createXHR : function() { 
                          
	try { return new XMLHttpRequest(); } catch(e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } 	  catch (e) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP"); }  catch (e) {}
						  	           
    return null;
},

/**
 * Private method that decides which initializes the requesst, decides which transport to use, and calls the send method for that transport.
 * 
 * @private
 * @param {object} the Request Object to make the request with.
 */

_makeRequest : function (request) {		

									
	/* Increment total requests */
	AjaxTCR.comm.stats._commResults.totalRequests++;
									
	/* Display status and start Progress Callback */
	if (!request.oneway)
		AjaxTCR.comm._initSend(request);
								  
	/* Call back for ready state 0 if set */
	if (request.onCreate)
	  request.onCreate(request);
									  
	if (request.transport == "xhr")
		AjaxTCR.comm._sendXHR(request);
	else if (request.transport == "iframe")
		AjaxTCR.comm._sendIframe(request);
	else if (request.transport == "script")
		AjaxTCR.comm._sendScript(request);
	else if (request.transport == "image")
		AjaxTCR.comm._sendImage(request);
									 	                              	
},

/**
 * Private method that sends an XHR request.  It creates the XHR, fallsback if any problems are encountered, sets appropriate headers,
 * and sends the requesst.
 * 
 * @private
 * @param {Object} request The request that contains the options that we wish to send.
 * 
 */
								 
_sendXHR : function(request){
	
	request.xhr = AjaxTCR.comm._createXHR();
	if (!request.xhr)
	{
		AjaxTCR.comm._fallbackOrError(request);
		return;
	}									
							
	/* open the request */
	try{
		request.xhr.open(request.method, request.url, request.async, request.username, request.password);
	}
	catch(e){
		AjaxTCR.comm._fallbackOrError(request);
		return;
	}								
	
	/* clear an abort flag in case this is a retry */
	request.abort = false;
									
	/* set headers indicating we did this with Ajax and what our transaction id is */
	if (request.transportIndicator)
	{
	   request.xhr.setRequestHeader(AjaxTCR.comm.DEFAULT_TRANSPORT_HEADER,AjaxTCR.comm.DEFAULT_XHR_TRANSPORT_VALUE);
	   request.xhr.setRequestHeader("X-Request-Id",request.requestID);
	}
									  
	/* Set signature header */
	if (request.signRequest)
	 	request.xhr.setRequestHeader(request.requestSignature, request.signRequest);
								
	/* set header(s) for POST */
	if (request.method.toUpperCase() == "POST")
	{
	   request.xhr.setRequestHeader("Content-Type", request.requestContentType);
	   if (request.requestContentTransferEncoding != "")
		 request.xhr.setRequestHeader("Content-Transfer-Encoding", request.requestContentTransferEncoding);
	}
									  
	/* Prevent Caching if set */
	if (request.preventCache)
		request.xhr.setRequestHeader("If-Modified-Since", "Wed, 15 Nov 1995 04:58:08 GMT");
									  
	/* set user defined headers */
	request.headerObj = {};
	for (var i=0; i<request.headers.length;i++)
	{
		if (request.headers[i].name.toUpperCase() == "COOKIE")
			document.cookie = request.headers[i].value;
		else if(request.headerObj[request.headers[i].name] === undefined)
			request.headerObj[request.headers[i].name] = request.headers[i].value;
		else	
			request.headerObj[request.headers[i].name] =  request.headers[i].value + "," + request.headerObj[request.headers[i].name];
	}
									
	for (var header in request.headerObj)
		request.xhr.setRequestHeader(header, request.headerObj[header]);
									
	
	if (!request.oneway)
	{
		/* bind the success callback */
		request.xhr.onreadystatechange = function () {AjaxTCR.comm._handleReadyStateChange(request);};
									
		/* set a timeout if set */
		if (request.async && request.timeout && request.timeoutTimerID == null)
			 request.timeoutTimerID = window.setTimeout( function(){AjaxTCR.comm._timeoutRequest(request);}, request.timeout);
		
	}
									
	/* send the request */
	request.xhr.send(request.postBody);	 
},
	
/** 
 * Private method that creates a request using the script transport.  Updates the payload to pass the transport method, creates a script element,
 * sends the request by adding the element to the page.
 * 
 * @private
 * @param {Object} request The request object that is being sent.
 */			
_sendScript : function(request){
	var script = document.createElement('script');
	var callback = function(){AjaxTCR.comm._handleScriptResponse(request);};
	
	if (request.transportIndicator)
	{								
	  if (request.url.indexOf("?"))
		request.url += "&" + AjaxTCR.comm.DEFAULT_TRANSPORT_HEADER + "=" + AjaxTCR.comm.DEFAULT_SCRIPT_TRANSPORT_VALUE;
	  else
		request.url += "?" + AjaxTCR.comm.DEFAULT_TRANSPORT_HEADER + "=" + AjaxTCR.comm.DEFAULT_SCRIPT_TRANSPORT_VALUE;
	}
										
	if (script.addEventListener)
		script.addEventListener("load", callback, false);
	else
	{
		script.onreadystatechange = function() 
		{
			if (this.readyState == "complete") 
				callback.call(this);
		};
	}
									
	script.src = request.url;
	script.type = "text/javascript";
	document.body.appendChild(script);
},
				

/** 
 * Private method that creates a request using the iframe transport.  
 * Updates the payload to pass the transport method, creates the iframe element.
 * Keeps the height at 1px and visiblity hidden.
 * Sets the callback and attaches it to the load events of the iframe
 * Simply sets the src for a GET and builds a form to submit for a POST
 * 
 * @private
 * @param {Object} request The request object that is being sent.
 */	
_sendIframe : function(request){
	var iframeID = AjaxTCR.util.misc.generateUID("AjaxTCRIframe_");
										
	/* IE does not handle document.createElement("iframe"); */
	if(window.ActiveXObject)
		var iframe = document.createElement('<iframe id="' + iframeID + '" name="' + iframeID + '" />');
	else
	{ 
 		var iframe = document.createElement("iframe");
		iframe.id = iframeID; 
	    iframe.name = iframeID;
	}
	
	iframe.style.height = "1px";
	iframe.style.visibility = "hidden";
	
	document.body.appendChild(iframe);
	
	var callback = function(){AjaxTCR.comm._handleIFrameResponse(request, iframe);};
		
	/* IE does not recognize iframe.onload */
	if(window.attachEvent)	
		iframe.attachEvent('onload', callback);
	else
		iframe.addEventListener('load', callback, false);
		
		
	if (request.hasFile)
	{
		request.serializeForm.target = iframe.id;
		request.serializeForm.submit();
	}
	else if (request.method.toUpperCase() == "GET")
	{
	  if (request.transportIndicator)
	   {
		if (request.url.indexOf("?") > -1)
			request.url += "&" + AjaxTCR.comm.DEFAULT_TRANSPORT_HEADER + "=" + AjaxTCR.comm.DEFAULT_IFRAME_TRANSPORT_VALUE;
		else
			request.url += "?" + AjaxTCR.comm.DEFAULT_TRANSPORT_HEADER + "=" + AjaxTCR.comm.DEFAULT_IFRAME_TRANSPORT_VALUE;
	   }
	   
		iframe.src = request.url;
	}
	else
	{
		var ifrForm = makeIframeForm(iframe, request);
   		ifrForm.submit();
	} 
	
	
	function makeIframeForm(ifr, request)
    {
   	   var url = request.url;
	   var payload = request.postBody;
	   
       var ifrDoc = null;
       var ifrWindow = ifr.contentWindow || ifr.contentDocument;
       if (ifrWindow.document)
           ifrDoc = ifrWindow.document;
       else
           ifrDoc = ifrWindow;

       if (!ifrDoc.body)
       {
           var html = ifrDoc.createElement("HTML");
           ifrDoc.appendChild(html);

           var head = ifrDoc.createElement("HEAD");
           html.appendChild(head);

           var body = ifrDoc.createElement("BODY");
           html.appendChild(body);
       }

       var ifrForm = ifrDoc.createElement("FORM");
       ifrForm.action = url;
       ifrForm.method = "post";
       ifrDoc.body.appendChild(ifrForm);
	   var keys = payload.split("&");

       for (var i=0;i<keys.length;i++)
       {
		   var nv = keys[i].split("=");
           var ifrText = ifrDoc.createElement("INPUT");
           ifrText.type = "text";
           ifrText.name = nv[0];
           ifrText.value = nv[1];
           ifrForm.appendChild(ifrText);
       }
	
	   if (request.transportIndicator)
	   {
	    var ifrText = ifrDoc.createElement("INPUT");
        ifrText.type = "text";
        ifrText.name = AjaxTCR.comm.DEFAULT_TRANSPORT_HEADER;
        ifrText.value = AjaxTCR.comm.DEFAULT_IFRAME_TRANSPORT_VALUE;
        ifrForm.appendChild(ifrText);
       }
	   
       return ifrForm;

	}
},
				
				

/** 
 * Private method that creates a request using the image/cookie transport.  
 * Updates the payload to pass the transport method, creates an image element and sets the onload callback and the src to the URL.
 * 
 * @private
 * @param {Object} request The request object that is being sent.
 */					
_sendImage : function(request){
	var callback = function(){AjaxTCR.comm._handleImageResponse(request);};
	
	if (request.transportIndicator)
	{
 	 if (request.url.indexOf("?"))
		request.url += "&" + AjaxTCR.comm.DEFAULT_TRANSPORT_HEADER +  "=" + AjaxTCR.comm.DEFAULT_IMAGE_TRANSPORT_VALUE;
	 else
		request.url += "?" + AjaxTCR.comm.DEFAULT_TRANSPORT_HEADER + "=" + AjaxTCR.comm.DEFAULT_IMAGE_TRANSPORT_VALUE;
	}
											
	var img = new Image();
    img.onload = callback; 
	img.src = request.url;
},								 

 /**
  * Private method called to init items that should be initialized no matter what communication technique is used.
  * Creates the statusIndicator and the progress timeout if they are used, updates startTime, requestOutstanding, and timespent.
  * 
  * @private
  *  @param {Object} request The request object that contains the options to  update.
  */
 
 _initSend : function(request){
	/* Set Progress Indicators */ 
	if (request.statusIndicator) 
		request.statusIndicator.element = AjaxTCR.comm._setProgressStatus(request.statusIndicator);					
	
	/* set the time spent in case this is a retry */
	request.timespent = 0;
	
	/* set progress indicator to show something nearly every second */
	if (request.showProgress && request.progressTimerID == null)
		 request.progressTimerID = window.setTimeout( function(){AjaxTCR.comm._progressRequest(request);}, request.progressInterval);
	
	/* Record start time of request */
	request.startTime = (new Date()).getTime();
	
	/* increment requests outstanding */
	AjaxTCR.comm._requestsOutstanding++;
	
},

/** 
 * fallbackOrError : If an XHR does not work, tries to send request using fallbackTransport
 * If transport is changed to script or image, ensures that the method is set to GET.
 * 
 * @private
 * @param  request
 */
 _fallbackOrError : function(request){
 	if (request.fallback)
	{
		request.transport = request.fallbackTransport.toLowerCase();
		if ((request.transport == "script" || request.transport == "image") && request.method.toUpperCase() == "POST")
		{
			request.method = "GET";  
			request.url = request.url + "?" + request.postBody;
			request.postBody = null;
		}	
		if (request.transport == "iframe")
        	AjaxTCR.comm._sendIframe(request);
   		else if (request.transport == "script")
      		AjaxTCR.comm._sendScript(request);
   		else if (request.transport == "image")
      		AjaxTCR.comm._sendImage(request);	
		else
			throw "AjaxTCR Error: Unknown fallback transport: " + request.transport;
	}
	else
		throw "AjaxTCR Error: XHR Creation failed and fallback is not enabled";
},								   

/**
 * Automatically called when the iframe completes loading.  
 * Updates httpStatus and httpStatusText and sets responseText and responseXML to contents of the body.
 * Calls general _handleResponse function on completion.
 * 
 * @private
 * @param {Object} response The response Object that contains all the settings for the request
 * @param {Object} iframe The iframe that was created in _sendIframe.
 */									   
_handleIFrameResponse : function(response, iframe){ 
	response.httpStatus = 200;
	response.httpStatusText = "OK";
	if (iframe.contentWindow.document.body)
		response.responseText = iframe.contentWindow.document.body.innerHTML;
	
	if (iframe.contentWindow.document.XMLDocument)
		response.responseXML = iframe.contentWindow.document.XMLDocument;
	else
		response.responseXML = iframe.contentWindow.document;
										
	AjaxTCR.comm._handleResponse(response);
},
												  
/**
 * Automatically called when the script completes loading.  
 * Updates httpStatus and httpStatusText
 * Sets responseText to "" and responseXML to null as the contents will already have been evaluated.
 * Calls general _handleResponse function on completion.
 * 
 * @private
 * @param {Object} response The response Object that contains all the settings for the request
 */													  
_handleScriptResponse : function(response){
	response.httpStatus = 200;
	response.httpStatusText = "OK";
	response.responseText = "";
	response.responseXML = null;
	AjaxTCR.comm._handleResponse(response);
},
 
/**
 * Automatically called when the image completes loading.  
 * Updates httpStatus and httpStatusText
 * Checks if the response.cookieName is set.  If so, looks it up and sets responseText to the value.
 * Sets responseXML to null
 * Calls general _handleResponse function on completion.
 * 
 * @private
 * @param {Object} response The response Object that contains all the settings for the request
 */	 
_handleImageResponse : function(response){
	response.httpStatus = 200;
	response.httpStatusText = "OK";
	if (response.cookieName)
		response.responseText = AjaxTCR.comm.cookie.get(response.cookieName);
	else
		response.responseText = document.cookie;	
	response.responseXML = null;
	AjaxTCR.comm._handleResponse(response);
},

 /**
  * Private method called if timeout period occurs without the response returning
  * calls abortRequest method to abort the requesst and clean up timers 
  * invokes any special timeout callback that may be defined.
  * Checks to see if we need to retry.
  * 
  *  @private
  *  @param {object} request The object that contains all the settings for the request
  */
 _timeoutRequest : function(request) { 
    /* make sure it is a proper time to abort */
    if (request.xhr.readyState != AjaxTCR.comm.DONE && request.xhr.readyState != AjaxTCR.comm.UNSENT)
    {
		/* abort the request */
		AjaxTCR.comm.abortRequest(request);
											
		/* Increment total timeouts */
		AjaxTCR.comm.stats._commResults.totalTimeouts++;
											
		/* do we need to retry? */
		if (request.retries)
		  AjaxTCR.comm._retryRequest(request); 	
		else  	  
		{
		  request.onTimeout(request);  /* invoke any timeout callback */
		  AjaxTCR.comm.queue._checkRequestQueue(request);
		}											
	 }
   },

/**
  * Private method called every request.progressInterval (default = 1 second) if showProgress is set.
  * Updates public timespent variable and invokes any special progress
  * callback that may be defined.  Resets the timer.
  * 
  *  @private
  *  @param {object} request The object that contains all the settings for the request
  */
_progressRequest: function(request){
	if (!request.abort && !request.received)
   	{
		request.timespent =  Math.round((request.timespent + (parseInt(request.progressInterval) / 1000)) * 1000) / 1000;
		request.onProgress(request);
		/* Yes it is ridiculous that we have to clear the timeout that we are in a callback for, but such is IE */
		clearTimeout(request.progressTimerID);
		request.progressTimerID = null;
		request.progressTimerID = window.setTimeout( function(){AjaxTCR.comm._progressRequest(request);}, request.progressInterval);
	}
   },

/** 
 * Updates retry count.  Checks to see if we should do another retry.  
 * If so, sends off the request and then calls the onRetry callback function.
 * If not, calls the onTimeout callback function and sends the next requesst if applicable.
 * 
 * @private
 * @param {Object} request The object that contains all the settings for the request
 */									 
_retryRequest : function (request) {
	 /* up our retry count */
	request.retryCount++; 	
										  
	/* make sure we aren't done retrying */
	if (request.retryCount <= request.retries)
	{
	  /* Increment total retries */
	  AjaxTCR.comm.stats._commResults.totalRetries++;
	  AjaxTCR.comm._makeRequest(request);
	  request.onRetry(request);
	}
	else /* stop trying and perform callback */
	{
	 request.onTimeout(request);
	 AjaxTCR.comm.queue._checkRequestQueue(request);
	}
 },
										 


/**
  * Private method called after response comes back no matter what method of communication
  * Updates endTime, totalTime, received, requestsOutstanding.  Clears any timers.
  * Caches, adds to history, clears status indicators, queues if applicable
  * 
  * @private
  * @param {object} response The object that contains all the settings for the request
  */								
_handleResponse : function(response){
	/* Record end time of request */
	response.endTime = (new Date()).getTime();
	response.totalTime = (response.endTime - response.startTime);
	
	/* set a received flag to ensure you don't perform a progress callback after received. */
	response.received = true;
	
	/* clear any timeouts */
	if (response.timeoutTimerID)
	{
	  clearTimeout(response.timeoutTimerID);
	  response.timeoutTimerID = null;
	}
			   
	/* clear our progress indicator */
	if (response.progressTimerID)
	{
	  clearTimeout(response.progressTimerID);
	  response.progressTimerID = null;
	}
	  
	/* decrement outstand request count */
	AjaxTCR.comm._requestsOutstanding--;
	
	/* Cache Response */
	if (!response.fromCache && response.cacheResponse && response.httpStatus == 200 && !response.fail)
		AjaxTCR.comm.cache.add(response.cacheKey, response.responseText);
	
	/* Cache Template */
	if (response.shortTermCacheTemplate && response.httpStatus == 200 && !response.fail)
		AjaxTCR.template.addToCache(response.url, response.responseText);
		
	if (response.history && response.history.saveResponse)
		AjaxTCR.history.addToHistory(response.history.id, "", response.history.title, "", response);
	
	/* Remove Progress Indicators */
	if (response.statusIndicator)
		AjaxTCR.comm._removeProgressStatus(response.statusIndicator);
		
	/* Check to see if we need to wait for another request */
	/* Otherwise just handle callbacks */
	if (response.enforceOrder)
	  AjaxTCR.comm.queue._handleQueue(response);
	else
	  AjaxTCR.comm._handleCallbacks(response);
	  
	/* If Request Queue is being used, send next request */
	AjaxTCR.comm.queue._checkRequestQueue(response);
									},
/**
  * Private method called after response comes in to run numerous callbacks.
  * Checks http and response status to see which callbacks should be employed.
  * Handles template situations as well as direct consumption with outputTarget
  * Communication is complete at the end of this call and the response object is nulled out.  
  * 
  * @private
  * @param {object} response The object that contains all the settings for the request
  */								 
_handleCallbacks : function(response) {
										 
	 /* clear inProgress flag */
 	 response.inProgress = false;
	 
	 /* Calculate Template Data if necessary */
	if (response.template &&  response.templateRender == "client")
	{
		var template = null;
		if (response.template != AjaxTCR.comm.TEMPLATE_SERVER_DEFINED)
		{
			template = AjaxTCR.template.getFromCache(response.template);
			if (!(response.cacheTemplate))
				AjaxTCR.template.removeFromCache(response.template);
		}
		else
		{
			var returnedObject = AjaxTCR.data.decodeJSON(response.responseText);
			if (returnedObject.templateURL && returnedObject.templateText)
			{
				template = returnedObject.templateText;
				if (response.cacheTemplate)
					AjaxTCR.template.addToCache(returnedObject.templateURL, returnedObject.templateText);
			}
			else if (returnedObject.templateText)
				template = returnedObject.templateText;	
			else if (returnedObject.templateURL)
			{
				var template = AjaxTCR.template.getFromCache(returnedObject.templateURL);
				if (!template)
				{
					var templateRequest = AjaxTCR.comm.sendRequest(returnedObject.templateURL, {async:false});
					var template = templateRequest.responseText;
					if (response.cacheTemplate && template)
						AjaxTCR.template.addToCache(returnedObject.templateURL, template);
				} 
			}				
		}
		
		if (template)
		{
			try{
				var translatedResponse = AjaxTCR.template.translateString(template, response.responseText);
				if (translatedResponse)
				{
					response.rawResponseText = response.responseText;
					response.responseText = translatedResponse;
				}
			}
			catch(e){}
		}
	}
	
	 /* Check if user wants to automatically consume output */
	 if (response.outputTarget && response.useRaw && (response.transport == "xhr" || response.transport == "iframe"))
	 {
		var outputTarget = response.outputTarget;
		if (outputTarget && typeof(outputTarget) == "string")
			outputTarget = document.getElementById(outputTarget);
	 
	 	if (response.fail)
			outputTarget.innerHTML = response.fail;
		else
		{
			var span = document.createElement("span");
			span.innerHTML = response.responseText;
			var newParent = span;
			
			switch(response.insertionType.toLowerCase())
			{
				case("insertbefore"):
					var parent = outputTarget.parentNode;
					parent.insertBefore(span, outputTarget);
				break;
				case("insertafter"):
					var parent = outputTarget.parentNode;
					AjaxTCR.util.DOM.insertAfter(parent, span, outputTarget);
				break;
				case("firstchild"):
					var elm = outputTarget.firstChild;
					while (elm != null && elm.nodeType != 1)
						elm = elm.nextSibling;
					
					if (elm != null)
						outputTarget.insertBefore(span, elm);
					else
						outputTarget.appendChild(span);
				break;
				case("lastchild"):
					outputTarget.appendChild(span);
				break;
				default:
					outputTarget.innerHTML = response.responseText;
					newParent = outputTarget;
						
				break;
				
			}
		}
	 }
		
	
	 /* check to see if the user wants a specific callback for this request */
	 if (response["on" + response.httpStatus] && !response.fail)
	 	response["on" + response.httpStatus](response);
	 
	 /* see if it is one of our retry statuses */
	 if (response.retries)
	 {
		for (var i=0;i<AjaxTCR.comm._networkErrorStatus.length;i++)
		{
			if (response.httpStatus == AjaxTCR.comm._networkErrorStatus[i])
			{
				AjaxTCR.comm._retryRequest(response);
				return;
			}
		}
	 }
	 
	/* call either success or fail callback */
	if (response.httpStatus == 200)
	{
		/*if they specified expected content type, we check for that.*/
		if (response.fail)
			AjaxTCR.comm._handleFail(response, response.fail);
	    else if (response.responseContentType && response.transport == "xhr")
	    {
			var responseContentType = response.xhr.getResponseHeader("Content-Type");
			responseContentType = responseContentType.substring(0, responseContentType.indexOf(";"));
			if (responseContentType != response.responseContentType)
	            AjaxTCR.comm._handleFail(response, "Wrong Content-Type: " + responseContentType );
			else if (response.responseContentType == "text/xml" && (response.responseXML == null || response.responseXML.childNodes.length == 0 || response.responseXML.childNodes[0].nodeName == "parsererror"))
				AjaxTCR.comm._handleFail(response, "Invalid XML Data");
			else
				AjaxTCR.comm._handleSuccess(response);
		}
		else		
			AjaxTCR.comm._handleSuccess(response);
	}
	else
	 	AjaxTCR.comm._handleFail(response, response.httpStatus + " " + response.httpStatusText);
	
	
	
	  
    /* clear out the response */
	response = null;
                               	      },
									  
 /**
  * Private method called upon request failure.  Updates the statistics object and calls the onFail callback.
  * 
  *  @private
  *  @param {object} response The object that contains all the settings for the request
  *  @param {string} message
  */
 _handleFail : function(response, message) {
	/* Increment total fails */
    AjaxTCR.comm.stats._commResults.totalFails++;
	response.fail = message;
	
	/* Save fail details */
	var fail = {};
	fail.url = response.url;
	fail.status = response.httpStatus;
	fail.message = message;
	AjaxTCR.comm.stats._commResults.requestFails.push(fail);
	
	response.onFail(response, message);
},
   
/**
  * Private method to handle success responses  Updates the statistics log and then calls the proper success callback.
  *  
  * @private
  * @param {Object} response The object that contains all the settings for the request 
  */
 _handleSuccess : function(response) {
	/* Increment total success */
	AjaxTCR.comm.stats._commResults.totalSuccesses++;
	if (response.isPrefetch)
		response.onPrefetch(response);
	else
		response.onSuccess(response);
},
 
 /**
  * Private method to check for response status, clear any timeouts and invoke callbacks for given readyState.
  * In readyState == 4, Checks signature if response is supposed to be signed before handling any data.
  * Sets the httpStatus, status, responseText, and responseXML objects
  * 
  *  @private 
  *  @param {Object} response The object that contains all the settings for the request
  */
 _handleReadyStateChange : function(response) { 	
	/* check if abort flag is set, if so bail out */	
	if (response.abort)
	   return; 
										 
	 /* Check each readyState */
	if (response.xhr.readyState == AjaxTCR.comm.OPEN && response.onOpen)
		 response.onOpen(response);
    else if (response.xhr.readyState == AjaxTCR.comm.SENT && response.onSent)
		 response.onSent(response);
	else if (response.xhr.readyState == AjaxTCR.comm.LOADING && response.onLoading)
		 response.onLoading(response);
    else if (response.xhr.readyState == AjaxTCR.comm.DONE) 
	{
		if (response.signedResponse)
		{
			var signature = response.xhr.getResponseHeader("Content-MD5");
			var verifySignature = AjaxTCR.data.encodeMD5(response.xhr.responseText);
			if (signature != verifySignature)
				response.fail = "Response Packet Compromised.";
		}
		
		if (response.onReceived && !response.fail)
			response.onReceived(response);
		
		/* Danger: Firefox problems so we try-catch here */
	 	try { response.httpStatus = response.xhr.status; response.httpStatusText = response.xhr.statusText} catch(e) {response.httpStatus=3507;response.httpStatusText="Unknown Loss";}
		response.responseText = response.xhr.responseText;
		response.responseXML = response.xhr.responseXML;
		
		AjaxTCR.comm._handleResponse(response);
	}
},


/**
 * Creates the status indicator for the page based on the settings passed in.
 * 
 * @private 
 * @param {object} statusIndicator  the status object
 * @config {object} target The DOM reference of the place to put the indicator
 * @config {string} type Either text or image.  The Type of indicator to use
 * @config {string} text In the case of text, this is the message to put into the indicator
 * @config {integer} border In the case of image, this is the border for the image
 * @config {string} imgSrc In the case of image, this is the src of the image to use.
 */
_setStatus : function(statusIndicator){
	if (statusIndicator.target)
	{
		if (typeof(statusIndicator.target) == "string")
			statusIndicator.target = document.getElementById(statusIndicator.target);
				
	    if (statusIndicator.type == "text")
	    {
	        var statusDiv = document.createElement("div");
	        statusDiv.innerHTML = statusIndicator.text;
	        statusIndicator.target.appendChild(statusDiv);
			statusIndicator.element = statusDiv;
	    }
	    else if (statusIndicator.type == "image")
	    {
	        var statusImg = document.createElement("img");
	        statusImg.id = "progressBar";
			if (statusIndicator.border)
	        	statusImg.border=statusIndicator.border;
	        statusImg.src = statusIndicator.imgSrc;
	        statusIndicator.target.appendChild(statusImg);
			statusIndicator.element = statusImg;
	    }
	 }	
},
							
/**
 * sets status based on the statusIndicator.progress object
 * 
 * @private 
 * @param  statusIndicator - the status object
 */		
_setProgressStatus : function(statusIndicator){
	if (statusIndicator.progress)
		return AjaxTCR.comm._setStatus(statusIndicator.progress);	
},

/**
 * removes the pased in  status object
 * 
 * @private 
 * @param  statusIndicator - the status object to remove
 */		
_removeStatus : function(statusIndicator){
	if (statusIndicator.element)
	{
		statusIndicator.element.parentNode.removeChild(statusIndicator.element);
		statusIndicator.element = null;
	}
},

/**
 * removes the status set by the statusIndicator.progress object
 * 
 * @private 
 * @param  statusIndicator - the status object
 */		
_removeProgressStatus : function (statusIndicator){
	if (statusIndicator.progress)
		AjaxTCR.comm._removeStatus(statusIndicator.progress);
}

};

/*************************************  AjaxTCR.comm.cache *****************************/
/**
 * The caching class of the library.  Is called directly from AjaxTCR.comm, but can also be called by the user.
 * 
 * @class AjaxTCR.comm.cache
 * @static
 */
AjaxTCR.comm.cache = {

/****************************************** Private Properties ****************************************************/

/** The cache object.  
 * @private
 */
_cache : new Array(),

/** Caching Options w/defaults set 
 * @private
 */
_cacheOptions : {
	/* The max number of items to store in the cache */
	size : 100,
	/* The default algorithm for removing items.  The choices are LRU, FIFO, and LFU */
	algorithm: "LRU",
	/* The default number of minutes an item can stay in the cache.  Set to -1 for forever */
	expires: 60
},

/*************************************  Public Cache Methods *****************************/
	
/**
 * Adds a key/value pair to the cache.  Removes any itmes first if necessary.
 * 
 * @param {string} key The key to reference the stored object
 * @param {object} val The value to save
 */		
add : function(key, val){
	if (AjaxTCR.comm.cache._cache.length >= AjaxTCR.comm.cache._cacheOptions.size)
	{
		var algorithm = AjaxTCR.comm.cache._cacheOptions.algorithm;
		//we need to remove an item before adding another one.
		if ( algorithm == "FIFO")
			AjaxTCR.comm.cache._cache.splice(0, 1);
		else if (algorithm == "LFU")
		{
			var removeIndex = -1;
			for (var i=0;i<AjaxTCR.comm.cache._cache.length;i++)
			{
				if (removeIndex == -1 || AjaxTCR.comm.cache._cache[removeIndex].totalAccessed > AjaxTCR.comm.cache._cache[i].totalAccessed)
					removeIndex = i;
			}
			
			AjaxTCR.comm.cache._cache.splice(removeIndex,1);
		}
		else if (algorithm == "LRU")
		{
			var removeIndex = -1;
			for (var i=0;i<AjaxTCR.comm.cache._cache.length;i++)
			{
				if (removeIndex == -1 || AjaxTCR.comm.cache._cache[removeIndex].lastAccessed > AjaxTCR.comm.cache._cache[i].lastAccessed)
					removeIndex = i;
			}
			
			AjaxTCR.comm.cache._cache.splice(removeIndex,1);
		}
	} 

	var item = AjaxTCR.comm.cache._createCacheItem(key, val);
	AjaxTCR.comm.cache._cache.push(item);
},

/**
 * Public method that resets the caches
 * 
 */		
clear : function(){
	AjaxTCR.comm.cache._cache = new Array();
},

/**
 * Public method to fetch an object based on the key.  Checks to see if the object has expired before returning it.
 * 
 * @param {string} key The key to reference the stored object
 * @return {object} The stored value
 * 
 */	
get: function(key){
	var cacheObject = null;
	/* Search for item */
	for (var i=0;i<AjaxTCR.comm.cache._cache.length;i++)
	{
		if (AjaxTCR.comm.cache._cache[i].key == key)
		{
			cacheObject = AjaxTCR.comm.cache._cache[i];
			break;
		}
	}
	
	if (cacheObject)
	{
		/* Update the properties */
		cacheObject.lastAccessed = new Date();
		cacheObject.totalAccessed++;
		
		/* Ensure it hasn't expired */
		if (AjaxTCR.comm.cache._cacheOptions.expires != -1)
		{
			var timeAdded = cacheObject.added;
			var now = new Date();
			now.setMinutes(now.getMinutes() - AjaxTCR.comm.cache._cacheOptions.expires);
			if (now > timeAdded)
			{
				AjaxTCR.comm.cache.remove(key);
				cacheObject = null;
			}			
		}
	}
	
	if (cacheObject)
		return cacheObject.value;
	else 
		return null;
},

												  
/**
 * Returns the entire cache
 * 
 * @return {object} The cache Object
 */
getAll : function(){ 
	return AjaxTCR.comm.cache._cache;
},

/**
 * Returns the number of items currently in the cache
 * 
 * @return {integer} The number of items in the cache
 */
getSize : function(){ 
	return AjaxTCR.comm.cache._cache.length;
},

/**
 * Removes an item from the cache based on the key passed in
 * 
 * @param {string} key The key to reference the item to remove.
 */	
remove : function(key){
	for (var i=0;i<AjaxTCR.comm.cache._cache.length;i++)
	{
		if (AjaxTCR.comm.cache._cache[i].key == key)
		{
			AjaxTCR.comm.cache._cache.splice(i,1);
			break;
		}
	}
},


/** 
 * Changes the default options for the caching mechanism
 * @param {Object} the options to set
 * @config {integer} size The number of items to store in the cache  Default is 100
 * @config {string} algorithm The algorithm to use to decide which item should be removed next.  
 * Options are LRU (Least Recently Used), FIFO (First In First Out), and LFU(Least Frequently Used)  Default is LRU
 * @config {integer} expires The number of minutes an item can stay in the cache.  Default is 60.  Use -1 to set forever.
 */
setOptions : function(cacheOptions){
	/* apply options defined by user */
    for (option in cacheOptions)
    	AjaxTCR.comm.cache._cacheOptions[option] = cacheOptions[option];
 },
 
								

/*************************************  Private Cache Methods *****************************/

/**
 * When a page is returned from the cache, this method is called to initialize values
 * so that the handlResponse function will work properly.
 * 
 * @private
 * @param {Object} response The object that contains all the settings for the request
 * @param {Object} responseText The value stored in the cache
 */
_handleCacheResponse : function(response, responseText){
	response.xhr = {};
	response.xhr.responseText = response.responseText = responseText;
	response.xhr.responseXML = response.responseXML = null;
	if (responseText.indexOf("<?xml") > -1)
		response.xhr.responseXML = response.responseXML = AjaxTCR.data.serializeXMLString(responseText);
	
	response.xhr.status = response.httpStatus = 200; 
	response.xhr.statusText = response.httpStatusText = "OK";
	
	response.fromCache = true;
	AjaxTCR.comm._handleResponse(response);
},


/**
 * createCacheItem - Private method that creates a cache object based on the given key and val
 * 
 * @private 
 * @param {string} key The key to set cacheObject.key to
 * @param {object} val The value to set cacheObject.value to
 * @return {object} The cacheObject
 */								
_createCacheItem : function(key, val){
	var cacheObject = {};
	cacheObject.key = key;
	cacheObject.value = val;
	cacheObject.lastAccessed = new Date();
	cacheObject.added = new Date();
	cacheObject.totalAccessed = 1;
	return cacheObject;
}


};

/*************************************  AjaxTCR.comm.queue *****************************/
/**
 * The queuing class of the library.  Is called directly from AjaxTCR.comm.
 * 
 * @class AjaxTCR.comm.queue
 * @static
 */
AjaxTCR.comm.queue = {

/****************************************** Private Properties ****************************************************/

/** The responseQueue Object 
 * @private
 */ 
 _responseQueue : {  queue: new Array(), currentIndex: 0, maxID: 0},
 
 /** The requestQueue Array 
 * @private
 */  
 _requestQueue : new Array(),
 
 /** The requestQueue counter  
 * @private
 */ 
 _requestQueueID: 0,
 
 /** The number of active requests to send out when using request Queue */
 requestQueueConcurrentRequests : 1,
 
/****************************************** Public Queue Methods ****************************************************/
									 
/**
 * Public method to add a request to the request queue.  
 * If the request limit isn't being met yet, the request is sent right away, otherwise, it gets added to the queue.
 * If the priority is set and not to "normal", it places the new 
 * request at the proper place.  Otherwise, it inserts it at the end of the queue.
 * 
 * @param {string} url - the url to add to the request queue
 * @param {object} options - the options object to send to sendRequest
 * @param {string} [priority] - the priority level of the entry - Choices are "normal", "next", and "faster"
 * @return {integer} The requestQueueid of the request  
 */
add : function(url, options, priority) { 
	if (options)
		options.inQueue = true;
	else 
		options = {inQueue:true};
										
	if (!priority)
		options.priority = "normal";
	else
		options.priority = priority.toLowerCase();
		
	/* Add Id */
	options.requestQueueID = ++AjaxTCR.comm.queue._requestQueueID;
		
	/* See if we should send it or add it to the queue */			
	if (AjaxTCR.comm.stats.getRequestCount("active") >=  AjaxTCR.comm.queue.requestQueueConcurrentRequests)
	{	
		var request = {url: url, options: options};
		if (options.priority == "next")
			AjaxTCR.comm.queue._requestQueue.unshift(request);
		else if (priority && priority == "faster")
		{
			var set = false;
			for (var i=0;i<AjaxTCR.comm.queue._requestQueue.length;i++)
			{
				if (AjaxTCR.comm.queue._requestQueue[i].options.priority == "normal")
				{
					AjaxTCR.comm.queue._requestQueue.splice(i, 0, request);
					set = true;
					break;
				}
			}
			/* If nothing is normal, add to the end */
			if (!set)
				AjaxTCR.comm.queue._requestQueue.push(request);
		}
		else
			AjaxTCR.comm.queue._requestQueue.push(request);
	}
	else
		AjaxTCR.comm.sendRequest(url, options);
		
	return options.requestQueueID;
},	 

/**
 * A public method that clears out the request queue of any pending requests 
 * 
 */										   
clear: function()	{ 
	AjaxTCR.comm.queue._requestQueue.length = 0; 
},

/**
 * Returns the item from the queue  
 * 
 * @param {integer} ID - ID of request to return
 * @return  {object} The object that is stored in the queue
 * 
 */										   
get : function(ID)	{ 
	for (var i=0;i<AjaxTCR.comm.queue._requestQueue.length;i++)
	{
		if ( AjaxTCR.comm.queue._requestQueue[i].options.requestQueueID == ID)
			return AjaxTCR.comm.queue._requestQueue[i];
	}
	
	return null;
},	  
	
/**
 * Returns the whole request queue
 * 
 * @return {object} the request queue
 */								
getAll : function(){
	return AjaxTCR.comm.queue._requestQueue;
},
	
/**
 * Returns the position in the queue of the passed in ID.  
 * 
 *  @param ID - ID of request that you wish to check
 *  @return {integer} Returns -1 if not in queue.  Otherwise returns th location in the queue.  Starts at 0.
 * 
 */										   
getPosition : function(ID)	{ 
	for (var i=0;i<AjaxTCR.comm.queue._requestQueue.length;i++)
	{
		if ( AjaxTCR.comm.queue._requestQueue[i].options.requestQueueID == ID)
			return i;
	}
	
	return -1;
},	  
	
/**
 * Returns the length request queue
 * 
 * @return {integer} the request queue length
 */								
getSize : function(){
	return AjaxTCR.comm.queue._requestQueue.length;
},
	
/**
 * Removes the option with the given requestQueueID from the request Queue
 * 
 *  @param {integer{ ID  ID of request to be removed from queue
 * 
 */										   
remove : function(ID)	{ 
	for (var i=0;i<AjaxTCR.comm.queue._requestQueue.length;i++)
	{
		if ( AjaxTCR.comm.queue._requestQueue[i].options.requestQueueID == ID)
		{
			var ret = AjaxTCR.comm.queue._requestQueue[i];
			AjaxTCR.comm.queue._requestQueue.splice(i, 1);
			return ret;
		}
	}
	
	return false;
},		
									
								   
/****************************************** Private Queue Methods ****************************************************/									   

/**
 * A private method that looks to see if a request queue is in use and sends the next
 * request off for processing if there is one
 * 
 * @private 
 * @param {object} response The object that contains all the settings for the request
 * 
 */									   
_checkRequestQueue : function(response){
	/* If Request Queue is being used, send next request */
	if (response.inQueue && AjaxTCR.comm.queue._requestQueue.length > 0)
	{		
		var nextRequest = AjaxTCR.comm.queue._requestQueue.shift();
		AjaxTCR.comm.sendRequest(nextRequest.url, nextRequest.options);
	}
},
							
/**
  * Private method called after response comes in if request is in the response queue.
  * Adds response to response queue and then calls callbacks for any that are able to move forward
  * 
  * @param {object} response The object that contains all the settings for the request
  */
 									 
_handleQueue: function(response){
	/* add response into queue */
	AjaxTCR.comm.queue._responseQueue.queue[response.responseQueueID] = response;
									
	/* loop thru queue handling any received requests up to current point  */
	while (AjaxTCR.comm.queue._responseQueue.queue[AjaxTCR.comm.queue._responseQueue.currentIndex] != undefined)
	{
	  AjaxTCR.comm._handleCallbacks(AjaxTCR.comm.queue._responseQueue.queue[AjaxTCR.comm.queue._responseQueue.currentIndex]);
	  AjaxTCR.comm.queue._responseQueue.currentIndex++;
	}
}


};

/*************************************  AjaxTCR.comm.stats *****************************/
/**
 * The statistics class of the library.  Collects statistics regarding total requests, timeouts, retries, successes, and failures
 * Can serialize and send this data to your server.
 * 
 * @class AjaxTCR.comm.stats
 * @static
 */
AjaxTCR.comm.stats = {

 /** stats object to hold results
  * @private
  * @config {integer} totalRequests
  * @config {integer} totalTimeouts 
  * @config {integer} totalRetries
  * @config {integer} totalSuccesses
  * @config {integer} totalFails
  * @config {array} requestFails
  */
 _commResults : {
 totalRequests : 0,
 totalTimeouts : 0,
 totalRetries : 0,
 totalSuccesses : 0,
 totalFails : 0,
 requestFails : new Array()},
 

/**
 * Sets up system to send results to the passed in URL on page unload.  It passes them as a POST with an application/json body.
 * 
 * @param {Object} url URL to send the results to
 */ 
collect : function (url)	{
	var sendConnectionStats = function(){
		var results = AjaxTCR.comm.stats.get();
		if (results.totalRequests > 0)
		{
			var payload = AjaxTCR.data.encodeJSON(results);
			AjaxTCR.comm.sendRequest(url, {method:"POST",payload:payload,requestContentType:"application/json",oneway:true});
		}
	};
	
	if(window.attachEvent)	
 		window.attachEvent('onunload', sendConnectionStats);
 	else
		window.addEventListener('unload', sendConnectionStats, false);

},
										
/**
 * Returns the whole statistics object
 * 
 * @return {object} the statistics object
 */										
get : function()	{
	return AjaxTCR.comm.stats._commResults;
},


/**
 * Public method acting as simple getter for the count of requests currently out
 * 
 * @param {string} type The type of requests that you want the count on.  Options are "queued", "active", and "all"
 * @return - the number of outstanding requests
 */
getRequestCount : function(type) { 
	if (type == "queued")
		return AjaxTCR.comm.queue.getSize();
	else if (type == "active")
		return AjaxTCR.comm._requestsOutstanding;
	else	
		return (AjaxTCR.comm.queue.getSize() + AjaxTCR.comm._requestsOutstanding); 
}


};

/*************************************  AjaxTCR.comm.cookie *****************************/
/**
 * The cookie class of the library.  Allows setting and retrieving of cookies
 * 
 * @class AjaxTCR.comm.cookie
 * @static
 */
AjaxTCR.comm.cookie = {

/**
 * Gets the value of a cookie with the given name.
 * 
 * @param {String} name The name of the cookie to find
 * @return {String} The value of the specified cookie
 */
get : function(name){
	var fullname = name + "=";
	var cookies = document.cookie.split(';');
	for(var i=0;i < cookies.length;i++)
	{
		var cookieNV = cookies[i];
	    while (cookieNV.charAt(0)==' ') 
											cookieNV = cookieNV.substring(1);
	    if (cookieNV.indexOf(fullname) == 0) 
											return cookieNV.substring(fullname.length);
	}
	return null;
},

/**
 * Create a cookie using document.cookie
 * 
 * @param {string} key  The cookie name
 * @param {string} value The cookie value
 * @param {string} expires The date of expiration.  If not set, the cookie expires when the browser is closed.
 * @param {string} [path] The path to store the cookie.  If not set, it is stored at "/"
 */
set: function(key, value, expires, path){

	if (!path)
		path = "/";
	
	document.cookie = key+"="+value+"; expires=" + expires +"; path=" + path;
	
},

/**
 * Removes the cookie specified by key.
 * @param {Object} key The name of the cookie to remove
 * @param {Object} [path] The path where the cookie is stored.  If not set, it checks "/"
 */
remove: function(key, path){

	if (!path)
		path = "/";
		
	var now = new Date();
	now.setYear(now.getYear()-1);
	var expires = now.toGMTString(); 
	document.cookie = key+"=; expires=" + expires +"; path=" + path;

}

};

/*************************************  AjaxTCR.history *****************************/
/**
 * The history class of the library.  History is called directly from communications, but can also be called by the user.
 * If history is going to be used, you must call AjaxTCR.history.init() before  usage.
 * 
 * @class AjaxTCR.history
 * @static
 */
AjaxTCR.history = {

/** contstants
 * @private
 */
BACK_GUARD_DISABLED : 0,
BACK_GUARD_INITIALIZED : 1,
BACK_GUARD_ENABLED : 2,

/** Current State of application 
 * @private
 */
_currentState : "",

/** function to call on statechange callback.  Specifed in init()
 * @private
 */
_onStateChangeCallback : function(){},

/** html file that iframe points to.  Does not need any contents, but does need to exist 
 * @private
 */
_iframeSrc : "blank.html",

/** Boolean indicated whether to handle history 
 * @private
 */
_historyEnabled : false,

/** The history array 
 * @private
 */
_history : new Array(),

/** The current position in the history array 
 * @private
 */
_historyPosition : 0,

/** Boolean indicated if library should warn on page unload
 * @private
 */
_backGuardEnabled: 0,

/** Message to alert when warning on page unload 
 * @private
 */
_backGuardMessage: "Are you sure you wish to end your session?",

/**
 * Function that must be called before using the history mechanics.
 * It sets historyEnabled to true, sets the callback function,
 * sets up the timers to check for history change
 * and checks to see if the initial state is a bookmark
 * 
 * @param {function} onStateChangeCallback The function to call if there is a state change outside of the XHR call  
 * @param {Object} initState The data to pass back to the callback function
 */
init : function(onStateChangeCallback, initState){
	if (AjaxTCR.history._historyEnabled)
		return;
	else
		AjaxTCR.history._historyEnabled = true;
		
		
	AjaxTCR.history._onStateChangeCallback = onStateChangeCallback;
	
	if(!(navigator.userAgent.toLowerCase().indexOf("msie")>-1))
		AjaxTCR.history._checkHash();
	else 
		AjaxTCR.history._checkHashIE();
		
	if (!window.location.hash)
		AjaxTCR.history.addToHistory("AjaxTCRinit", initState, document.title);
	else if ((navigator.userAgent.toLowerCase().indexOf("msie")>-1))
		AjaxTCR.history._initIE();
	
},
  
/**
 * Adds an item to the browser history.  Saves the title, position in history, and the data for later retrieval.
 *  
 * @param {string}  id  the key to store the history item under
 * @param {object} data  the data field to be returned to the callback function.  
 * @param {title}  [title]  the title to change the page to
 * @param {string} [url]  the url to request when page reloads.  
 * @param {object}  [options]  the options for the request
 */
addToHistory : function(id, data, title, url, options){

	if (id != "AjaxTCRinit")
	{
		window.location.hash =AjaxTCR.data.encodeValue(id).replace(/%2F/g, '/');;
		AjaxTCR.history._currentState = window.location.hash.substring(1);
	}
	
	var optionsString = "";
	var safeStateName = id.replace(/[%\+]/g, "");
	
	if (title)
		document.title = title;
		
	if (options)
	{
		options.url = url;
		if (navigator.userAgent.toLowerCase().indexOf("msie")>-1)
			options.responseXML = "iebug";
		
		optionsString = AjaxTCR.data.encode64(AjaxTCR.data.encodeJSON(options));
	}
	else if (data)
	{
		options = {value: data};
		optionsString = AjaxTCR.data.encode64(AjaxTCR.data.encodeJSON(options));
	}
	
	//update position
	AjaxTCR.history._historyPosition++;
	
	if(navigator.userAgent.toLowerCase().indexOf("msie")>-1)
	{
		var iframe = document.getElementById("ieFix");
		var html = '<html><head><title>IE History</title><STYLE>.userData {behavior:url(#default#userdata);}</STYLE></head><body><div class="userData" id="persistDiv"></div><div id="currentState">' + AjaxTCR.history._currentState + '</div></body></html>';
		var doc = iframe.contentWindow.document;
		doc.open();
		doc.write(html);
		doc.close();
		
		var persistDiv = doc.getElementById("persistDiv");
		AjaxTCR.storage.add("request", optionsString, persistDiv, safeStateName);
		if (title) 
			AjaxTCR.storage.add("title", title, persistDiv, safeStateName);
		AjaxTCR.storage.add("position", AjaxTCR.history._historyPosition, persistDiv, safeStateName);
	}	
	else if (safeStateName)
	{
		AjaxTCR.storage.add(safeStateName, optionsString);
		if (title)
			AjaxTCR.storage.add(safeStateName + "title", title);
		AjaxTCR.storage.add(safeStateName + "position", AjaxTCR.history._historyPosition);
	}
	
	/* Finally push onto history stack */
	var historyItem = {id: AjaxTCR.history._currentState, title: title};
	var diff = AjaxTCR.history._history.length - AjaxTCR.history._historyPosition + 1;
	if (diff > 0)
		AjaxTCR.history._history.splice(AjaxTCR.history._historyPosition-1,diff); 
		
	AjaxTCR.history._history.push(historyItem);
},	

/**
 * Returns the entire history array
 * @return {array} The history array
 */
getAll : function(){
	return AjaxTCR.history._history;
},

/**
 * Returns the current position in the history stack
 * @return {integer} The current position in the history stack
 */
getPosition : function(){
	return AjaxTCR.history._historyPosition;
},

/**
 * Sets up the system that will alert the user when they leave the page that they are leaving the application
 * 
 * @param {string} [message] The message to alert the user
 * @param {Boolean} [immediate] If set to true, it immediately sets up the system.  Otherwise, it sets it up on first sendRequest call.
 */
enableBackGuard: function(message, immediate){
	if (AjaxTCR.history._backGuardEnabled)
		return;
	
	if (message != null && typeof(message) != "undefined")
		AjaxTCR.history._backGuardMessage = message;
		
	if (immediate)
		AjaxTCR.history._activateBackGuard();
	else
		AjaxTCR.history._backGuardEnabled = AjaxTCR.history.BACK_GUARD_INITIALIZED;
		
},

/**
 * Sets the onbeforeunload handler to alert when the user tries to leave the page
 * @private
 */
_activateBackGuard: function(){
	var message = AjaxTCR.history._backGuardMessage;
	window.onbeforeunload = function () {return message;}
	AjaxTCR.history._backGuardEnabled = AjaxTCR.history.BACK_GUARD_ENABLED;
},

/**
 * Creates html page to write to the iframe in the case of IE
 * 
 * @private 
 */
_initIE: function(){
	var iframe = document.getElementById("ieFix");
	var html = '<html><head><title>IE History</title><STYLE>.userData {behavior:url(#default#userdata);}</STYLE></head><body><div class="userData" id="persistDiv"></div><div id="currentState">' + window.location.hash.substring(1); + '</div></body></html>';
	var doc = iframe.contentWindow.document;
	doc.open();
	doc.write(html);
	doc.close();
},
									  

/**
 * Checks to see if the state that is set in the IE Iframe matches the current state as set in the library.  If they are not a match,
 * update the state of the page
 * 
 * @private
 */
_checkHashIE : function (){
	var iframe = document.getElementById("ieFix");
	if ( !iframe.contentWindow || !iframe.contentWindow.document ) 
	{
       setTimeout( _checkHashIE, 10 );
       return;
    }

	var doc = iframe.contentWindow.document;
	var keyObj = doc.getElementById("currentState");
	var key = "";
	if (keyObj)
		key = keyObj.innerText;
		
	if (key != AjaxTCR.history._currentState)
  	{
		AjaxTCR.history._currentState = key;
    	window.location.hash = key;
		
		var persistDiv = doc.getElementById("persistDiv");
		var safeStateName = AjaxTCR.history._currentState.replace(/[%\+]/g, "");
		if (!safeStateName)
			safeStateName = "AjaxTCRinit";
		
		var title =  AjaxTCR.storage.get("title", persistDiv, safeStateName);
		if (title) 
			document.title = title;
		
		AjaxTCR.history._historyPosition =  AjaxTCR.storage.get("position", persistDiv, safeStateName);	
		//check for bookmarked history position
		if (AjaxTCR.history._historyPosition > AjaxTCR.history._history.length)
		{
			AjaxTCR.history._historyPosition = 1;
			AjaxTCR.storage.add("position", AjaxTCR.history._historyPosition, persistDiv, safeStateName);
			var historyItem = {id: AjaxTCR.history._currentState, title: title};
			AjaxTCR.history._history.push(historyItem);
		}
		
		var optionsString = AjaxTCR.storage.get("request", persistDiv, safeStateName);
		AjaxTCR.history._handleHistoryCallback(optionsString);
			
  	}
	setTimeout("AjaxTCR.history._checkHashIE();", 500);
}, 

/**
 * Checks to see if the current window.location.hash value matches the value saved in the currentState.
 * If they do not match, update the state of the page.
 * 
 * @private 
 */							
_checkHash : function ()	{
	if ((window.location.hash != "#" + AjaxTCR.history._currentState) && window.location.hash != AjaxTCR.history._currentState)
    {
        AjaxTCR.history._currentState = window.location.hash.substring(1);
		var safeStateName = AjaxTCR.history._currentState.replace(/[%\+]/g, "");
		if (!safeStateName)
			safeStateName = "AjaxTCRinit";
		
		var title = AjaxTCR.storage.get(safeStateName + "title");
		if (title)
			document.title = title.value;

	
		AjaxTCR.history._historyPosition = AjaxTCR.storage.get(safeStateName + "position").value;
		//check for bookmarked history position
		if (AjaxTCR.history._historyPosition > AjaxTCR.history._history.length)
		{
			AjaxTCR.history._historyPosition = 1;
			AjaxTCR.storage.add(safeStateName + "position", AjaxTCR.history._historyPosition);
			var historyItem = {id: AjaxTCR.history._currentState, title: title};
			AjaxTCR.history._history.push(historyItem);
		}
		
		var results = AjaxTCR.storage.get(safeStateName);
		if (results)
			AjaxTCR.history._handleHistoryCallback(results.value);
		else
        	AjaxTCR.history._onStateChangeCallback(AjaxTCR.data.decodeValue(AjaxTCR.history._currentState));
					
    }
	setTimeout("AjaxTCR.history._checkHash();", 500);
},

/**
 * If the state on the page changes, this function is called to figure out how to restore the state of the new location.
 * Check the stored data and see if we need to call sendRequest/handleCacheResponse or if we need to call the callback function specified by the user in init.
 * 
 * @private 
 * @param {string} String value containing the JSON data that was saved on addToHistory
 */						
_handleHistoryCallback : function(optionsString){
	if (optionsString && optionsString != "")
	{
		var str = AjaxTCR.data.decode64(optionsString);
		var options = AjaxTCR.data.decodeJSON(AjaxTCR.data.decode64(optionsString));
		if (options.history)
		{
			if (options.history.saveResponse)
			{
				options.history = null;
				AjaxTCR.comm.cache._handleCacheResponse(options, options.responseText);
			}
			else
			{
				options.history = null;
				AjaxTCR.comm.sendRequest(options.url, options);
			}
		}
		else
			AjaxTCR.history._onStateChangeCallback(AjaxTCR.data.decodeValue(AjaxTCR.history._currentState), options.value);
	}
	else
		AjaxTCR.history._onStateChangeCallback(AjaxTCR.data.decodeValue(AjaxTCR.history._currentState));
	
}

};


/*********************************************  Storage Methods *********************************************/
/**
 * The storage class of the library.  Storage is called directly from history, but can also be called by the user.
 * If storage is going to be used, you must call AjaxTCR.storage.init() before  usage.
 * The types of storage supported are IE Behaviors, WHATWG globalStorage, and cookies
 * 
 * @class AjaxTCR.storage
 * @static
 */
AjaxTCR.storage = {
/** The max size to store in cookies */
DEFAULT_MAX_COOKIE_SIZE: 4000,

/**
 * Method must be called before using storage.  The returned value must be passed to all future storage requests
 * 
 *  @returns {object} The newly created persitent Div object
 */
init : function(){

	if (navigator.userAgent.toLowerCase().indexOf("msie")>-1 )
	{
		var persistDiv = document.createElement("div");
		persistDiv.id = "AjaxTCRPersistDiv";
		persistDiv.style.behavior = "url(#default#userData)";
		document.body.appendChild(persistDiv);
		return persistDiv;
	}
	return null;
},

/**
 * Adds an item to storage.  Checks the browser support and chooses an appropriate method. 
 * 
 * @param {String} key The key to reference the stored string
 * @param {String} value The string to store in persistent data
 * @param {Object} persistObj The persistent Object returned from init
 * @param {string} [store] Optional value to name the store to save the data.  Only applicable in IE
 */
add : function(key, value, persistObj, store){
	var setFlag = 0;
	if(navigator.userAgent.toLowerCase().indexOf("msie")>-1 )
	{
		if (!store)
			store = "AjaxTCRStore";
		
		if (persistObj)
		{
			var allitemsString = AjaxTCR.storage.get("AjaxTCRAllItems", persistObj, store);
			if (!allitemsString)
				var allitemsObj = {};
			else
				var allitemsObj = AjaxTCR.data.decodeJSON(allitemsString);
			
			allitemsObj[key] = value;
			allitemsString = AjaxTCR.data.encodeJSON(allitemsObj);
			persistObj.setAttribute("AjaxTCRAllItems",allitemsString);
			persistObj.setAttribute(key,value);
			persistObj.save(store);
			
			setFlag = 1;
		}
	}	
	else if (typeof(globalStorage) != "undefined")
	{
		try{
			var storage = globalStorage[document.domain];
			storage.setItem(key, value);
			setFlag = 1;
		}
		catch(e){}
	}
	
	if (!setFlag)
	{
		/* Update all records */
		var allitemsString = AjaxTCR.storage.get("AjaxTCRAllItems");
		if (!allitemsString)
			var allitemsObj = new Array();
		else
			var allitemsObj = AjaxTCR.data.decodeJSON(allitemsString);
			
		allitemsObj.push(key);
		allitemsString = AjaxTCR.data.encodeJSON(allitemsObj);
		var now = new Date();
		now.setMonth(now.getMonth()+1);
		var expires = now.toGMTString(); 
		var pieces = Math.floor(allitemsString.length/AjaxTCR.storage.DEFAULT_MAX_COOKIE_SIZE + 1);
		for (var i=0;i<pieces;i++)
			AjaxTCR.comm.cookie.set("AjaxTCRAllItems"+i.toString(), allitemsString.substring(i*AjaxTCR.storage.DEFAULT_MAX_COOKIE_SIZE, AjaxTCR.storage.DEFAULT_MAX_COOKIE_SIZE), expires);
			
		/* Add Item */
		var pieces = Math.floor(value.length/AjaxTCR.storage.DEFAULT_MAX_COOKIE_SIZE + 1);
		for (var i=0;i<pieces;i++)
			AjaxTCR.comm.cookie.set(key+i.toString(), value.substring(i*AjaxTCR.storage.DEFAULT_MAX_COOKIE_SIZE, AjaxTCR.storage.DEFAULT_MAX_COOKIE_SIZE), expires);
		
	}
 },

/**
 * Retrives the saved value from persisted data.
 * 
 * @param {String} key The key of the value to retrieve
 * @param {Object} persistObj The persistent Object returned from init 
 * @param {String} [store] Optional value to name the store to save the data.  Only applicable in IE
 */
get : function(key, persistObj, store){
	
	if(navigator.userAgent.toLowerCase().indexOf("msie")>-1)
	{
		if (!store)
			store = "AjaxTCRStore";
		
		if (persistObj)
		{
			persistObj.load(store);
			return persistObj.getAttribute(key);
		}
	}	
	else if (typeof(globalStorage) != "undefined")
	{
		try{
			var storage = globalStorage[document.domain];
			return storage.getItem(key);
		}
		catch(e){}
	}
	
	//if it the storage hasn't been found, check cookies
	var i=0;
	var fullvalue = "";
	do
	{
		var val = AjaxTCR.comm.cookie.get(key+i.toString());
		if (val)
			fullvalue += val;
		i++;
	}while(val);
	
	if (fullvalue != "")
		return fullvalue;
	
	
	return null;
},

/**
 * Returns all items from the storage in an associative array of name/value pairs
 * 
 * @param {Object} persistObj The persistent Object returned from init 
 * @param {String} [store] Optional value to name the store to save the data.  Only applicable in IE
 */
getAll : function(persistObj, store){
	
	if(navigator.userAgent.toLowerCase().indexOf("msie")>-1)
	{
		if (!store)
			store = "AjaxTCRStore";
		
		if (persistObj)
		{
			var allitems = AjaxTCR.storage.get("AjaxTCRAllItems", persistObj, store);
			return AjaxTCR.data.decodeJSON(allitems);
		}
	}	
	else if (typeof(globalStorage) != "undefined")
	{
		try{
			var storage = globalStorage[document.domain];
			return storage;
		}
		catch(e){}
	}
	
	
	//if it the storage hasn't been found, check cookies
	
	var allitems = AjaxTCR.storage.get("AjaxTCRAllItems");
	if (allitems)
	{
		var items = {};
		var keys = AjaxTCR.data.decodeJSON(allitems);
		for (var i=0;i<keys.length;i++)
			items[keys[i]] = AjaxTCR.storage.get(keys[i]);
		return items;
	}
	
	
	return null;
},

/**
 * Removes all items from persistent storage.
 * 
 * @param {Object} persistObj The persistent Object returned from init 
 * @param {String} [store] Optional value to name the store to save the data.  Only applicable in IE
 */
clear : function(persistObj, store){
	
	var allItems = AjaxTCR.storage.getAll(persistObj, store);
	for (var i in allItems)
		AjaxTCR.storage.remove(i, persistObj, store);
},
 
/**
 * Remove the given item from persistent storage.
 * 
 * @param {string} key The name of the item to remove from storage
 * @param {Object} persistObj The persistent Object returned from init 
 * @param {String} [store] Optional value to name the store to save the data.  Only applicable in IE
 */
remove : function(key, persistObj, store){
	var removeFlag = 0;
	if(navigator.userAgent.toLowerCase().indexOf("msie")>-1 )
	{
		if (!store)
			store = "AjaxTCRStore";
		
		if (persistObj)
		{
			var allitems = AjaxTCR.storage.get("AjaxTCRAllItems", persistObj, store);
			if (allitems)
			{
				allitems = AjaxTCR.data.decodeJSON(allitems);
				if (allitems[key])
					delete allitems[key];
				allitems = AjaxTCR.data.encodeJSON(allitems);
				persistObj.setAttribute("AjaxTCRAllItems",allitems);
			}
			
			persistObj.removeAttribute(key);
			persistObj.save(store);
			
			removeFlag = 1;
		}
	}	
	else if (typeof(globalStorage) != "undefined")
	{
		try{
			var storage = globalStorage[document.domain];
			delete storage[key];
			removeFlag = 1;
		}
		catch(e){}
	}
	
	if (!removeFlag)
	{
		/* First remove from global object */
		var allitems = AjaxTCR.storage.get("AjaxTCRAllItems", persistObj, store);
		if (allitems)
		{
			allitems = AjaxTCR.data.decodeJSON(allitems);
			for (var i=allitems.length-1;i>=0;i--)
			{
				if (allitems[i] == key)
					delete allitems[i];
			}
			var allitemsString = AjaxTCR.data.encodeJSON(allitems);
			var loops = Math.floor(allitemsString.length/AjaxTCR.storage.DEFAULT_MAX_COOKIE_SIZE + 1);
			var now = new Date();
			now.setMonth(now.getMonth()+1);
			var expires = now.toGMTString(); 
			for (var i=0;i<loops;i++)
				AjaxTCR.comm.cookie.set("AjaxTCRAllItems"+i.toString(), allitemsString.substring(i*AjaxTCR.storage.DEFAULT_MAX_COOKIE_SIZE, AjaxTCR.storage.DEFAULT_MAX_COOKIE_SIZE), expires);
				
			var i=0;
			do
			{
				var val = AjaxTCR.comm.cookie.get(key+i.toString());
				if (val)
					AjaxTCR.comm.cookie.remove(key+i.toString());
				i++;
			}while(val);
			
		}
			

	}
 }
};


/*************************************  AjaxTCR.template *****************************/
/**
 * The template class of the library.  Is called directly from AjaxTCR.comm, but can also be called by the user.
 * 
 * @class AjaxTCR.template
 * @static
 */
AjaxTCR.template = {

 /** flag to indicate if we already included the template library 
  * @private
  */
 _libraryIncluded : false,
 
 /** The cache object  
  * @private
  */
 _cache : new Array(),
		
/**
 * Method that takes a template and a JSON object and converts into output 
 * @param {string} template  template string.
 * @param {JSON string} data  a JSON string to be used in rendering template
 * @return {string} String formatted by template and populated with data from data 
 */
translateString : function(template, data){
	var myTemplateObj = TrimPath.parseTemplate(template);
    var result  = myTemplateObj.process(AjaxTCR.data.decodeJSON(data));
	return result;
},

/**
 * Method that takes a template filename and a JSON object, fetches the file, and converts into output
 *  
 * @param {string} template  template filename.
 * @param {string} data  a JSON string to be used in rendering template
 * @param {boolean} cache  a boolean indicating whether to cache the response or not
 * @return {string} output string formatted by given template file and polulated with data from data. 
 */
translateFile : function(templatefilename, data, cache){
	
	if (typeof(cache) == "undefined")
		cache = true;
		
	var template = AjaxTCR.template.getFromCache(templatefilename);
	if (!template)
	{
		var templateRequest = AjaxTCR.comm.sendRequest(templatefilename, {async:false, cacheResponse:cache});
		var template = templateRequest.responseText;
		if (cache && template)
			AjaxTCR.template.addToCache(templatefilename, template);
	}
	
	if (typeof(data) == "string")
		data = AjaxTCR.data.decodeJSON(data);
	
	var myTemplateObj = TrimPath.parseTemplate(template);
    var result  = myTemplateObj.process(data);
	return result;
},

/**
 * Method that caches a template file usually the URL of the template file is used as the key and template as the value.
 * @param {string} key key to add to the template cache
 * @param {string} val value to store in the template cache
 */		
addToCache : function(key, val){
	
	var item = AjaxTCR.template._createCacheItem(key, val);
	AjaxTCR.template._cache.push(item);
},

/**
 * Adds a url and optional value string to the template cache.  If the value is set, it simply calls addToCache.  
 * If value is not set, it requests the file at the given URL and caches the results
 * 
 * @param {string} key key to add to the template cache
 * @param {string} val value to store in the template cache
 */		
cache : function(key, val){
	
	if (val)
		AjaxTCR.template.addToCache(key, val);
	else
	{
		var options = {cacheTemplate:true, 
					   onSuccess: function(response){
							if(response.responseText)
								AjaxTCR.template.addToCache(response.url, response.responseText);
					   }
		};
		AjaxTCR.comm.sendRequest(key, options);
		
	}
},

/**
 * Fetches a page that contains a template bundle.  The expected response is in this format:
 * &lt;!-- Template-Begin URL='rating-Ajax.tpl' --&gt;<br />
 * &lt;h3&gt;Thanks for voting!&lt;/h3&gt;<br />
 * &lt;p&gt;Your rating: {$userrating}. &lt;br /&gt;<br />
 * Average rating: {$avgrating}.&lt;br /&gt;<br />
 * Total votes: {$totalvotes}. &lt;br /&gt;<br />
 * &lt;/p&gt;<br />
 * &lt;!-- Template-End --&gt;<br />
 * &lt;!-- Template-Begin URL='thankyou-Ajax.tpl' --&gt;<br />
 * &lt;h2&gt;Thank you for registering {$username}&lt;/h2&gt;<br />
 * &lt;p&gt;Contact technical support at 555-1212&lt;/p&gt;<br />
 * &lt;!-- Template-End --&gt;<br />
 * 
 * @param url - URL of the template bundle to fetch
 */		
cacheBundle : function(url){
	
	var options = {cacheTemplate:true, 
				   onSuccess: AjaxTCR.template._parseTemplateBundle};
	AjaxTCR.comm.sendRequest(url, options);
},

/**
 * Public method that resets the template's cache
 * 
 */		
clearCache : function(){
	AjaxTCR.template._cache = new Array();
},

/**
 * public method to fetch a cached template based on the key
 * @param {string} key  key to add to the template cache
 * @return {string} the cached object value if found
 */	
getFromCache: function(key){
	var cacheObject = null;
	/* Search for item */
	for (var i=0;i<AjaxTCR.template._cache.length;i++)
	{
		if (AjaxTCR.template._cache[i].key == key)
		{
			cacheObject = AjaxTCR.template._cache[i];
			break;
		}
	}
	
	if (cacheObject)
		return cacheObject.value;
	else 
		return null;
},

/**
 * public method to remove an item from the template cache based on the key
 * @param {string} key  key of item to remove from template cache
 */	
removeFromCache : function(key){
	for (var i=0;i<AjaxTCR.template._cache.length;i++)
	{
		if (AjaxTCR.template._cache[i].key == key)
		{
			AjaxTCR.template._cache.splice(i,1);
			break;
		}
	}
},
								

/*************************************  Private Template Methods *****************************/

/**
 * private method that creates a cache object based on the given key and val
 * 
 * @private 
 * @param {string} key Key of the new cache object
 * @param {string} val Value of the new cache object
 */								
_createCacheItem : function(key, val){
	var cacheObject = {};
	cacheObject.key = key;
	cacheObject.value = val;
	return cacheObject;
},

/**
 * Dynamically include the template library on usage.
 * 
 * @private
 */
_includeLibrary : function(){
	if (!AjaxTCR.template._libraryIncluded)
		document.write('<sc' + 'ript type="text/javascript" src="http://ajaxref.com/lib/trimpath/template.js"></sc' + 'ript>');
	
	AjaxTCR.template._libraryIncluded = true;
},

/**
 * Takes a template bundle, parses it, and adds each item to the cache
 * 
 * @private 
 * @param {response} The response object from the XHR
 * 
 */
_parseTemplateBundle : function(response){
	var bundle = response.responseText;
	var re = /\s*\<!--\s*Template-Begin([\w\W]*?)\<!--\s*Template-End\s*--\>\s*/ig;
	var matches = bundle.match(re);
	for (var i=0;i<matches.length;i++)
	{
		var parts = /\s*\<!--\s*Template-Begin\s*URL=['"]([^'"]*)['"]\s*--\>([\w\W]*?)\<!--\s*Template-End\s*--\>\s*/i;
		var data = parts.exec(matches[i]);
		if (data)
			AjaxTCR.template.addToCache(data[1], data[2]);
	}
}


};



/*********************************************  Data Handling Methods *********************************************/
/**
 * Several useful data functions.  encode/decode/serialize for several different data formats.  Many of these are
 * called from other parts of the library. 
 * 
 * @class AjaxTCR.data
 * @static
 */
AjaxTCR.data = {
						
/**
 * Public method to encode passed string values to make the URL safe.  
 * Strictly encodes to x-www-urlencoded format vs. native methods found in JavaScript.
 * 
 * @param {string} val - the value to encode
 * @return {string} a string that is properly x-www-urlencoded as a browser would do it
 */									 							 
encodeValue : function(val) {
	
    var encodedVal;

	if (!encodeURIComponent)
	  {
	   encodedVal = escape(val);
       /* fix the omissions */
	   encodedVal = encodedVal.replace(/@/g, '%40');
	   encodedVal = encodedVal.replace(/\//g, '%2F');
	   encodedVal = encodedVal.replace(/\+/g, '%2B');
      }
    else
      {
       encodedVal = encodeURIComponent(val);
	   /* fix the omissions */
	   encodedVal = encodedVal.replace(/~/g, '%7E');
	   encodedVal = encodedVal.replace(/!/g, '%21');
	   encodedVal = encodedVal.replace(/\(/g, '%28');
	   encodedVal = encodedVal.replace(/\)/g, '%29');
	   encodedVal = encodedVal.replace(/'/g, '%27');
      }

    /* clean up the spaces and return */
    return encodedVal.replace(/\%20/g,'+'); 
} ,
						   
/**
 * Public method to decode passed string values from a URL safe string.
 * 
 * @param {string} val - the value to decode
 * @return {string} a string that is properly reversed from the proper x-www-urlencoded format
 */									 							 
decodeValue : function(val) {
                             var decodedVal;

                             if (!decodeURIComponent)
                               {
								decodedVal = val;
                                /* fix the omissions */
	                            decodedVal = decodedVal.replace(/\%40/g, '@');
	                            decodedVal = decodedVal.replace(/\%2F/g, '/');
	                            decodedVal = decodedVal.replace(/\%2B/g, '+');
								decodedVal = unescape(val);
                                
                               }
                            else
                               {
                                /* fix the omissions */
								decodedVal = val;
	                            decodedVal = decodedVal.replace(/\%7E/g, '~');
	                            decodedVal = decodedVal.replace(/\%21/g, '!');
	                            decodedVal = decodedVal.replace(/\%28/g, '(');
	                            decodedVal = decodedVal.replace(/\%29/g, ')');
	                            decodedVal = decodedVal.replace(/\%27/g, "'");
								
								decodedVal = decodeURIComponent(val);
	                            
                               }

                            /* clean up the spaces and return */
                            return decodedVal.replace(/\+/g,' '); 
                           } ,

/**
 * Public method to convert tag characters to &lt; and &gt; and change \n to <br />
 * 
 *  @param {string} str String to modify
 *  @return {string} The str value with the conversions in place 
 */	
encodeAsHTML : function(str) {
								var convertedString = str.replace(/<([^>]*)>/g, "&lt;$1&gt;")
								convertedString = convertedString.replace(/\n/g, "<br/>");
								return convertedString;
						   }, 
						
/**
 * Public method to encode passed string values into base64.
 * 
 * @param {string} inputStr A string value to encode
 * @return {string} The inputStr value encoded in base64
 */	
encode64 : function(inputStr) 
{
   var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   var outputStr = "";
   var i = 0;
   
   while (i<inputStr.length)
   {
      var byte1 = inputStr.charCodeAt(i++);
      var byte2 = inputStr.charCodeAt(i++);
      var byte3 = inputStr.charCodeAt(i++);

      var enc1 = byte1 >> 2;
      var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
	  
	  var enc3, enc4;
	  if (isNaN(byte2))
		enc3 = enc4 = 64;
	  else
	  {
      	enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
		if (isNaN(byte3))
         	enc4 = 64;
		else
	      	enc4 = byte3 & 63;
	  }

      outputStr +=  b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
   } 
   
   return outputStr;
}, 

/**
 * Public method to decode passed string values from base64.
 * 
 * @param {string} inputStr A string in base64 format
 * @return {string} The decoded string
 */	
decode64 : function(inputStr) 
{
   var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   var outputStr = "";
   var i = 0;
   inputStr = inputStr.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   while (i<inputStr.length)
   {
      var dec1 = b64.indexOf(inputStr.charAt(i++));
      var dec2 = b64.indexOf(inputStr.charAt(i++));
      var dec3 = b64.indexOf(inputStr.charAt(i++));
      var dec4 = b64.indexOf(inputStr.charAt(i++));

      var byte1 = (dec1 << 2) | (dec2 >> 4);
      var byte2 = ((dec2 & 15) << 4) | (dec3 >> 2);
      var byte3 = ((dec3 & 3) << 6) | dec4;

      outputStr += String.fromCharCode(byte1);
      if (dec3 != 64) 
	  	outputStr += String.fromCharCode(byte2);
      if (dec4 != 64)
         outputStr += String.fromCharCode(byte3);
   }

   return outputStr;
},

/**
 * Public method to create a serialized payload based on the contents of a form and the specified encoding value.  
 * trigger and evt are optional and used to firm up the accuracy between what the browser would send and what we send.
 * 
 * @param {object} form  The form to be serialized
 * @param {string} encoding  The encoding of the result.  Options are "application/json", "application/x-www-form-urlencoded", "text/plain", "text/xml"
 * @param {object} trigger The element that caused the submission of the form.  input type="button" fields will only be included in the payload if they triggered the submission.
 * @param {object} evt In the case that a input type="image" caused the submission, if the evt is passed in, the coordinates of the click will be put in the payload
 * @return {string} The payload serialized according to the specified encoding.
 */									 
	
serializeForm : function(form, encoding, trigger, evt) {	
	if (typeof(form) == "string")
	{
		var formObject = document.forms[form]; 
		if (formObject == null)
			formObject = document.getElementById(form);
			
		form = formObject;			
	}
	var x=0,y=0;
	if (trigger && trigger.type == "image" && trigger.name)
	{
		if (window.event)
		{
			x = window.event.offsetX;
			y = window.event.offsetY;
		}
		else if (evt.target) 
		{
			var coords = {x: 0, y: 0 };
			var elmt = trigger;
			while (elmt)
			{
				coords.x += elmt.offsetLeft;
				coords.y += elmt.offsetTop;
				elmt = elmt.offsetParent;
			}
		
			x = evt.clientX + window.scrollX - coords.x - 1 ;
			y = evt.clientY + window.scrollY - coords.y - 1;
		}
	}
	
	var formValues = AjaxTCR.data._beginEncode(encoding);
	for (var i =0; i < form.elements.length; i++)
	{
	 var currentField = form.elements[i];
	 var fieldName = currentField.name;
	 var fieldType = currentField.type;
	
	 /* Disabled and unnamed fields are not sent by browsers so ignore them */
	 if ((!currentField.disabled) && fieldName) 
	   {
		switch (fieldType)
		 {
		  case "text":
		  case "password":
		  case "hidden":
		  case "textarea": formValues = AjaxTCR.data._encode(formValues, fieldName, currentField.value, encoding);
	                           break;
		  case "radio":
		  case "checkbox": if (currentField.checked) 
					formValues = AjaxTCR.data._encode(formValues, fieldName, currentField.value, encoding);
	                           break;
	      case 'select-one':
		  case 'select-multiple': for (var j=0; j< currentField.options.length; j++)
				           if (currentField.options[j].selected)
	                                   {
						formValues = AjaxTCR.data._encode(formValues, fieldName, (currentField.options[j].value != null && currentField.options[j].value != "") ? currentField.options[j].value : currentField.options[j].text , encoding);
	                                   }
				           break;
		  case "file": if (currentField.value)
				   return "fileupload";
				else
				    formValues = AjaxTCR.data._encode(formValues, fieldName, currentField.value, encoding);
			       break;
		  case "submit": if (currentField == trigger)
			 	     formValues = AjaxTCR.data._encode(formValues, fieldName, currentField.value, encoding);
				 break;
		  default: continue;  /* everything else like fieldset you don't want */
		 }
	  }
	
	}
	
	if (trigger && trigger.type == "image" && trigger.name)
	{
		/* this is where we need to insert the trigger image information */
		formValues = AjaxTCR.data._encode(formValues, trigger.name + ".x", x, encoding);
		formValues = AjaxTCR.data._encode(formValues, trigger.name + ".y", y, encoding);
		formValues = AjaxTCR.data._encode(formValues, trigger.name, trigger.value, encoding);
	}
	
	/* Clean up payload string */
	formValues = AjaxTCR.data._completeEncoding(formValues, encoding);
	
	return formValues;
														},

/**
 * Public method to create/modify a serialized object based on an object
 
 * @param {object} payload the current object that will be appended to.
 * @param {object} obj is the object to add to the payload
 * @param {string} encoding  The encoding of the result.  Options are "application/json", "application/x-www-form-urlencoded", "text/plain", "text/xml"
 * @return {object} The new payload with the object included
 */									 
	
serializeObject : function(payload, obj, encoding){
	/* Take care of any necessary bits if payload isn't empty */
	payload = AjaxTCR.data._continueEncoding(payload, encoding);
	
	/* encode each value in the object */
    for (var key in obj)
        payload = AjaxTCR.data._encode(payload, key, obj[key], encoding);

	/* Clean up payload string */
	payload = AjaxTCR.data._completeEncoding(payload, encoding);
    return payload;
},

/**
 * private method to encode one name/value pair and add it to a payload.
 * 
 * @private 
 * @param {object} payload is current object that will be appended to.  It can be null.
 * @param {string} fieldName The name of the item to encode
 * @param {string} fieldValue The value of the item to encode
 * @param {string} encoding  The encoding of the result.  Options are "application/json", "application/x-www-form-urlencoded", "text/plain", "text/xml"
 * @return {object} The new payload with the new name/value pair included
 */	
_encode : function(payload, fieldName, fieldValue, encoding){
	switch(encoding)
	{
    	case "application/json":
    	   	  payload[fieldName] = fieldValue;
		  break;
    	case "application/x-www-form-urlencoded":
    	   	  payload+=AjaxTCR.data.encodeValue(fieldName)+"="+AjaxTCR.data.encodeValue(fieldValue)+"&"
		  break;
		case "text/plain":
    	   	  payload+=fieldName.replace(/,/g, "%2C") + "=" + fieldValue.replace(/,/g, "%2C") +","
		  break;
		case "text/xml":
			var node = payload.createElement(fieldName);
			node.appendChild(payload.createTextNode(fieldValue));
			payload.lastChild.appendChild(node);
	
		  break;
	}

    return payload;
},

/**
 * private method to create the base for the encoding object
 * 
 * @private 
 * @param {string} encoding  The encoding of the result.  Options are "application/json", "application/x-www-form-urlencoded", "text/plain", "text/xml"
 * @return {object} Either an empty string, xml frame, or an empty object depending on type
 */	
_beginEncode : function(encoding){
	switch(encoding)
	{
    	case "application/json":
    	  if (payload == null)
	    	payload = {};

	  	  break;
    	case "application/x-www-form-urlencoded":
    	  if (payload == null)
	    	payload = "";

		  break;
		case "text/plain":
    	  if (payload == null)
	    	payload = "";

		  break;
		case "text/xml":
			if (payload == null)
			{
				var payload = AjaxTCR.data._createXMLDocument();
				if (window.navigator.userAgent.indexOf('Opera') == -1)
				{
				  var xmlStmt = payload.createProcessingInstruction("xml"," version=\"1.0\" encoding=\"UTF-8\" ");
			      payload.appendChild(xmlStmt);
				}
				
				var root = payload.createElement("payload");
				payload.appendChild(root);
			}
								
			
		  break;
	}

    return payload;
},

/**
 * private method to clean up payload string when finished encoding.
 * 
 * @private
 * @param {object} payload The payload to clean
 * @param {string} encoding  The encoding of the result.  Options are "application/json", "application/x-www-form-urlencoded", "text/plain", "text/xml"
 * @return {object} The final payload object with no loose ends.
 */	
_completeEncoding : function (payload, encoding ){
	/* Trim off the end & but avoid edge case problems with an empty form */
	if ((encoding == "application/x-www-form-urlencoded" || encoding == "text/plain") && payload.length > 0)
	  payload = payload.substring(0,payload.length-1);
	  
	return payload;
},

/**
 * private method to get payload ready to be appended to.
 * @private
 * @param {object} payload The payload to prepare for being appended to
 * @param {string} encoding  The encoding of the result.  Options are "application/json", "application/x-www-form-urlencoded", "text/plain", "text/xml"
 * @return {object} The payload in a form that it can now have the next value written to it.
 */	
_continueEncoding : function(payload, encoding){
	if (payload != "")
	  {
		if (encoding == "application/x-www-form-urlencoded")
			payload += "&";
		else if (encoding == "text/plain")
			payload += ",";
	  }
	return payload;
   },

/**
 * Finds the best native or ActiveX object to use for an XML Document
 * 
 * @private 
 * @return {object} The XML Document
 */
_createXMLDocument : function(){
	var xmlDoc = null;
	if (window.ActiveXObject)
	  {
	  	var versions = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XMLDOM"];
	
	    for (var i=0;i<versions.length;i++)
	     {
		   try
		    {
			 xmlDoc = new ActiveXObject(versions[i]);
			 break;
		    }
		   catch(err){}
	      }
	  }
	else	
		xmlDoc = document.implementation.createDocument("", "", null);
		
	return xmlDoc;
  },

/**
 * Returns the string version of the given XML Object
 * 
 * @param {object} xmlObject The xml object
 * @return {string} The xmlObject in string form
 */							  
serializeXML : function(xmlObject){
	var xmlString = "";
	
	if (typeof XMLSerializer != "undefined")
  		xmlString = (new XMLSerializer()).serializeToString(xmlObject); 
	else if (xmlObject.xml) 
		xmlString = xmlObject.xml;
		
	return xmlString;
},

/**
 * Returns the XML Object of the given string
 * 
 * @param {string} xmlStr A string that can be converted to XML
 * @return {object} The xmlObject generated from the string
 */							  
serializeXMLString : function(xmlStr){
	if (window.DOMParser)
	 	var xmlDoc = (new DOMParser()).parseFromString(xmlStr, "text/xml");
	else
	{
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	  	xmlDoc.async="false";
	  	xmlDoc.loadXML(xmlStr);
 	}

	return xmlDoc;
},
						
						
/**
 * Convert JSON into JavaScript values
 * 
 * @param {string} jsonString A string that can be converted to JavaScript arrays and objects
 * @return {object} A javascript object generated from the passed in string.
 */							
decodeJSON : function(jsonString){
	var j;
	if (jsonString.length > 1 && jsonString.substring(0,2) == "/*")
		jsonString = jsonString.substring(2,jsonString.lastIndexOf("*/"));

	  try {
	        j = eval('(' + jsonString + ')');
	  } 
	  catch (e) {
	        throw new SyntaxError('parseJSON');
	  }
	  return j;
},

/**
 * Turn JavaScript values into a JSON String
 * 
 * @param {object} o A object to be converted into a JSON string
 * @return {string} A string representation of the passed in object
 */	
encodeJSON : function(o){
	var useHasOwn = {}.hasOwnProperty ? true : false;
    var pad = function(n) {
        return n < 10 ? '0' + n : n;
    };
    
    var m = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };
	
	if(typeof o == 'undefined' || o === null)
	return 'null';
	else if(o instanceof Array)
	{
	var a = ['['], b, i, l = o.length, v;
	for (i = 0; i < l; i += 1) {
	    v = o[i];
	    switch (typeof v) {
	        case 'undefined':
	       // case 'function':
	        case 'unknown':
	            break;
	        default:
	            if (b) {
	                a.push(',');
	            }
	            a.push(v === null ? "null" : AjaxTCR.data.encodeJSON(v));
	            b = true;
	    }
	}
	a.push(']');
	return a.join('');
	}
	else if(o instanceof Date)
	{
	return '"' + o.getFullYear() + '-' +
	    pad(o.getMonth() + 1) + '-' +
	    pad(o.getDate()) + 'T' +
	    pad(o.getHours()) + ':' +
	    pad(o.getMinutes()) + ':' +
	    pad(o.getSeconds()) + '"';
	}
	else if(typeof o == 'string')
	{
		var s = o;
	if (/["\\\x00-\x1f]/.test(s)) 
		{
		return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) 
			{
                var c = m[b];
                if(c){
                    return c;
                }
                c = b.charCodeAt();
	    	return '\\u00' +
	        	Math.floor(c / 16).toString(16) +
	        (c % 16).toString(16);
		}) + '"';
		}
		return '"' + s + '"';
	}
	else if(typeof o == 'number')
	{
	return isFinite(o) ? String(o) : "null";
	}
	else if(typeof o == 'boolean')
	{
	return String(o);
	}
	else if (typeof o == 'function')
	{
		//return String(o).replace(/\n/g, " ");
		return '( ' + String(o) + ' )';
	}
	else 
	{
	var a = ['{'], b, i, v;
	for (var i in o) {
		try{
			if(!useHasOwn || o.hasOwnProperty(i)) {
	        v = o[i];
	        switch (typeof v) {
	        case 'undefined':
	       // case 'function':
	        case 'unknown':
	            break;
				case 'function':
					if (String(v).indexOf("[native code]") > -1)
						break;
	        default:
	            if(b)
					a.push(',');
	            
	            a.push(AjaxTCR.data.encodeJSON(i), ':', v === null ? "null" : AjaxTCR.data.encodeJSON(v));
	            b = true;
	        }
	    }
		}
		catch(e){};
	}
	a.push('}');
	return a.join('');
	}
},

	
/**
 * encodeMD5(string) 
 * 
 * public method to get md5 encode a string
 * Based on Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 * 
 * @param {string} str The string to encode
 * @return {string} A string that is encoded in MD5 format
 */	
encodeMD5 : function(str){
	var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
	var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
	var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

	var len = str.length * chrsz;
	
	var x = Array();
  	var mask = (1 << chrsz) - 1;
  	for(var i = 0; i < len; i += chrsz)
	  {
    	x[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
	  }	
		
	/* append padding */
  	x[len >> 5] |= 0x80 << ((len) % 32);
  	x[(((len + 64) >>> 9) << 4) + 14] = len;

  	var a =  1732584193;
  	var b = -271733879;
  	var c = -1732584194;
  	var d =  271733878;

  	for(var i = 0; i < x.length; i += 16)
  	{
    	var olda = a;
    	var oldb = b;
    	var oldc = c;
    	var oldd = d;

	    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
	    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
	    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
	    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
	    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
	    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
	    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
	    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
	    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
	    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
	    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
	    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
	    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
	    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
	    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
	    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
	
	    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
	    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
	    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
	    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
	    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
	    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
	    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
	    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
	    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
	    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
	    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
	    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
	    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
	    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
	    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
	    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
	
	    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
	    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
	    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
	    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
	    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
	    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
	    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
	    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
	    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
	    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
	    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
	    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
	    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
	    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
	    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
	    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
	
	    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
	    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
	    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
	    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
	    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
	    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
	    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
	    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
	    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
	    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
	    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
	    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
	    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
	    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
	    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
	    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
	
	    a = safe_add(a, olda);
	    b = safe_add(b, oldb);
	    c = safe_add(c, oldc);
	    d = safe_add(d, oldd);
	}
  
  	var binarray = Array(a, b, c, d);
  	var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  	var str = "";
  	for(var i = 0; i < binarray.length * 4; i++)
  	{
    	str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  	}
  	
	return str;
  
	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xFFFF);
	}
	
	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt)
	{
	  return (num << cnt) | (num >>> (32 - cnt));
	}
	
	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t)
	{
	  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t)
	{
	  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t)
	{
	  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

}

};


/**
 * While the main purpose of the library is communication functions, it was necessary to add in some utility methods.  
 * The AjaxTCR.util holds these methods.
 * 
 * @class AjaxTCR.util
 * @static
 */
AjaxTCR.util = {};
/**
 * Several useful utility DOM functions.  Many of these are called from other parts of the library. 
 * 
 * @class AjaxTCR.util.DOM
 * @static
 */
AjaxTCR.util.DOM = {
	
	/** by default enable shorthanding of function names */
	enableDOMShorthand : true,

	/**
	 * Find elements by class, will be overriden by native if found
	 * If startNode is specified, starts the search there, otherwise starts at document. 
	 * 
	 * @param 	{string} classToFind	the string class name to search for 
	 * @param	{object} startNode	the DOM node to start the search at.  Default is the document node. 
	 * @return 	{array} array of elements that match the given class name.
	 */
	getElementsByClassName : function(classToFind,startNode){ 	
		if (document.getElementsByClassName)
		  return document.getElementsByClassName(classToFind,startNode);
											
		/* find all the elements within a particular document or in the whole document */
		var elements;
		if (startNode)
		 elements = startNode.getElementsByTagName("*");
		else
		 elements = document.getElementsByTagName("*");
		 
		var classElements = new Array();
		var classCount = 0;  
		
		var pattern = new RegExp("(^|\\s)"+classToFind+"(\\s|$)");
		
		/* look over the elements and find those who match the class passed */
		for (var i = 0; i < elements.length; i++)
		  if (pattern.test(elements[i].className) )
		      classElements[classCount++] = elements[i];
											
		return classElements;
								},	

	/**
	 * Returns element or element array specified by given string or strings.
	 * 
	 * @param	{object} element(s) 	strings to search for element.
	 * @param 	{object} startNode	the DOM node to start the search at.  Default is the document node.
	 * @return	{object} if single string, it returns the element.  Otherwise it returns an array of elements
	 */
	getElementsById : function(){
		var elements = new Array();
		var startNode = document;
		var length = arguments.length;
		if (typeof(arguments[length-1]) == "object" && arguments[length-1] != document)
		{
			startNode = arguments[length-1];
			length--;
			var allElements = startNode.getElementsByTagName("*");
			for (var j=0; j<allElements.length; j++)
			{
				for (var i=0;i<length;i++)
				{
	   				if (allElements[j].id == arguments[i])
					{
	        			elements.push(allElements[j]);
						break;
					}
				}
			}
		}
		else
		{
			if (arguments[length-1] == document)
				length--;
				
			for (var i=0; i<length; i++)
			{
				var elm = document.getElementById(arguments[i]);
				if (elm != null)
		    		elements.push(elm);
			}
		}
		
		if (elements.length == 1)
			return elements[0];
		else if (elements.length > 0)
			return elements;
		else
			return null;
	},
		
	/**
	 * Modified version of getElementById to return single node match.
	 * If startNode is not set to document, it starts the search at the node
	 * If deepSearch is set to true, it does not use getElementById, but instead loops through the whole structure.
	 * 
	 * @param {string} id 			the string to match with the id attribute
	 * @param {object} startNode		the DOM node to start searching in the document
	 * @param {boolean} deepSearch	true if wanted to search node by node instead of document.getElementById
	 */						
	getElementById : function(id, startNode, deepSearch){
		if (!startNode)
			startNode = document;
		
		if (startNode == document && !deepSearch)
			return document.getElementById(id);
		else
		{
			var allElements = startNode.getElementsByTagName("*");
			for (var j=0; j<allElements.length; j++)
			{
				if (allElements[j].getAttribute("id") == id)
				{
			   		return allElements[j];
					break;
				}
			}
		}
	},
	
		
	/**
	 * Select nodes that match the given selector.  The selector is expected to be in CSS format
	 * 
	 * @param {string} 	selector		string indicating the selection to match
	 * @param {object}	treeRoot		DOM element to start search.  Default is the document node
	 * @return 	array of matching elements
	 * 
	 */						
	getElementsBySelector : function(selector,treeRoot,selectorType){
		var matches = new Array();
		var parents = new Array();
		var savematches = new Array();
		if (treeRoot)
		{
			if (treeRoot.length)
			{
				for (var i=0;i<treeRoot.length;i++)
					parents.push(treeRoot[i]);
			}
			else
				parents.push(treeRoot);
		}
		else
			parents.push(document);
			
		if (!selectorType)
			selectorType = "CSS";
		if (selectorType.toUpperCase() == "CSS")
		{
			selector = selector.replace(/([>\+,])/g, " $1 ").replace(/[\s]+/g," ");
			 
			var selectors = selector.split(" ");
			while (selectors.length > 0)
			{
				var curSelector = selectors.shift();
				if (curSelector == "")
					continue;
					
				/* check for expressions */
				var options = {};
				switch(curSelector.charAt(0))
				{
					case(">"):
						options.type = "childOnly";
					break;
					case("+"):
						options.type = "nextSibling";
					break;
					case ("~"):
						options.type = "futureSibling";
					break;
					case(","):
						while(matches.length > 0)
							savematches.push(matches.shift());
								
						parents.length = 0;					
						if (treeRoot)
							parents.push(treeRoot);
						else
							parents.push(document);
								
						continue;
					break;
				}
				
				if (options.type)
				{
					if (curSelector.length == 1)
						curSelector = selectors.shift();
					else
						curSelector = curSelector.substring(1);
				}
				
				/* Check to see if we already looped though.  If so, we have a different starting point */
				if (matches.length)
				{
					parents.length = 0;
					while(matches.length > 0)
						parents.push(matches.shift());
				}
				
				
				/* Check for Pseudo-classes */
				if (curSelector.indexOf(":") > -1)
				{
					var newSelector = curSelector.substring(0, curSelector.indexOf(":"));
					var optionsType = curSelector.substring(curSelector.indexOf(":")+1);
					
					curSelector = newSelector;
					options.type = optionsType.toLowerCase();
					
					if (options.type.indexOf("nth-child") == 0)
					{
						options.childNumber = options.type.substring(10,options.type.length-1);
						options.type = "nth-child";
					}
					else if (options.type.indexOf("not") == 0)
					{
						//use optionsType to preserve case
						options.notString = optionsType.substring(4,options.type.length-1).replace(/^\s+|\s+$/g,"");
						options.type = "not";
						var notSelector = curSelector;
						if (notSelector == "*")
							notSelector = "";
						if (/^[:#\[\.].*/.test(options.notString))
							options.notSelector = notSelector + options.notString;
						else
							options.notSelector = notSelector + " " + options.notString;
						
						options.notObjects = AjaxTCR.util.DOM.getElementsBySelector(options.notSelector, parents);	
					}
				}
				
				/* Check for Attributes */
				if (curSelector.indexOf("[") > -1)
				{
					var tokens = curSelector.split("[");
					curSelector = tokens[0];
					options.type = "attribute";
					options.attribute = tokens[1].substring(0,tokens[1].length-1).toLowerCase();
				}
				
				if (curSelector == "")
					curSelector = "*";
				
				/* Inspect class selectors */
				if (curSelector.indexOf(".") > -1)
				{
					/* Cases:
					 * p.class1
					 * .class2
					 * div.class1.class2
					 */
					var classNames = curSelector.split(".");
					var elementName = classNames.shift();
					/* First get the element at the beginning if necessary */
					if (elementName != "")
					{
						for (var j=0;j<parents.length;j++)
						{
							var elms = AjaxTCR.util.DOM._getElementsByTagName(parents[j],elementName,options);
							for (var k=0;k<elms.length;k++)
							{
								if (checkFilter(elms[k], parents[j], options))
									matches.push(elms[k]);
							}
						}
					}
					else if (classNames.length > 0)
					{
						/* if no element is specified, use getElementsByClassName for the first class */
						var firstClass = classNames.shift();
						for (var j=0;j<parents.length;j++)
						{
							var elms = AjaxTCR.util.DOM.getElementsByClassName(firstClass, parents[j]);
							for (var k=0;k<elms.length;k++)
							{
								if (checkFilter(elms[k],parents[j],options))
									matches.push(elms[k]);
							}
						}
					}
				
					/* Now get the (rest of the) classes */
					for (var j=matches.length-1;j>=0;j--)
					{
						for (var k=0;k<classNames.length;k++)
						{
							var pattern = new RegExp("(^|\\s)"+classNames[k]+"(\\s|$)");
							if (!pattern.test(matches[j].className))
							{
								matches.splice(j,1);
								break;
							} 
						}
					}
				}
				
				/* Inspect id selectors */
				else if (curSelector.indexOf("#") > -1)
				{
					/* Cases:
					 * p#id1
					 * #id2
					 */
					var idNames = curSelector.split("#");
					var elementName = idNames[0];
					var id = idNames[1];
					
					/* First get the element at the beginning if necessary */
					if (elementName != "")
					{
						for (var j=0;j<parents.length;j++)
						{
							var elms = AjaxTCR.util.DOM._getElementsByTagName(parents[j],elementName,options);
							for (var k=0;k<elms.length;k++)
							{
								if (elms[k].id == id && checkFilter(elms[k], parents[j], options))  
									matches.push(elms[k]);
							}
						}
					}
					else
					{
						for (var j=0;j<parents.length;j++)
						{
							var elms = AjaxTCR.util.DOM.getElementsById(id, parents[j]);
							if (checkFilter(elms, parents[j], options))
								matches.push(elms);
						}
					}
				}
				/* Simple tagname selects */
				else
				{
					for (var j=0;j<parents.length;j++)
					{
						var elms =AjaxTCR.util.DOM._getElementsByTagName(parents[j],curSelector,options);
						for (var k=0;k<elms.length;k++)
						{
							if (checkFilter(elms[k], parents[j], options))
								matches.push(elms[k]);
						}
					}
				}
			}
		}
		
		
		function checkFilter(element, parent, options)
		{
			var valid = false;
			
			if (element == null)
				return false;
			else if (!options.type)
				return true;
				
			//handle the case of the parent element being the document	
			if (parent == document)
			{
				var allElms = document.getElementsByTagName("*");
				for (var i=0;i<allElms.length;i++)
				{
					if( checkFilter(element, allElms[i], options))
					{
						valid = true;
						break;
					}
				}
			
				return valid;
			}
			
			
			if (options.type == "childOnly")
				valid = (element.parentNode == parent);
			else if (options.type == "nextSibling")
			{
				var elm = parent.nextSibling;
				while (elm != null && elm.nodeType != 1)
					elm = elm.nextSibling;
				valid = (elm == element);
			}
			else if (options.type == "futureSibling")
			{
				var elm = parent.nextSibling;
				while (elm != null)
				{
					if (elm == element)
					{
						valid = true;
						break;
					}
					elm = elm.nextSibling;
				}
			}	
			else if (options.type == "first-child")
			{
				var elm = parent.firstChild;
				while (elm != null && elm.nodeType != 1)
					elm = elm.nextSibling;
				valid = (elm == element); 
			}		
			else if (options.type == "last-child")
			{
				var elm = parent.lastChild;
				while (elm != null && elm.nodeType != 1)
					elm = elm.previousSibling;
				valid = (elm == element); 
			}
			else if (options.type == "only-child")
			{
				var elm = parent.firstChild;
				while (elm != null && elm.nodeType != 1)
					elm = elm.nextSibling;
				
				if (elm == element)
				{
					var elm = parent.lastChild;
					while (elm != null && elm.nodeType != 1)
						elm = elm.previousSibling;
				}
				
				valid = (elm == element);
			}
			else if (options.type == "nth-child")
			{
				var count = 0;
				var elm = parent.firstChild;
				while (elm != null  && count < options.childNumber)
				{
					if (elm.nodeType == 1)
						count++;	
					
					if (count == options.childNumber)
						break;
					
					elm = elm.nextSibling;
				}
				 
				valid = (elm == element);
			}
			else if (options.type == "empty")
				valid = (element.childNodes.length == 0);
			else if (options.type == "enabled")
				valid = (!element.disabled);
			else if (options.type == "disabled")
				valid = (element.disabled);
			else if (options.type == "checked")
				valid = (element.checked);
			else if (options.type == "selected")
				valid = (element.selected);
			else if (options.type == "attribute")
			{
				var pattern = /^\s*([\w-]+)\s*([!*$^~=]*)\s*(['|\"]?)(.*)\3/;
				var attRules = pattern.exec(options.attribute);
				
				if (attRules[2] == "")
					valid = element.getAttribute(attRules[1]);
				else if (attRules[2] == "=")
					valid = (element.getAttribute(attRules[1]) && element.getAttribute(attRules[1]).toLowerCase() == attRules[4].toLowerCase());
				else if (attRules[2] == "^=")
					valid = (element.getAttribute(attRules[1]) && element.getAttribute(attRules[1]).toLowerCase().indexOf(attRules[4].toLowerCase()) == 0);
				else if (attRules[2] == "*=")
					valid = (element.getAttribute(attRules[1]) && element.getAttribute(attRules[1]).toLowerCase().indexOf(attRules[4].toLowerCase()) > -1);
				else if (attRules[2] == "$=")
				{
					var att =element.getAttribute(attRules[1]);
					if (att)
						valid =  (att.toLowerCase().substring(att.length - attRules[4].length) == attRules[4].toLowerCase()); 
				}				
			}
			else if (options.type == "not")
			{
				valid = true;
				for (var j=0;j<options.notObjects.length;j++)
				{
					if (options.notObjects[j] == element)
					{
						valid = false;
						break;
					}
				}
			}
			
			
			return valid;					
		}
		
		/* get the results in the correct order */
		if (savematches.length)
		{
			while(matches.length > 0)
				savematches.push(matches.shift());
			while(savematches.length > 0)
				matches.push(savematches.shift());
		}
		return matches;
	},	
							
		
/**
 * Custom getElementsByTagName that takes various options into consideration before returning the values
 * 
 * @private 
 * @param {object} parentElm	element to begin the search at
 * @param {string} tag		string to match tagName to
 * @param options
 * @return Matching nodes
 */					
_getElementsByTagName : function(parentElm, tag, options){
	var matches = new Array();
	if (!options.type)
		return parentElm.getElementsByTagName(tag);
	
	
	if (options.type == "nextSibling")
	{
		var elm = parentElm.nextSibling;
		while (elm && elm.nodeType != 1)
			elm = elm.nextSibling;
		
		if (checkTagMatch(elm, tag))
			matches.push(elm);
	}
	else if (options.type == "futureSibling")
	{
		var elm = parentElm.nextSibling;
		while (elm)
		{
			if (checkTagMatch(elm, tag))
			{
				matches.push(elm);
				//break;
			}
			elm = elm.nextSibling;
		}	
	}
	else
		matches = parentElm.getElementsByTagName(tag);
	
	function checkTagMatch(element, tag)
	{
		return (element && element.tagName && (tag == "*" || element.tagName.toUpperCase() == tag.toUpperCase()));
	}
			
	return matches;
},

/**
 * Inserts the passed object after the sibling with the given pareny
 * @param {Object} parent The parent of the node to insert
 * @param {Object} obj The new node to insert
 * @param {Object} sibling The sibling to insert after
 */
insertAfter : function(parent, obj, sibling){
	if (parent && obj && sibling && sibling.nextSibling)
		parent.insertBefore(obj, sibling.nextSibling);
	else if (parent && obj)
		parent.appendChild(obj);
}
};


/**
 * The library doesn't currently offer large event handling support, but some basics are included in this calss
 * 
 * @class AjaxTCR.util.event
 * @static
 */
AjaxTCR.util.event = {
/**
 * addWindowLoadEvent - simple method to allow for safe addition of window.onload called functions.  Assumes everyone else plays nicely though.
 * 
 * @param {object} newFunction - function to call upon page load
 */					

addWindowLoadEvent: function(newFunction) {
	
	var oldFunction = window.onload;
	if (typeof window.onload != "function")
	  {
	   window.onload = newFunction;
	  }
	else 
	  {
  	   window.onload = function () {
	     if (oldFunction)
		   {
		   	oldFunction();
		   }
		 newFunction();
	    };
	  }	
}

};

/**
 * The place for anything that doesn't have a home
 * 
 * @class AjaxTCR.util.misc
 * @static
 */
AjaxTCR.util.misc = {
	/**
	 * generateUID : Generates a unique value.  If 'prefix' is set to -1, only returns the numerical value. 
	 * 				 If prefix isn't set, it sets it to "AjaxTCR".
	 * 
	 * @param {string} [prefix] the string value to prepend to the uniquevalue
	 * @return the string consisting of the prefix and the uniquevalue
	 */
	generateUID : function(prefix){
		if (prefix == "-1")
			prefix = "";
		else if (!prefix)
			prefix = "AjaxTCR";
		
		var uniquevalue = new Date().getTime().toString() + Math.floor(Math.random()*100);
		return prefix + uniquevalue;

	}	
};

/******************************************************************************************************/

/*
 * onLibraryLoad
 * 
 */

AjaxTCR.onLibraryLoad = function(){
	
   if (AjaxTCR.util.DOM.enableDOMShorthand)
     {
      if (typeof($id) == "undefined") $id = AjaxTCR.util.DOM.getElementsById;
      if (typeof($class) == "undefined") $class = AjaxTCR.util.DOM.getElementsByClassName;  
      if (typeof($selector) == "undefined") $selector = AjaxTCR.util.DOM.getElementsBySelector;
      if (typeof($onload) == "undefined") $onload = AjaxTCR.util.event.addWindowLoadEvent;
     }


	if(navigator.userAgent.toLowerCase().indexOf("msie")>-1)
	 {
		if (window.location.hash && window.location.hash.substring(1) != AjaxTCR.history._currentState)
			var src = AjaxTCR.history._iframeSrc + "?hash=" + window.location.hash.substring(1);
		else
			var src = AjaxTCR.history._iframeSrc + "?hash=";
													
		document.write(  '<iframe id="ieFix"  src="' + src + '" style="visibility:hidden;" width="1px" height="1px"></iframe>');
	 }
	 
	 AjaxTCR.template._includeLibrary();
};

/* do any library load bindings */
AjaxTCR.onLibraryLoad();

