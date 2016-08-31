var isAndroid = -1 !== navigator.userAgent.toLowerCase().indexOf("android");
var _M = {};

!function(){
    // Ajax
    _M.ajax = function(options){
        //创建ajax对象
        var oAjax = new XMLHttpRequest;

        var cl = function(o){
            if(typeof(o)=='object'){
                var str='';
                for(a in o){
                    str+=a+'='+o[a]+'&';
                }
                str=str.substr(0,str.length-1);
                return str;
            }else{
                return o;
            }
        }
        //转接服务器
        if(options.param != undefined){
            oAjax.open(options.type,options.url+"?"+cl(options.param),true);
        }else{
            oAjax.open(options.type,options.url,true);
        }

        //发送请求
        oAjax.send();

        //返回
        oAjax.onreadystatechange=function(){
            if(oAjax.readyState == 4){		//判断读取状态
                if(oAjax.status == 200){	//判断返回
                    options.success(oAjax.responseText);
                }else{
                    console.info('提交异常!');
                }
            }
        }
    }
}();

/**
 * 获取URL参数
 * @param paramName
 * @returns
 */
function getURLParam(paramName) {
    var url = location.search.length ? location.search.substring("1") : "",
        params = url.length ? url.split("&") : [],
        temp,
        obj = {};
    for (var i=0, l=params.length; i<l; ++i) {
        temp = params[i].split("=");
        obj[temp[0]] = temp[1] || '';
    }
    return !!paramName ? obj[paramName] : obj;
}

/**
 * appCallBack("name",{},function(){});
 * @param methodName	与app商定好的一个名字
 * @param paramMap		传给app的参数
 * @param cb			回调函数
 */
function appCallBack(methodName, paramMap, cb) {
	//android js bridge
	!function(undefined) {
		var NAMESPACE = 'iBoxpay';
		var API_NAMESPACE="__JSBridge__";
		var context = window[NAMESPACE] = {};
		var api = window[API_NAMESPACE] || null;
		if (!api) {
			return;
			//return alert('发生错误, 未找到 api 对象!');
		}
		context.require = function(cmd, params, callback){
			params = params || '{}';
			var result = api.require(cmd, JSON.stringify(params));
			if(callback && result){
				result = JSON.parse(result);
				callback(result);
			}
		}
	}();
	var callbackName = 'cb' + (new Date().getTime());
	//TODO 加上token
	paramMap["callbackName"] = callbackName;
	var strJsonParam = JSON.stringify(paramMap);				
	var jsonResp = {};
	window[callbackName] = function (strResp) {
		try {
			jsonResp = !!strResp && strResp != 'undefine' && typeof strResp == "string"? JSON.parse(strResp) : strResp;
		} catch (err) {}
		cb(jsonResp);
		//执行回调后，删除跟回调方法相关的资源
		if (isAndroid) {
			delete window[callbackName];
		} else {
			$('#iframe_' + callbackName).remove();
		}
	};
	if (isAndroid) {
		iBoxpay.require(methodName, paramMap, function(msg) {
			//testMsg(msg.ret);
		});
	}
    else {
		var src = 'callFunction://'+methodName+'?callback='+callbackName+'&params=' + strJsonParam;
		$('<iframe id="iframe_' + callbackName + '"></iframe>').attr('src', src).hide().appendTo(document.body);
	}
}

//关闭页面
function appClose(){
    appCallBack("exit", '', function(resp) {
        console.log(resp);
    });
}

function bp(){
    var curWwwPath = window.document.location.href,pathName = window.document.location.pathname,pos = curWwwPath.indexOf(pathName),localhostPaht = curWwwPath.substring(0, pos), projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}