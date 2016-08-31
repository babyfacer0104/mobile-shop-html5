
if(navigator.userAgent.toLowerCase().indexOf("android")==-1){

var bridgeObj = null;
	
var addressElm = document.querySelector('[data-nativeevent=openAddressWindow]');
addressElm.addEventListener('click',openAddressWindow,false);

// ----------------根据客户端类型调用不同js-----------------
function openAddressWindow() {
	var osType = navigator.userAgent;
	if(osType.indexOf("Android") != -1) {
		__JSBridge__.openAddressWindow();
	}
	else if (osType.indexOf("iPhone") != -1) {
		bridgeObj.send("openAddressHandler", function(responseData) {
		});
	}
	else{
		return;
	}
}

function setAddress(json) {
	var addressList = document.getElementById('addressList');
	var addressCodeId = document.getElementById("addressCodeId");
	var addressNameId = document.getElementById("addressNameId");
	var jsonData = JSON.parse(json);
	if(jsonData != "") {
		if(jsonData.addressName.indexOf(",") != -1) {
			addressList.value = jsonData.addressName.replace(/,/g, "");
		} else {
			addressList.value = jsonData.addressName;
		}
		addressCodeId.value = jsonData.addressCode;
		addressNameId.value = jsonData.addressName;
	}
} 

// -----------------ios使用js 开始-------------------
function connectWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		callback(WebViewJavascriptBridge);
	} else {
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			callback(WebViewJavascriptBridge);
		}, false);
	}
}
	
connectWebViewJavascriptBridge(function(bridge) {
	bridgeObj = bridge;
	
	bridge.init(function(message, responseCallback) {
		var data = { 'response':'init' };
		responseCallback(data);
	});

	bridge.registerHandler('openAddressHandler', function(data, responseCallback) {
		setIosAddress(data);
		var responseData = { 'request':'receive succ' };
		responseCallback(responseData);
	});
});
}
// -----------------ios使用js 结束-------------------

function setIosAddress(data) {
	var addressList = document.getElementById('addressList');
	var addressCodeId = document.getElementById("addressCodeId");
	var addressNameId = document.getElementById("addressNameId");
	if(data != null) {
		if(data.addressName.indexOf(",") != -1) {
			addressList.value = data.addressName.replace(/,/g, "");
		} else {
			addressList.value = data.addressName;
		}
		if(data.addressCode.indexOf(",") == -1) {
			addressCodeId.value = data.addressCode.substring(0,2) + "," + data.addressCode.substring(2,4) +"," + data.addressCode.substring(4,6);
			
		} else {
			addressCodeId.value = data.addressCode;
		}
		addressNameId.value = data.addressName;
	}
}
