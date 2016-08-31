/**
 * Created by wupeiying on 2016/3/3.
 */

//立即开通
var isAndroid = -1 !== navigator.userAgent.toLowerCase().indexOf("android");
function callApp(methodName,paramMap,cb){
    //android js bridge
    !function(undefined){
        var NAMESPACE = 'iBoxpay';
        var API_NAMESPACE="__JSBridge__";
        var context = window[NAMESPACE] = {};
        var api = window[API_NAMESPACE] || null;
        //console.log("api============="+api+"         "+JSON.stringify(api)+"         ="+api.require);
        if(!api){
            return;
            //return alert('发生错误, 未找到 api 对象!');
        }
        context.require = function(cmd, params, callback){
            params = params || '{}';
            //	console.log("api.require========="+api.require);
            var result = api.require(cmd, JSON.stringify(params));
            if(callback && result){
                result = JSON.parse(result);
                callback(result);
            }
        }
    }();
    var callbackName = 'cb' + (new Date().getTime());
    //TODO 加上token
    paramMap["callbackName"]=callbackName;
    var strJsonParam = JSON.stringify(paramMap);
    var jsonResp = {};
    window[callbackName] = function (strResp) {
        try{
            jsonResp =typeof strResp == "string"? JSON.parse(strResp):strResp;
        }catch (err) {}
        cb(jsonResp);
        //执行回调后，删除跟回调方法相关的资源
        if(isAndroid) {
            delete window[callbackName];
        }else {
            $('#iframe_' + callbackName).remove();
        }
    };
    if (isAndroid) {
        //console.log("打印的了.............."+methodName+"     "+JSON.stringify(paramMap)+"      ========");
        iBoxpay.require(methodName,paramMap,function(msg){
            //console.log("msg=========="+msg);
            //testMsg(msg.ret);
        });

    } else {
        var src = 'callFunction://'+methodName+'?callback='+callbackName+'&params=' + strJsonParam;
        $('<iframe id="iframe_' + callbackName + '"></iframe>').attr('src', src).hide().appendTo(document.body);
    }

}

function callAppNative(){
    if(!isAndroid)return;
    callApp('openAddressHandler', {}, function (json) {
        var addressList = document.getElementById('addressList');
        var addressCodeId = document.getElementById("addressCodeId");
        var addressNameId = document.getElementById("addressNameId");
        var jsonData = typeof json =="string"?JSON.parse(json):json;
        if(jsonData != "") {
            if(jsonData.addressName.indexOf(",") != -1) {
                addressList.value = jsonData.addressName.replace(/,/g, "");
            } else {
                addressList.value = jsonData.addressName;
            }
            addressCodeId.value = jsonData.addressCode;
            addressNameId.value = jsonData.addressName;
        }
    });
}


var totalPrice = $('#hd-address-price').val();
$('#totalCost').html('¥'+totalPrice);
$('#pay-money').html('¥'+totalPrice);

//查询当前用户地址历史记录
$.ajax({
    type: 'GET',
    async: false,
    //dataType: 'json',
    url: serverUrlPath() + '/mall/getReceiveAddressH5',
    data: {
        access_token: sessionStorage.getItem('ktbToken')
    },
    success: function(resp){
        var model = resp.result;
        if(resp.returnCode == 0 && _.size(model) > 0){
            $('#receiver').val(model.receiverName == undefined ? '' : model.receiverName);
            $('#receiverMobile').val(model.receiverMobile == undefined ? '' : model.receiverMobile);
            $('#addressList').val(model.formatAddressName == undefined ? '' : model.formatAddressName);
            $('#addressCodeId').val(model.addressCode == undefined ? '' : model.addressCode);
            $('#addressNameId').val(model.addressName == undefined ? '' : model.addressName);
            $('#receiveAddr').val(model.detailAddress == undefined ? '' : model.detailAddress);

            if(resp.result.oprStatus && resp.result.oprStatus != '0'){
                $('#oprStatusTips').show();
                $('#foot .submit-btn').addClass('disabled');
            }
        }
    }
});



function closePayView(){
    $('#pay-group').hide();
    $('#address-group').show();
    $.router.load(bp() + webUrlPath() + '/assets/scripts/app/list/default.html', false);
}

//所有支付按钮
$("#offLinePay, #zfbPay, #qhPay").on('click', function() {
    var _t = $(this);
    console.log('zfbPay is disabled:',_t.hasClass('disabled'));
    if(_t.hasClass('disabled'))return;

    var payWay = parseInt(_t.attr('payway'));
    var receiver = document.getElementById("receiver").value;
    var receiverMobile = document.getElementById("receiverMobile").value;
    var receiveAddr = document.getElementById("receiveAddr").value;
    var addressCode = document.getElementById("addressCodeId").value;
    var addressName = document.getElementById("addressNameId").value;


    //购物车的缓存数据
    var data = localStorage;
    var value = null;

    var postageArr = [];
    var expressFee = '0';    //是否到付
    //循环数据
    var cartData = [];
    var buyType = sessionStorage.getItem("buyType");//GetQueryString('buyType');
    if(buyType == 1){//立即购买的缓存数据
        var goodsList = sessionStorage.getItem("cartData");
        if(goodsList.length > 0){
            var model = eval("(" + goodsList + ")");
            var json = {
                "goodsId": model.goodsId,
                "purchaseNum": model.purchaseNum
            };
            cartData.push(json);
            if(model.postage){
                postageArr.push(model.postage);
            }
        }
    }
    else{
        for(var i = 0; i < data.length; i++){
            if(data.key(i).indexOf('cartData') != -1 ) {
                value = data.getItem(data.key(i));//localStorage.getItem('cartData' + (i + 1));
                if (value != null) {
                    var model = eval("(" + value + ")");
                    var json = {
                        "goodsId": model.goodsId,
                        "purchaseNum": model.purchaseNum
                    };
                    cartData.push(json);
                    if(model.postage){
                        postageArr.push(model.postage);
                    }
                }
            }
        }
    }

    if(postageArr != [] ) {
        var testArr = [];
        for(var i=0; i < postageArr.length; i++) {
            testArr.push(1);
        }
        if(postageArr.join('.') == testArr.join('.')) {
            expressFee = '1';
        }
    }

    /*if(postageArr.join('.').indexOf('0') != -1){
        expressFee = '0';
    }*/

    var json = {
        access_token: sessionStorage.getItem('ktbToken'),
        goodsData: JSON.stringify(cartData),
        receiver: receiver,
        receiverMobile: receiverMobile,
        receiverPhone: '',
        addressName: addressName,
        addressCode: addressCode,
        receiveAddr: receiveAddr,
        paymethod: payWay,
        expressFee: expressFee

    };
    //alert(cartData);
    $.ajax({
        type: 'POST',
        dataType: 'json',
        async: false,
        url: serverUrlPath() + "/mall/submitOrderH5",
        data: json,
        success: function(data) {
            var code = data.returnCode;
            var totalPrice_new = totalPrice.replace(',','') * 100;
            //alert(code);
            if(code == 0){
                if(payWay == 2){//ali
                    var sendData = {orderNO: data.result.orderNo, orderAmount: totalPrice_new}
                    appCallBack("startAlipay", sendData, function(resp) {
                        if(resp.returnCode){
                            if(buyType == 0){
                                clearCart();
                            }
                            $.router.load(bp() + webUrlPath() + '/assets/scripts/app/orderlist/default.html', true);
                        }
                        else{
                            $.toast(resp.returnMsg);
                        }
                    });
                }
                else if(payWay == 4){//offline
                    if(buyType == 0){
                        clearCart();
                    }
                    $.router.load(bp() + webUrlPath() + '/assets/scripts/app/pay/success.html?orderNo='+data.result.orderNo, true);
                }
                else if(payWay == 1){//cash
                    var sendData = {orderNO: data.result.orderNo, orderAmount: totalPrice_new}
                    appCallBack("startCashPay", sendData, function(resp) {
                        if(resp.returnCode){
                            if(buyType == 0){
                                clearCart();
                            }
                            $.router.load(bp() + webUrlPath() + '/assets/scripts/app/orderlist/default.html', true);//true为不缓存 能看到刚下单的数据
                        }
                        else{
                            $.toast(resp.returnMsg);
                        }
                    });
                }
            }
            else{
                $.toast('支付失败.');
                $.router.load(bp() + webUrlPath() + '/assets/scripts/app/pay/fail.html', true);
            }
        }
    });
    //$('#pay-group').hide();
    //$('#address-group').show();
});

$('#address-pull-left').attr('href', bp()+webUrlPath()+'/assets/scripts/app/list/default.html');

//清空购物车
function clearCart(){
    localStorage.clear();
}