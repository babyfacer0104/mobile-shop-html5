/**
 * Created by wupeiying on 2016/2/18.
 */
function ajaxUrl(param){
    $.each(PURCHASE_MENU.items, function(i, v){
        if(param == v.rsId){
            $.router.load(v.default, true);
        }
    });
}

//获取URL参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return unescape(r[2]);
    return null;
}

//获取字符串参数
function GetUrlParam(url, name) {
    var reg = new RegExp("(^.+?)"+ name +"(\=)");
    var val = url.replace(reg, '');
    return val;
}

//获取字符串参数多个参数
function GetUrlParam2(url, name){
    var arr = [];
    var subArr = [];
    var subUrl = url.substr(url.indexOf('?')+1);
    arr = subUrl.split('&');
    for(var i=0;i<arr.length;i++){
        if(arr[i].indexOf(name)!=-1){
            subArr = arr[i].split('=');
            return subArr[1];
        }
    }
}

function htmlBind(){
    var me = $(document);
    //减
    me.on('click', '.detail-reduce', function(){
        var num = parseInt($(this).next().val());
        if(num == 2){
            $(this).css('color','#909090');
        }
        if(num == 1){
            num = num;
        }
        else{
            num -= 1;
            if(num < 4 && me.find('#detail-goodsType').val() == '1'){////////////临时活动的，活了2016年4月1号删掉！
                me.find('#detail-pack-active').hide();
                me.find('#detail-pack').show();
                me.find('#detail-active-toggle').hide();
            }
            //合计值减去
            var cartAccount = me.find('#cart-account').text();//获取合计值
            if(cartAccount != null){
                var cartPrice = $(this).attr('cartPrice').replace('¥', '');
                cartAccount = cartAccount.trim().replace('¥', '').replace(',','');
                var account = parseFloat(cartAccount*100)-parseFloat(cartPrice*100);//parseInt(cartAccount*100) - parseInt(cartPrice*100);
                me.find('#cart-account').html('<font class="cart-red">¥' + outputmoney(account/100) + '</font>');
            }
            //减去后，插入到购物车缓存数据
            if($(this).attr('cartId') != null){
                cartNumberSave($(this).attr('cartId'), 'reduce');
            }
        }
        $(this).next().val(num);
    });
    //加
    me.on('click', '#ar-detail, .detail-increase', function(){
        var num = parseInt($(this).prev().val());
        if(num > 0){//把减号变亮
            $(this).prev().prev().css('color','#5D5D5D');
        }
        num += 1;
        $(this).prev().val(num);//改变值

        if(num >= 4 && me.find('#detail-goodsType').val() == '1'){////////////临时活动的，活了2016年4月1号删掉！
            //me.find('#detail-pack-active').show();
            //me.find('#detail-pack-active').html('(20盒/箱，起始数量：4箱)');
            //me.find('#detail-pack').hide();
            me.find('#detail-active-toggle').show();
        }

        //合计值累加
        var cartAccount = me.find('#cart-account').text();//获取合计值
        if(cartAccount != null){
            var cartPrice = $(this).attr('cartPrice').replace('¥', '');
            cartAccount = cartAccount.trim().replace('¥', '').replace(',','');
            var account = parseFloat(cartAccount*100)+parseFloat(cartPrice*100);//parseInt(cartAccount*100) + parseInt(cartPrice*100);
            me.find('#cart-account').html('<font class="cart-red">¥' + outputmoney(account/100) + '</font>');
        }
        //累加后，插入到购物车缓存数据
        if($(this).attr('cartId') != null){
            cartNumberSave($(this).attr('cartId'), 'add');
        }
    });
    //加入购物车
    me.on('click', '#detail-addCart', function(){
        var id = me.find('#detail-Id').val();
        var purchaseNum = parseInt(me.find('.detail-text').val());
        var goodsType = me.find('#detail-goodsType').val();
        var goodsPic = me.find('#detail-goodsPic').val();
        var minPack = me.find('#detail-minPack').val();
        var goodsName = me.find('#goods-Name').text().trim();
        var goodsPack = me.find('#detail-pack').text().trim();
        var sendTime = me.find('#send-Time').text().trim();
        var totalPrice = me.find('#total-price').text().trim();
        var countPerPack = me.find('#detail-countPerPack').val();
        var postage = me.find('#detail-postage').val();

        var cartData = JSON.stringify({
            "goodsId": id,
            "purchaseNum": purchaseNum,
            "goodsType": goodsType,
            "goodsPic": goodsPic,
            "goodsName": goodsName,
            "goodsPack": goodsPack,
            "sendTime": sendTime,
            "totalPrice": totalPrice,
            "minPack": minPack,
            "countPerPack": countPerPack,
            "postage":postage
        });

        var flag = 0;//查询是否有重复 参数
        var gType_old = 0;
        var gType_new = 0;
        if(localStorage.length > 0){
            var ls_len = 1;
            var num = 0;
            var value = null;
            //查询是否有重复
            for(var i = 0; i < localStorage.length; i++){
                if(localStorage.key(i).indexOf('cartData') != -1 ){
                    var reg = /\d+/g;
                    var ms = parseInt(localStorage.key(i).match(reg)[0]);
                    //ls_len = localStorage.length+1;//无重复获取的累加ID值
                    ls_len = ms+1;//无重复获取的累加ID值djfhkjdfhjksd
                    value = localStorage.getItem(localStorage.key(i));
                    if(value != null){
                        var model = eval("("+value+")");
                        if(model.goodsId == id && model.goodsType == goodsType){
                            num = ms;//获得有重复的索引值
                            flag = 1;//获得有重复
                            localStorage.removeItem(localStorage.key(i));//'cartData' + (num)
                            cartData = JSON.stringify({
                                "goodsId": id,
                                "purchaseNum": purchaseNum + parseInt(model.purchaseNum),
                                "goodsType": goodsType,
                                "goodsPic": goodsPic,
                                "goodsName": goodsName,
                                "goodsPack": goodsPack,
                                "sendTime": sendTime,
                                "totalPrice": totalPrice,
                                "minPack": minPack,
                                "countPerPack": countPerPack,
                                "postage":postage
                            });
                        }
                        if(model.goodsType != goodsType){
                            flag = 2;//获得物品类型不一致
                            gType_old = model.goodsType;
                            gType_new = goodsType;
                        }
                    }
                }
            }


            if(flag == 0){//无重复
                localStorage.setItem('cartData' + (ls_len), cartData);
                $.toast("添加成功，在购物车等候亲~");
            }
            else if(flag == 2){
                $.toast("添加失败，购物车里有"+getGoodType(gType_old)+'不能添加'+getGoodType(gType_new));
            }
            else{//有重复
                localStorage.setItem('cartData' + num, cartData);
                $.toast("添加成功，在购物车等候亲~");
            }
        }
        else {
            localStorage.setItem('cartData1', cartData);
            $.toast("添加成功，在购物车等候亲~");
        }
    });

    //点击结算跳转页面
    me.on('click', '#cart-balance', function(){
        var buyType = sessionStorage.setItem('buyType',0);
        $.router.load(bp() + webUrlPath() + '/assets/scripts/app/address/default.html?price='+me.find('#cart-account').text().replace('¥','')+'&expressFee='+me.find('#expressMark').val(), true);
    });

    //立即购买跳转页面
    me.on('click', '#detail-buy', function(){
        var price = me.find('#detail-totalPrice').text().trim().replace('¥','');
        
        var id = me.find('#detail-Id').val();
        var purchaseNum = parseInt(me.find('.detail-text').val());
        var goodsType = me.find('#detail-goodsType').val();
        var goodsPic = me.find('#detail-goodsPic').val();
        var minPack = me.find('#detail-minPack').val();
        var goodsName = me.find('#goods-Name').text().trim();
        var goodsPack = me.find('#detail-pack').text().trim();
        var sendTime = me.find('#send-Time').text().trim();
        var totalPrice = me.find('#total-price').text().trim();
        var countPerPack = me.find('#detail-countPerPack').val();
        var standardUnit = me.find('#detail-standardUnit').val();
        var postage = me.find("#detail-postage").val();

        var cartData = JSON.stringify({
            "goodsId": id,
            "purchaseNum": purchaseNum,
            "goodsType": goodsType,
            "goodsPic": goodsPic,
            "goodsName": goodsName,
            "goodsPack": goodsPack,
            "sendTime": sendTime,
            "totalPrice": totalPrice,
            "minPack": minPack,
            "countPerPack": countPerPack,
            "standardUnit": standardUnit,
            "postage":postage
        });
        sessionStorage.setItem('cartData', cartData);

        var buyType = sessionStorage.setItem('buyType',1);
        $.router.load(bp() + webUrlPath() + '/assets/scripts/app/address/default.html?price=' + outputmoney(price*purchaseNum), true);
    });

    me.on('click', '#cart-del', function(){
        var id = $(this).attr('ascId');
        var buttons1 = [
            {
                text: '确定要删除这个宝贝吗？',
                label: true
            },
            {
                text: '确定',
                bold: true,
                color: 'danger',
                onClick: function() {
                    var divMain = me.find('#'+id);
                    localStorage.removeItem(id);
                    if(localStorage.length == 0){
                        me.find('#cart-balance').hide();
                    }
                    var price = parseInt($(divMain).find('#cart-total-price').html().trim().replace('¥','')*100) * $(divMain).find('.detail-text').val();//更新合计

                    var total = $('#cart-account').text().trim().replace('¥','').replace(',','');
                    var totalPrice = parseInt(total*100) - price;

                    var value1 = null;
                    var expressMark1 = $('#expressMark').val();
                    var postageArr1 = [];
                    for(var i=0;i<localStorage.length;i++){
                        if(localStorage.key(i).indexOf('cartData') != -1 ) {
                            value1 = localStorage.getItem(localStorage.key(i));
                            var model1 = eval("(" + value1 + ")");
                            postageArr1.push(model1.postage);
                        }
                    }
                    if(postageArr1.join('.').indexOf('0')!=-1){
                        expressMark1 = '0';
                    }else {
                        expressMark1 = '1';
                    }



                    $('#'+id).remove();

                    if(totalPrice < 1){
                        $('#cart-account').html('¥0');
                        $('#cart-balance').hide();
                    }
                    else{
                        $('#cart-account').html('¥'+outputmoney(totalPrice/100));
                        $('#expressMark').val(expressMark1);
                    }
                    $.toast('删除成功');
                }
            }
        ];
        var buttons2 = [
            {
                text: '取消',
                bg: 'danger'
            }
        ];
        var groups = [buttons1, buttons2];
        $.actions(groups);
    });

    me.on('keyup', '.detail-text', function(){
        var reg = /^\d*$/
        var val = $(this).val();
        if(!reg.test(val)){
            return $(this).val('');
        }
    });
    me.on('change', '.detail-text', function(){
        var val = $(this).val();
        if(val == '' || val == 0){
            return $(this).val(1);
        }
    });
    me.on('blur', '.detail-text', function(){
        var reg = /^\d*$/
        var val = $(this).val();
        if(val == '' || val == 0 || !reg.test(val)){
            return $(this).val(1);
        }
    });

    me.on('click', '#list-goodNo005', function(){
        sessionStorage.setItem('payType', -2);
        location.href = bp()+webUrlPath()+'/home.html?goodsType=1';//bp()+webUrlPath()+
    });
}

//购物车缓存数据累加减去数据操作
function cartNumberSave(cardId, numbers){
    var flag = false;//查询是否有重复 参数
    var ls_len = 0;//localStorage.length;
    var data = localStorage;
    var num = 0;
    var value = null;
    //查询是否有重复
    for(var i = 0; i < data.length; i++){
        //var value = localStorage.getItem('cartData' + (i+1));
        if(data.key(i).indexOf('cartData') != -1){
            value = data.getItem(data.key(i));
        }
        if(value != null){
            var model = eval("("+value+")");
            if(model.goodsId == cardId){
                var reg = /\d+/g;
                var ms = parseInt(localStorage.key(i).match(reg)[0]);
                ls_len = ms;
                num = ls_len;//获得有重复的索引值
                flag = true;//获得有重复
                localStorage.removeItem(localStorage.key(i));
                var purchaseNum = numbers == 'add' ? model.purchaseNum + 1 : model.purchaseNum - 1;
                var cartData = JSON.stringify({
                    "goodsId": cardId,
                    "purchaseNum": purchaseNum,
                    "goodsType": model.goodsType,
                    "goodsPic": model.goodsPic,
                    "goodsName": model.goodsName,
                    "goodsPack": model.goodsPack,
                    "sendTime": model.sendTime,
                    "totalPrice": model.totalPrice,
                    "minPack": model.minPack,
                    "countPerPack": model.countPerPack,
                    "postage":model.postage
                });
            }
        }
    }
    if(flag){
        localStorage.setItem('cartData' + num, cartData);
    }
}

function bp(){
    var curWwwPath = window.document.location.href,
        pathName = window.document.location.pathname,
        pos = curWwwPath.indexOf(pathName),
        localhostPaht = curWwwPath.substring(0, pos),
        projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}

//开发路径
//function webUrlPath(){
//    return '';
//}
//
//function serverUrlPath(){
//    return '/iboxpay-ktbao';
//}

//生产路径
function webUrlPath(){
    return '/webapp';
}

function serverUrlPath(){
    return '/ktb';
}

function getToken(){
    var token = GetQueryString('tikct');
    return token || '';
}
function getGoodsType(){
    var goodsType = GetQueryString('goodsType');
    return goodsType || '';
}

//关闭页面
function appClose(){
    appCallBack("exit", '', function(resp) {
        console.log(resp);
    });
}

//是否删除
function delOrderConfirm(val){
    var me = $(val).closest('article');
    var id = me.find('#hd-order-id').val();
    var orderNo = me.find('.order-sn').text();

    var buttons1 = [
        {
            text: '确定要取消【'+orderNo+'】订单吗？',
            label: true
        },
        {
            text: '确定',
            bold: true,
            color: 'danger',
            onClick: function() {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: serverUrlPath() + '/mall/cancelOrderH5',
                    data:{
                        access_token: sessionStorage.getItem('ktbToken'),
                        orderNo: orderNo,
                        ids: id
                    },
                    async: false,
                    success:function(res){
                        if(res.returnCode == 0){
                            delOrderListDetail(orderNo);
                            $.toast("取消成功");
                        }
                        else{
                            $.toast("取消失败");
                        }
                    }
                });
            }
        }
    ];
    var buttons2 = [
        {
            text: '取消',
            bg: 'danger'
        }
    ];
    var groups = [buttons1, buttons2];
    $.actions(groups);
}

function getOrderConfirm(val){
    var me = $(val).closest('article');
    var id = me.find('#hd-order-id').val();
    var orderNo = me.find('.order-sn').text();

    var buttons1 = [
        {
            text: '确定订单【'+orderNo+'】已收货？',
            label: true
        },
        {
            text: '确定',
            bold: true,
            color: 'danger',
            onClick: function() {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: serverUrlPath() + '/mall/confirmReceiveH5',
                    data:{
                        access_token: sessionStorage.getItem('ktbToken'),
                        orderNo: orderNo
                    },
                    async: false,
                    success:function(res){
                        if(res.returnCode == 0){
                            confirmOrderListDetail(orderNo);
                            $.toast("确定成功");
                        }
                        else{
                            $.toast("确定失败");
                        }
                    }
                });
            }
        }
    ];
    var buttons2 = [
        {
            text: '取消',
            bg: 'danger'
        }
    ];
    var groups = [buttons1, buttons2];
    $.actions(groups);
}

function delOrderListDetail(orderNo){
    var div_order = $('article[orderno="'+orderNo+'"]');
    var returnClass = getOrderStatus(5);
    $(div_order).find('.order-status').html(returnClass[1]);
    $(div_order).find('.order-status').removeClass('txt-orange');
    $(div_order).find('.order-status').addClass(returnClass[0]);
    $(div_order).find('.orderList-man a:first-child').hide();

    var orderData = $(div_order).find('.order_data').val();
    orderData = eval("("+orderData+")");
    orderData.orderStatus = 5;
    $(div_order).find('.order_data').val(JSON.stringify(orderData));
}

function confirmOrderListDetail(orderNo){
    var div_order = $('article[orderno="'+orderNo+'"]');
    var returnClass = getOrderStatus(3);
    $(div_order).find('.order-status').html(returnClass[1]);
    $(div_order).find('.order-status').removeClass('txt-orange');
    $(div_order).find('.order-status').addClass(returnClass[0]);
    $(div_order).find('.orderList-man a:first-child').hide();

    var orderData = $(div_order).find('.order_data').val();
    orderData = eval("("+orderData+")");
    orderData.orderStatus = 3;
    $(div_order).find('.order_data').val(JSON.stringify(orderData));
}

function outputmoney(number) {
    if (isNaN(number) || number == "") return "";
    number = Math.round(number * 100) / 100;
    if (number < 0)
        return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '') + outputcents(Math.abs(number) - 0);
    else
        return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
}
//格式化金额
function outputdollars(number) {
    if (number.length <= 3)
        return (number == '' ? '0' : number);
    else {
        var mod = number.length % 3;
        var output = (mod == 0 ? '' : (number.substring(0, mod)));
        for (i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0))
                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else
                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (output);
    }
}


function outputcents(amount) {
    amount = Math.round(((amount) - Math.floor(amount)) * 100);
    return (amount < 10 ? '.0' + amount : '.' + amount);
}

function getGoodType(val){
    switch (val)
    {
        case '0':
            val = 'POS机';
            break;
        case '1':
            val = '租机';
            break;
        case '2':
            val = '物料';
            break;
    }
    return val;
}