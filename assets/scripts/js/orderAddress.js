//document.addEventListener('DOMContentLoaded', function(){
//
//});
$(function(){
	var buyerInfoForm = document.querySelector('.buyer-info-form'),
		buyerInfoFormBind = {
			items: buyerInfoForm.querySelectorAll('.validatebox'),
			btn: document.querySelector('.submit-btn')
		};

        new Validate({
            items: buyerInfoFormBind.items,
            btn: buyerInfoFormBind.btn
        },function(obj) {
            $.showPreloader();
            setTimeout(function () {
                $.hidePreloader();
                $('#address-group').hide();
                $('#pay-group').show();
            }, 300);
        });

	var opd = document.getElementById("orderAddress-product-detail"), htmls = '';
	var buyType = $('#hd-address-buyType').val();
	if(buyType == 1){
		var goodsList = sessionStorage.getItem("cartData");
		if(goodsList.length > 0){
			goodsList = eval("(" + goodsList + ")");
			var gl = goodsList;
            var countPerPackEl = gl.standardUnit ? '&nbsp;&nbsp;<span class="xst tg">(' + gl.countPerPack + gl.standardUnit+ ')</span>' : '';

			if (gl.goodsType == '1') {//有偿租机
				htmls += ['<div style="height: 85px">',
					'<a><i style="background-image:url(' + gl.goodsPic + ');top:15px;"></i>&nbsp;<span class="st">' + gl.goodsName + '</span>'+ countPerPackEl,
					'<div style="background-color: #fecf4d;color: #C62B2B;width: 80px;height:30px;top:20px;line-height:30px;position:relative;border-radius: 2px;text-align: center">有偿租机</div></a>',
					'<a class="tr">',
					'<span class="st rt"><p>' + gl.totalPrice + '</p></span>',
					'<span class="st tg">x&nbsp;' + gl.purchaseNum + '</span>',
					'</a>',
					'</div>'].join('');
			} else {
				htmls += ['<div>',
					'<a><i style="background-image:url(' + gl.goodsPic + ');"></i>&nbsp;<span class="st">' + gl.goodsName + '</span>'+ countPerPackEl,
					'<a class="tr">',
					'<span class="st rt">' + gl.totalPrice + '</span><br>',
					'<span class="st tg">x&nbsp;' + gl.purchaseNum + '</span>',
					'</a>',
					'</div>'].join('');
			}
		}
	}
	else{
		var value = null;
		var data = localStorage;
		for (var i = 0; i < data.length; i++) {
			if (data.key(i).indexOf('cartData') != -1) {
				value = data.getItem(data.key(i));
				if(value != null){
					var goodsList = eval("(" + value + ")");//localStorage.getItem("cartData" + (i + 1));
					//goodsList = typeof goodsList == 'string' ? goodsList : goodsList;
					var gl = goodsList;
                    var countPerPackEl = gl.standardUnit ? '&nbsp;&nbsp;<span class="xst tg">(' + gl.countPerPack + gl.standardUnit+ ')</span>' : '';

					if (gl.goodsType == '1') {//有偿租机
						htmls += ['<div style="height: 85px">',
							'<a><i style="background-image:url(' + gl.goodsPic + ');top:15px;"></i>&nbsp;<span class="st">' + gl.goodsName + '</span>'+ countPerPackEl,
							'<div style="background-color: #fecf4d;color: #C62B2B;width: 80px;height:30px;top:20px;line-height:30px;position:relative;border-radius: 2px;text-align: center">有偿租机</div></a>',
							'<a class="tr">',
							'<span class="st rt"><p>' + gl.totalPrice + '</p></span>',
							'<span class="st tg">x&nbsp;' + gl.purchaseNum + '</span>',
							'</a>',
							'</div>'].join('');
					}else {
						htmls += ['<div>',
							'<a><i style="background-image:url(' + gl.goodsPic + ');"></i>&nbsp;<span class="st">' + gl.goodsName + '</span>'+countPerPackEl,
							'<a class="tr">',
							'<span class="st rt">' + gl.totalPrice + '</span><br>',
							'<span class="st tg">x&nbsp;' + gl.purchaseNum + '</span>',
							'</a>',
							'</div>'].join('');
					}
				}
			}
		}

	}
	opd.innerHTML = htmls;
	buyerInfoFormBind.btn.onclick = null;
})
