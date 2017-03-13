angular.module('sportsStore',['customFilters','productListCtrl','cart','ngRoute'])
.constant('dataUrl','http://localhost:5500/products')
.constant('orderUrl','http://localhost:5500/orders')
.config(function($routeProvider){
	$routeProvider.when('/checkout',{
		templateUrl:'views/checkoutSummary.html'
	});
	$routeProvider.when('/products',{
		templateUrl:'views/productList.html'
	});
	$routeProvider.when('/placeorder',{
		templateUrl:'views/placeorder.html'
	});
	$routeProvider.when('/complete',{
		templateUrl:'views/thankYou.html'
	});
	$routeProvider.otherwise({ 
		templateUrl:'views/productList.html' 
	})
})
.controller('sportsStoreCtrl',['$scope','$http','$location','dataUrl','orderUrl','cart',
	function($scope,$http,$localtion,dataUrl,orderUrl,cart){
		$scope.data={};
		$http.get(dataUrl)
		.success(function(data){
			$scope.data.products = data;
		})
		.error(function(error){
			$scope.data.error = error;
		})

		$scope.sendOrder = function(shippingDetails){
			var order = angular.copy(shippingDetails);
			order.products = cart.getProducts();
			$http.post(orderUrl,order)
			.success(function(data){
				$scope.data.orderId = data.id;
				cart.getProducts().length = 0;
			})
			.error(function(error){
				$scope.data.orderError = error;
			})
			.finally(function(){
				$localtion.path('/complete')
			})
		}
}])
.controller('cartSummaryController',['$scope','cart',function($scope,cart){
	$scope.cartData = cart.getProducts();
	$scope.total = function(){
		var total = 0;
		for(var i=0;i<$scope.cartData.length;i++){
			total+=($scope.cartData[i].price*$scope.cartData[i].count);
		}
		return total;
	}
	$scope.remove = function(id){
		cart.removeProduct(id);
	}
}])

