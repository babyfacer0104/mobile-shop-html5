/**
 * Created by wupeiying on 2016/3/11.
 */
//分页插件
$(function(){
    var scroll_flag=null;
    //var goodNum = 10;
    var i_c = 0;
    function loadInsuranceList(){
        $.ajax({
            type: 'GET',
            url: serverUrlPath()+'/mall/redirectToGoodsListH5?currentNumber='+i_c+'&goodsType='+sessionStorage.getItem('goodsType')+'&number=20',
            async: false,
            success: function(resp){
                var goods = resp.result;
                var html = '';
                if(resp.result != ''){
                    _.each(goods, function(v, i){
                        //$('#content a:last-child').children().css('margin', '4% 0 0 3%');
                        //$('#content').find('#div-loading').remove();
                        html += ['<a href="'+bp()+webUrlPath()+'/assets/scripts/app/detail/default.html?goodsNo='+v.goodsNo+'">',
                        '<div class="goods-rows">',
                            '<div class="goods-col col-50">',
                                '<div valign="bottom" class="card-header color-white no-border no-padding">',
                                    '<img class="card-cover" src="'+v.goodsPic+'" style="width: 8.875rem; height: 8.875rem;">',
                                '</div>',
                                '<div class="card-content">',
                                    '<div class="card-content-inner" style="height: 2.688rem;">',
                                        '<p class="purchase-glay font26"><b>'+v.goodsName+'</b></p>',
                                    '</div>',
                                 '</div>',
                                    '<div class="card-content">',
                                        '<div class="card-content-inner">',
                                            '<p class="purchase-orange"><b>¥'+v.totalPrice+'</b></p>',
                                        '</div>',
                                    '</div>',
                            '</div>',
                        '</div>',
                        '</a>'].join('');
                    });
                    $('#content').append(html);
                }
                else{
                    //$('#content a:last-child').children().css('margin', '4% 0 2rem 3%');
                    //$('#content').find('#div-loading').remove();
                    //$('#content').append('<div id="div-loading" style="width: 100%; height: 65px; font-size: 13px; text-align: center; bottom: 0;position: fixed;">' +
                    //'<font style="font-size: 13px;display: block;color: #717171;">已加载完</font></div>');
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
                //$('#div-loading').html('正在加载......');
                setTimeout(function(){
                    if(fn)fn();
                },300);

            }
        });
    }

    bindScroll($("#content"),function(){
        i_c+=1,loadInsuranceList();//修改当前页数,调用加载数据的方法
    });


    var gsType = sessionStorage.getItem('goodsType');
    if(gsType == '2'){
        $('#title').html('<b>买物料</b>');
    }
    else{
        $('#title').html('<b>买pos</b>');
    }
})