/**
 * Created by wupeiying on 2016/2/18.
 */
var PURCHASE_MENU = {
    rsId: 'menu.purchase',
    name: '产品购买',
    items: [{
        rsId: 'list',//列表
        default: bp()+webUrlPath()+'/assets/scripts/app/list/default.html'
    },{
        rsId: 'detail',//详情
        default: bp()+webUrlPath()+'/assets/scripts/app/detail/default.html'
    },{
        rsId: 'cart',//购物车
        default: bp()+webUrlPath()+'/assets/scripts/app/cart/default.html'
    },{
        rsId: 'address',//订单地址
        default: bp()+webUrlPath()+'/assets/scripts/app/address/default.html'
    },{
        rsId: 'orderlist',//订单列表
        default: bp()+webUrlPath()+'/assets/scripts/app/orderlist/default.html'
    }]
};