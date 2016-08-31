<%@include file="htmlHead.jsp"%>
<meta content="telephone=no" name="format-detection">
<style>
	.picSpan {width: 60%;min-height: 100px;margin: 100px auto 0;}
	.picSpan img {max-width: 100%;border: 1px solid #eee;}
	.text-center {text-align: center;}
	.title {}
</style>
</head>

<body onload="document.title = '微信支付'">
<div class="main-container">
	<div class="picSpan">
		<h4 class="ot">订单号：</h4>
		<div id="orderNo" class="ot" style="margin: 10px 0;"></div>
		<img src="" id="wxPayPic">
	</div>
</div>

<div class="prompt-popup top err-msg" style="display: none;"></div>

<script type="text/javascript" src="${pageContext.request.contextPath}/mall/js/zepto.min.js"></script>
<script type="text/javascript">
$(function() {
	function init() {
		var param = getURLParam() || {};
		var pic = param["picUrl"];
		var orderNo = decodeURI(param["orderNo"]);
		
		$("#orderNo").html(orderNo);
		if (pic) {
			$("#wxPayPic").attr("src", Jsp.basePath + "/getTfsImage?tfsUrl="+decodeURI(pic));
			
			window.setTimeout(function() {
				checkPay(orderNo);
			}, 10000);
		} else {
			showErrorMsg("二维码已过期，请重新下单");
		}
	}
	
	init();
	
	function checkPay(orderNo) {
		$.ajax({
			type: 'POST',
			url: Jsp.basePath + "/weixin/notify",
			data: {orderNo: orderNo},
			success: function(jsonStr) {
				jsonStr = typeof jsonStr == 'string' ? JSON.parse(jsonStr) : jsonStr;
				if (jsonStr.returnCode == 1) {
					showErrorMsg(jsonStr.errorInfo);
				} else {
					if (jsonStr.result.tradeStatus == 0) {
						window.setTimeout(function() {
							showErrorMsg("恭喜！支付成功");
							window.location.href = Jsp.basePath + '/mall/findOrderList';
						}, 1000);
					} else if (jsonStr.result.tradeStatus == 1) {//待付款
						window.setTimeout(function() {
							checkPay(orderNo);
						}, 30000);
					} else if (jsonStr.result.tradeStatus == 2) {//付款失败
						window.setTimeout(function() {
							checkPay(orderNo);
						}, 30000);
					} else if (jsonStr.result.tradeStatus == 4) {
						showErrorMsg("订单已过期，请重新下单完成支付");
						window.setTimeout(function() {
							window.location.href = Jsp.basePath + '/mall/findOrderList';
						}, 2000);
					} else if (jsonStr.result.tradeStatus == 5) {
						showErrorMsg("订单已退款，请重新下单完成支付");
						window.setTimeout(function() {
							window.location.href = Jsp.basePath + '/mall/findOrderList';
						}, 2000);
					} else if (jsonStr.result.tradeStatus == 5) {
						showErrorMsg("未生成支付订单，请重新下单完成支付");
						window.setTimeout(function() {
							window.location.href = Jsp.basePath + '/mall/findOrderList';
						}, 2000);
					} else {
						showErrorMsg("订单不存在");
						window.setTimeout(function() {
							window.location.href = Jsp.basePath + '/mall/findOrderList';
						}, 2000);
					}
				}
			}
		});
	}
});

function showErrorMsg(text) {
	$('.err-msg').html(text);$('.err-msg').show();
	//window.setTimeout(moveErrorMsg(), 1500);
}

function moveErrorMsg() {
	$('.err-msg').html("").hide();
}
</script>
</body>
</html>