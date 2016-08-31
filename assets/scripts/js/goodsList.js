    
   document.addEventListener('DOMContentLoaded', function(){
   	   
       var buyerInfoForm = document.querySelector('.box-order-form');
       var inputs = buyerInfoForm.querySelectorAll('input.form-control');

       addFormValidation();

       showAndHideInstruction();

//       setTotalAmountAndCost();

       addListenerToAmount(inputs);

       var numInput = document.querySelectorAll('.goodsNum input[type=number]');
       for(var n=0,nLen=numInput.length; n<nLen; n++){
    	   numInput[n].addEventListener('blur',function(){
    		   console.log(!/^\d+$/.test(this.value));
    		   if(this.value == ""){
    			   this.value = "";
    		   }
    	   },false);
       }
       //console.log(numInput);
       function addFormValidation(){
           var buyerInfoFormBind = {
                   items: buyerInfoForm.querySelectorAll('.validatebox'),
                   btn: document.querySelector('.submit-btn')
               };
           new Validate({
               items: buyerInfoFormBind.items,
               btn: buyerInfoFormBind.btn
           },function(obj){
        	   var goodsData = [];
        	   var goodsNumId1 = getPurchaseNum(1);
               var goodsNumId2 = getPurchaseNum(2);
               var goodsNumId3 = getPurchaseNum(3);
           	   if((goodsNumId1 + goodsNumId2 + goodsNumId3) <= 0) {
					obj.prompt.innerText = "至少选择一种商品";
					obj.prompt.style.display = 'block';
           		   return;
           	   }
	           	var goodsId1 = document.getElementById("goodsId1").value;
	           	var goodsId3 = document.getElementById("goodsId3").value;
	           	var goodsId2 = document.getElementById("goodsId2").value;
	            if(goodsNumId1 > 0) {
	           		goodsData[goodsData.length]={"goodsId": goodsId1, "purchaseNum":goodsNumId1};
	           	} 
	            if(goodsNumId2 > 0) {
	           		goodsData[goodsData.length]={"goodsId": goodsId2, "purchaseNum":goodsNumId2};
	           	} 
	            if(goodsNumId3 > 0) {
	           		goodsData[goodsData.length]={"goodsId": goodsId3, "purchaseNum":goodsNumId3};
	           	} 
				console.log("result=", goodsData);
	           	sessionStorage.setItem('goodsData',JSON.stringify(goodsData));
	           	sessionStorage.setItem('totalAmount',getAmountsAndTotalCost()[0]);
	           	sessionStorage.setItem('totalCost',getAmountsAndTotalCost()[1]);
                window.location = Jsp.basePath + '/mall/getReceiveAddress';
           });
       }

       function showAndHideInstruction(){
           var instructionLink = buyerInfoForm.querySelector('.instruction-link a'),
               overlay = document.querySelector('.instruction-overlay'),
               instructionConfirm = overlay.querySelector('.instruction-confirm');

           instructionLink.addEventListener('click', function(){
               overlay.style.display = 'block';
           });

           instructionConfirm.addEventListener('click', function(){
               overlay.style.display = 'none';
           });
       }


       function setTotalAmountAndCost(){
    	   var totalAmount = getAmountsAndTotalCost()[0];
           var totalCost = getAmountsAndTotalCost()[1];
       
	       document.querySelector('.total-amount').innerHTML = totalAmount;
	       document.querySelector('.total-cost').innerHTML = "¥" + totalCost;
       }


       function addListenerToAmount(inputs){
           for (var i = inputs.length - 1; i >= 0; i--) {
           	inputs[i].index = i;
               inputs[i].addEventListener('blur', function(e){
            	   setTotalAmountAndCost();
               });
           }
       }
           
      function getAmountsAndTotalCost(){
   	 	var amount = 0;
   	 	var totalCost = 0;
        var goodsNumId1 = getPurchaseNum(1);
       	var goodsNumId2 = getPurchaseNum(2);
       	var goodsNumId3 = getPurchaseNum(3);
       	
       	
       	if(parseInt(goodsNumId1) > 0) {
       		amount += parseInt(goodsNumId1);
       		totalCost += (goodsNumId1*getPrices(1));
       	}
       	if(parseInt(goodsNumId2) > 0) {
       		amount += parseInt(goodsNumId2);
       		totalCost += (goodsNumId2*getPrices(2));
       	}
       	if(parseInt(goodsNumId3) > 0) {
       		amount += parseInt(goodsNumId3);
       		totalCost += (goodsNumId3*getPrices(3));
       	}
         	
            return [amount, totalCost.toFixed(2)];
        }
        
        function getPrices(index){
           	
           	var goodsUnitPrice = document.getElementById("goodsUnitPrice" + index).value;
           	var salesPrice = document.getElementById("salesPrice" + index).value;
           	if(salesPrice == "" || parseInt(salesPrice) <=0) {
           		return parseInt(goodsUnitPrice);
           	} else {
           		return parseInt(salesPrice);
           	}
         }
        
        function getPurchaseNum(index){
           	
           	var goodsNumId = document.getElementById("goodsNumId" + index).value;
           	return goodsNumId == "" ? 0: parseInt(goodsNumId);
         }
        
   });