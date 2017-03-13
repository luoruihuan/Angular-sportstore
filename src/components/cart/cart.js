angular.module('cart',[])
.factory('cart',function(){
	var cartData = [];
	return {
		//添加指定产品到购物车，如果产品已存在，增加该产品需求数量
		addProduct:function(id,name,price){
			var addedToExistingItem = false;
			for(var i=0;i<cartData.length;i++){
				if(cartData[i].id ==id){
					cartData[i].count++;
					addedToExistingItem = true;
					break;
				}
			}
			if(!addedToExistingItem){
				cartData.push({
					count:1,id:id,price:price,name:name
				})
			}
			console.log(cartData);
		},
		//使用指定id移除差产品
		removeProduct:function(id){
			for(var i=0;i<cartData.length;i++){
				if(cartData[i].id == id){
					cartData.splice(i,1);
					break;
				}
			}
		},
		//返回购物车中的对象数组
		getProducts:function(){
			return cartData;
		}
	}
})
.directive('cartSummary',function(cart){
	return {
		restrict:'E',
		templateUrl:'components/cart/cartSummary.html',
		controller:function($scope){
			var cartData = cart.getProducts();
			$scope.total = function(){
				var total = 0;
				for(var i=0;i<cartData.length;i++){
					total+=(cartData[i].price*cartData[i].count)
				}
				return total;
			}
			$scope.itemCount = function(){
				var total = 0;
				for(var i =0;i<cartData.length;i++){
					total += cartData[i].count;
				}
				return total;
			}
		}	
	}
})
