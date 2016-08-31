/**
 * Created by wupeiying on 2016/3/7.
 */

//分页插件
$(function(){
    var scroll_flag=null;
    var i_c = 0;
    function loadInsuranceList(){
        $.ajax({
            type: 'GET',
            url: serverUrlPath()+'/mall/findOrderListH5?currentNumber='+i_c+'&access_token=' + sessionStorage.getItem('ktbToken'),
            async: false,
            success: function(resp){
                var mallOrderList = '';
                var orderList = '';
                var html = '';
                if(resp.returnCode == 0){
                    mallOrderList = resp.result.mallOrderList;
                    orderList = resp.result;
                    if(mallOrderList != ''){
                        //$('#content a:last-child').children().css('margin', '4% 0 0 3%');
                        $('#content').find('#div-loading').remove();
                        var orderModel = null;
                        _.each(mallOrderList, function(v, i) {
                            if (typeof orderList[mallOrderList[i].orderNo] == 'object') {
                                orderModel = orderList[mallOrderList[i].orderNo];
                                html += ['<article style="background-color: #ffffff;" orderNo="' + v.orderNo + '">',
                                    '<div class="order-status-info xst">',
                                    '<div style="float: left; padding-left:25px; line-height:30px;">',
                                    '订单编号:<span class="order-sn">' + v.orderNo + '</span>',
                                    '</div>',
                                    '<div style="float: right; line-height:30px; padding-right:10px;" onclick="showInstruction(' + v.orderNo + ')">',
                                    '<input type="hidden" id="hd-order-id" value="' + v.id + '" />',
                                    '<input type="hidden" class="hd-order-payMethod" value="' + v.paymethod + '" />',
                                    '<span class="order-status ' + getOrderStatus(v.orderStatus)[0] + '">' + getOrderStatus(v.orderStatus)[1] + '</span>',
                                    '<a href="javascript:void(0)" class="remittance-instruction txt-orange">(说明)</a>',
                                    '<span class="order-payMethod">' + showPayMethodFormatter(v.orderStatus, v.paymethod) + '</span>',
                                    '</div>',
                                    '<input type="hidden" class="order_data" value="{"id": '+v.id+',"orderNo": "'+v.orderNo+'","createTimeToFormat": "'+v.createTimeToFormat+'","orderStatus": '+v.orderStatus+',"totalNumber": '+v.totalNumber+',"realPayPrice": '+v.realPayPrice+',"receiver": "'+v.receiver+'","receiverMobile": "'+v.receiverMobile+'","goodsType": "'+v.goodstype+'","receiveAddr": "'+v.receiveProvince+''+v.receiveCity+''+v.receiveArea+' '+v.receiveAddr+'","expressNo": "'+v.expressNo+'"}">',
                                    '</div>',
                                    '<div class="product-detail" onclick="clickDetailPage()">'].join('');
                                _.each(orderModel, function(v, i){
                                    if(v.goodsType == 1){
                                        html += ['<div style="margin-bottom: 5px;">',
                                            '<a><i style="background-image:url(' + v.goodsPic + ');"></i>&nbsp;<span class="st" style="top: 5px">' + v.goodsName + '</span>&nbsp;&nbsp;<span class="xst tg" style="top: 5px">(' + v.countPerPack + '盒/箱)</span>',
                                            '<div style="background-color: #fecf4d;color: #C62B2B;width: 80px;height:30px;line-height:30px;margin-top:10px;border-radius: 2px;text-align: center">有偿租机</div>',
                                            '</a>',
                                            '<a class="tr">',
                                            '<span class="st rt">' + v.salesPrice + '</span><br>',
                                            '<span class="st tg">x&nbsp;' + v.purchaseNum + '</span>',
                                            '</a>',
                                            '</div>'].join('');
                                    }
                                    else{
                                        html += ['<div style="margin-bottom: 5px;">',
                                            '<a><i style="background-image:url(' + v.goodsPic + ');"></i>&nbsp;<span class="st">' + v.goodsName + '</span>&nbsp;&nbsp;<span class="xst tg">(' + v.countPerPack + '盒/箱)</span></a>',
                                            '<a class="tr">',
                                            '<span class="st rt">' + v.salesPrice + '</span><br>',
                                            '<span class="st tg">x&nbsp;' + v.purchaseNum + '</span>',
                                            '</a>',
                                            '</div>'].join('');
                                    }
                                });
                                html += ['</div>',
                                    '<div class="section">',
                                    '<div class="section-row">',
                                    '<div class="v-top" style="float: left;">',
                                    '运费&nbsp;&nbsp;<span class="txt-red">¥0</span>',
                                    '</div>',
                                    '<div class="tr" style="float: right;">',
                                    '合计&nbsp;&nbsp;<span class="txt-red" id="totalCost">¥' + v.realPayPrice / 100 + '</span>',
                                    '</div>',
                                    '</div>',
                                    '<div class="orderList-man">'].join('');
                                if(v.orderStatus == 0){
                                    html += ['<a href="javascript:void(0)" onclick="delOrderConfirm($(this))">',
                                        '<span>取消订单</span>',
                                        '</a>'].join('');
                            }else if(v.orderStatus == 2){
                                html += ['<a href="javascript:void(0)" onclick="getOrderConfirm($(this))">',
                                    '<span>确定收货</span>',
                                    '</a>'].join('');
                            }
                            html += ['</div>',
                                '</div>',
                                '</article>'].join('');

                            }
                        });
                        $('#content').append(html);
                    }
                    else{
                        //$('#content a:last-child').children().css('margin', '4% 0 2rem 3%');
                        $('#content').find('#div-loading').remove();
                        $('#content').append('<div id="div-loading" style="width: 100%; height: 50px; font-size: 13px; text-align: center;">' +
                        '<font style="font-size: 13px;display: block;color: #717171;">已加载完</font></div>');
                    }
                }
            }
        });
        scroll_flag=false;
    }
    //翻页
    //获取移动的距离y
    function getPosY(e){
        e=e.changedTouches[0];
        var y;
        try{
            y=e.pageY;
        }
        catch(e){

        }
        return y;
    }

    var _d=10;
    function getBottom(obj){
        var st=document.documentElement.scrollTop||document.body.scrollTop;
        return obj.offsetHeight-document.documentElement.clientHeight-st;
    }
    function bindScroll(obj,fn){
        var initY=0,endY=0;
        obj.on("touchstart",function(e){
            initY=getPosY(e);
        });
        obj.on("touchmove",function(e){
            endY=getPosY(e);
            var d=initY-endY;
            if(d<0 || Math.abs(d)<_d){
                return;
            }
            if(getBottom(obj[0])<0){
                if(scroll_flag)return;
                scroll_flag=true;
                $('#div-loading').html('正在加载......');
                setTimeout(function(){
                    if(fn)fn();
                },300);
            }
        });
    }

    bindScroll($("#content"),function(){
        i_c+=1,loadInsuranceList();//修改当前页数,调用加载数据的方法
    });
})

function showPayMethodFormatter(val, paymethod){
    var PAYMETHOD_MAP = {
        0: '',
        1: '&nbsp;&nbsp;<img style="width: 23px;" src="'+bp()+webUrlPath()+'/assets/images/qianhe.png" />',//刷卡支付
        2: '&nbsp;&nbsp;<img style="width: 23px;" src="'+bp()+webUrlPath()+'/assets/images/alipay-light.png" />',//支付宝
        3: '&nbsp;&nbsp;<img style="width: 23px;" src="'+bp()+webUrlPath()+'/assets/images/weixin-paymethod.png" />',//'微信'
        4: '&nbsp;&nbsp;<img style="width: 23px;" src="'+bp()+webUrlPath()+'/assets/images/pay.png" />'//线下转账
    };
    return PAYMETHOD_MAP[paymethod] || '';
}

//点击弹框
function showInstruction(orderNo){
    $('.instruction-overlay').show();
    $('.instruction-overlay').find('.order span').html(orderNo);
}

function clickDetailPage(val){//我的订单 列表进详情
    var orderData = $(val).closest('article').find('.order_data').val();
    sessionStorage.setItem('order_data', orderData);
    $.router.load(bp() + webUrlPath() + '/assets/scripts/app/orderlist/detail.html', true);
    // $.showPreloader();
    //$.ajax({
    //    type: 'GET',
    //    async: false,
    //    url: bp() + webUrlPath() + '/assets/scripts/app/orderlist/detail.html',
    //    success: function(res){
    //        var data = eval("(" + orderData + ")");
    //        setTimeout(function () {
    //            $.hidePreloader();
    //            var t = _.template(res);
    //            $('.page-current').html(t(data));
    //        }, 300);
    //    }
    //});
}

function getOrderStatus(orderStatus) {
//         	0：待付款 1：待发货 2:配送中 3:已签收 4:收货人拒收 5:订单取消
    orderStatus = parseInt(orderStatus);

    switch (orderStatus) {
        case 0:
            return ["txt-orange","待付款"];
            break;
        case 1:
            return ["txt-orange","待发货"];
            break;
        case 2:
            return ["txt-orange","配送中"];
            break;
        case 3:
            return ["txt-green3","已签收"];
            break;
        case 4:
            return ["txt-red","收货人拒收"];
            break;
        case 5:
            return ["txt-red","订单取消"];
            break;
        case 6:
            return ["txt-orange","配送中"];
            break;
        default: return ["txt-orange","未支付"];
            break;
    }
}
var zIndex=9999;
var Mask=function(){function a(c,d,b){this._oMask=null;this._selector=c;this._body=null;this._zIndex=9999;this._position=b||"absolute";this._height=d||"100%";this.className=""}a.prototype._getBody=function(){if(this._selector){this._body=$(this._selector)}return this._body};a.prototype._createMask=function(b){if(!this._selector){return}if(!b){b="_temp_mask"+(+new Date)}this.className=b;this._getBody();if($(this._selector+" > ."+b).length<1){this._oMask=$("<div class='"+b+"'></div>").css({width:"100%",height:Math.max(document.documentElement.offsetHeight,$(window).height())+"px",position:this._position,top:"0px",zIndex:(this._zIndex=zIndex),opacity:".3",background:"#000000",filter:"alpha(opacity=30)"});this._body.css({"overflow":"hidden"}).append(this._oMask);zIndex+=5}};a.prototype._removeMask=function(b){$("."+this.className).remove();this._body.css({"overflow":"auto"});zIndex-=5};a.prototype._getStyle=function(c,b){return c.currentStyle?c.currentStyle[b]:window.getComputedStyle(c)[b]};a.prototype._showDialog=function(n,j,c,f){var d=$("#"+n);if(!d){return}this._createMask();d.show();var k=parseInt(this._getStyle(d[0],"width")),i=parseInt(this._getStyle(d[0],"height")),g=$(window).width(),b=$(window).height(),e=k>g?0:(g-k)/2,m=i>b?0:(b-i)/2;d.css({position:"absolute",left:e+"px",top:m+"px",zIndex:this._zIndex+1});!c||(_mySelectFn._getData.apply(this,arguments.splice(1)));return d};return function(c,d,b){return new a(c,d,b)}}();
function myAlert(c,b){c||(c="");var a=new Mask("body");a._createMask();$("body").append("<div class='__pop' style='position:fixed;left:50%;top:50%;width:218px;height:113px;border-radius:8px;background:#f8f8f8;text-align:center;font-size:16px;color:#686868;line-height:1.5;margin:-64px 0 0 -114px;padding-top:35px;z-index:"+(a._zIndex+1)+";'><p>"+c+"</p></div>");setTimeout(function(){a._removeMask();$(".__pop").remove();if(b){b()}},7000)};
function _myConfirm(e,d){var a=new Mask("body"),b="click tap";a._createMask();function c(){$(".__confirmpop").remove();a._removeMask()}e.css({"z-index":a._zIndex+1});$("body").append(e);$(".__confirmpop .ok").on(b,function(){if(d&&d()){c()}return true});$(".__confirmpop .cancel").on(b,function(){c();return false})};
function _myConfirmHorizonal(e,h,c,f){h=h||"提示";c=c||"确定";f=f||"取消";var a="position:fixed;width:350px;height:150px;left:50%;top:50%;margin-left: -175px;margin-top:-75px;bottom: 20px;font-size:16px; ",b="width:100%;height:99px;background-color:#ffffff;text-align:center;border-radius:5px 5px 0px 0px;border-bottom:1px solid #C8C7CC;",d="height:50px;background-color:#ffffff;line-height:50px;text-align:center;cursor:pointer;",g=$('<div class="__confirmpop" style="'+a+'"><div style="'+b+'border-radius:5px 5px 0px 0px;"><span style="position:relative;top:20px;">'+h+'</span></div><div class="ok" style="'+d+'border-radius:0px 0px 0px 5px;float:left;border-right:1px solid #C8C7CC;width:49.5%;">'+c+'</div><div class="cancel" style="'+d+'border-radius:0px 0px 5px 0px;float:right;width:50%;">'+f+"</div></div>");_myConfirm(g,e)};
