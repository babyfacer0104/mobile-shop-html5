/**
 *
 * @authors TANK.D (dengxiaochao@iboxpay.com)
 * @date    2014-05-20
 * @version $V0.1.1$
 */

var Validate = function(obj,callback){
    var _this = this;
    this.validateItems =    obj.items;
    this.submitBtn =        obj.btn;
    this.breakpoint =       false; //是否继续验证
    this.validRecord = {};      //验证结果记录
    var submitType =       this.submitBtn.getAttribute('data-validEvent');

    (function(){    //生成交互提示条
        var promptType = obj.promptType === undefined ? 'top' : obj.promptType;   //modal
        var div = document.createElement('div');
            div.className = 'prompt-popup '+promptType;
            div.style.display = 'none';
            document.body.appendChild(div);

        return _this.prompt = div;
    })();

    this.packageObj(function(arr,index){
        _this.validateItems[index].addEventListener('blur',function(){
            _this.isValid(this,arr);
        });
        //验证类型记录
        //this.checkRecord[index] = checkName;
        //创建验证记录
        _this.validRecord[_this.validateItems[index].name] = [];
        //监听验证框获得焦点时隐藏[错误提示]
        _this.validateItems[index].addEventListener('click',function(){ 
            _this.prompt.style.display = "none";
        });
    });
    //【提交按钮】监听点击绑定事件
    this.submitBtn.addEventListener('click',function(){_this.submitCheck(submitType,_this.validRecord,callback);});
};
//组装待验证对象
Validate.prototype.packageObj = function(callback){
    //debugger;
    for(var i=0, len = this.validateItems.length; i < len;){
        var getValidTxt = this.validateItems[i].getAttribute('data-validtype');
        var handleStr = function(str){
            if(str.indexOf('[') == -1){
                return str;
            }else{
                var parts = /^(.+?)\[(.+)\]$/.exec(str);
                return [parts[1],parts[2]];
            }
        };
        if(getValidTxt !== ""){
            var checkArr = [];
            if(getValidTxt.indexOf('|') != -1){
                var r = getValidTxt.split('|');
                for(var j=0,eLen=r.length;j<eLen; j++){
                    checkArr[j] = handleStr(r[j]);
                }
            }else{
                checkArr[0] =  handleStr(getValidTxt);
            }
            callback(checkArr,i);
        }
        if(!this.breakpoint){i++;}else{break;}
    }
};

Validate.prototype.check = function(){
    return {        //验证体
        required:{
            validator:function(value) {
                if(value!==''){
                    return true;
                }
            },
            message:'必填项不能为空'
        },
        length:{
            validator: function(value, param) {
                if (value.length < param[0] || value.length > param[1]) {
                    this.message = '请输入长度必须在' + param[0] + '至' + param[1] + '范围';
                    return false;
                }else{
                    return true;
                }
            },
            message:''
        },
        range:{
            validator: function(value, param) {
                if (value < param[0]) {
                    this.message = '订货数量不能少于起订量';
                    return false;
                } else if (value > param[1]) {
                    this.message = '订货数量太多，不能大于限定量';
                    return false;
                } else{
                	var regex_pattern="^[0-9]*[1-9][0-9]*$"; 
                	var re =  new  RegExp(regex_pattern); 
	            	if(value.match(re)==null) {
	            	    this.message = '非法输入';
	                    return false;
	            	}
                    return true;
                }
            },
            message:''
        },
        minLength : { // 判断最小长度
            validator : function(value, param) {
                this.message = '最少输入' + param[0] + '个字符。';
                return value.length >= param[0];
            },
            message : ''
        },
        integer : {// 验证整数
            validator : function(value) {
                return /^[+]?[1-9]+\d*$/i.test(value);
            },
            message : '请输入整数'
        },
        number: {
            validator: function (value, param) {
                return /^\d+$/.test(value);
            },
            message: '请输入数字'
        },
        tel_phone: {
            validator : function(value){
                return /^[+]?([0-9\-]{10,11})+\d*$/i.test(value);
            },
            message: '请输入正确的电话/手机号码'
        },
        chinese : {// 验证中文
            validator : function(value) {
                return /^[\u0391-\uFFE5]+$/i.test(value);
            },
            message : '请输入中文'
        },
        isSelected:{
            validator: function(value, param){
                if(value == param[0]){
                    this.message = param[1];
                    return false;
                }else{
                    return true;
                }
            },
            message:''
        },
        minusMoney:{
            validator: function (value) {
                return /^\d+$/.test(value) && value>0;
            },
            message: '请输入大于0的数字'
        },
        mobile:{
            validator: function(value) {
                var length = value.length,
                    mobile_reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[067])|(18[0-9]{1}))+\d{8})$/;
                return length == 11 && mobile_reg.test(value);
            },
            message: '请输入正确的电话号码'
        }
    };
};
//设置表单事件监听
Validate.prototype.isValid = function(that,checkItem){
    var value = that.value;
    var required = that.getAttribute('data-required') !== null;
    var promptTxt = "";
    var result;
    if(required || value !== ""){
        for(var i= 0,len=checkItem.length; i<len;i++){
            if(typeof checkItem[i] == "string"){
                var vStr = new this.check()[checkItem[i]];
                    result = vStr.validator(value);
                    promptTxt = vStr.message;
                console.info(''+checkItem[i]+'[value] :'+ ' ['+value+']');
            }else{
                var param = eval('['+checkItem[i][1]+']');
                var vArr = new this.check()[checkItem[i][0]];
                    result = vArr.validator(value,param);
                    promptTxt = vArr.message;
                console.info(''+checkItem[i][0]+'['+param+'] :'+ ' ['+value+']');
            }
            //将验证结果显示到页面
            return this.validRecord[that.name] = [result,promptTxt];
        }
    }else{
        return [true,''];
    }
};
// 表单验证检查
Validate.prototype.submitCheck = function(type,result,callback) {
    if(this.submitBtn.classList.contains('disabled')) return;

    var _this = this;
    var validFlag = true;

    this.packageObj(function(arr,index){
        var isPass = _this.isValid(_this.validateItems[index],arr);
        if(!isPass[0]){
            _this.breakpoint = true;
            _this.prompt.innerText = isPass[1];
            _this.prompt.style.display = 'block';
            validFlag = false;
        }else{
            _this.breakpoint = false;
            _this.prompt.style.display = 'none';
        }
    });

    if (validFlag) {
        callback(_this);
    }else{
        return false;
    }
};

Validate.prototype.len=function(s){//获取字符串的字节长度
    s=String(s);
    return s.length+(s.match(/[^\x00-\xff]/g) ||"").length;//加上匹配到的全角字符长度
};