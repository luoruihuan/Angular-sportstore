/*! myfirst_grunt - v1.0 - 2017-03-13 */
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
;angular.module("sportsStoreAdmin",['ngRoute','ngResource'])
.constant("authUrl", "http://localhost:5500/users/login")
.constant('ordersUrl','http://localhost:5500/orders')
.config(function($routeProvider){
			$routeProvider.when('/login',{
				templateUrl:'views/adminLogin.html'
			});
			$routeProvider.when('/main',{
				templateUrl:'views/adminMain.html'
			});
			$routeProvider.otherwise({
				redirectTo:'/login'
			})
		})
.controller("authCtrl", function($scope, $http, $location, authUrl) {
	$scope.authenticate = function (user, pass) {
		$http.post(authUrl, {
			username: user,
			password: pass  
		}, {
			withCredentials: true
		}).success(function (data) {
			$location.path("/main");
		}).error(function (error) {
			$scope.authenticationError = error;
		});
	}
})
.controller('mainCtrl', function($scope) {
        $scope.screens = ['Products', 'Orders'];
        $scope.current = $scope.screens[0];

        $scope.setScreen = function(index) {
            $scope.current = $scope.screens[index];
        };

        $scope.getScreen = function() {
            return $scope.current === 'Products'
                ? 'views/adminProducts.html' : 'views/adminOrders.html';
        }
})
.controller('ordersCtrl', function($scope, $http, ordersUrl) {

        $http.get(ordersUrl, { withCredentials: true })
            .success(function(data) {
                $scope.orders = data;
            })
            .error(function(error) {
                $scope.error = error;
            });

        $scope.selectedOrder;

        $scope.selectOrder = function(order) {
            $scope.selectedOrder = order;
        };

        $scope.calcTotal = function(order) {
            var total = 0;
            for(var i = 0; i < order.products.length; i++) {
                total += order.products[i].count + order.products[i].price;
            }
            return total;
        };
    });;angular.module('sportsStoreAdmin')
    .constant('productUrl', 'http://localhost:5500/products/')
    .config(function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    })
    .controller('productCtrl', function($scope, $resource, productUrl) {

        $scope.productsResource = $resource(productUrl + ':id', { id: '@id' });

        $scope.listProducts = function() {
            $scope.products = $scope.productsResource.query();
        };

        $scope.deleteProduct = function(product) {
            product.$delete().then(function() {
                $scope.products.splice($scope.products.indexOf(product), 1);
            });
        };

        $scope.createProduct = function(product) {
            new $scope.productsResource(product).$save().then(function(newProduct) {
                $scope.products.push(newProduct);
                $scope.editedProduct = null;
            });
        };

        $scope.updateProduct = function(product) {
            product.$save();
            $scope.editedProduct = null;
        };

        $scope.startEdit = function(product) {
            $scope.editedProduct = product;
        };

        $scope.cancelEdit = function() {
            $scope.editedProduct = null;
        };

        $scope.listProducts();

    });angular.module("productListCtrl",[])
.constant("productListActiveClass", "btn-primary")
.constant("productListPageCount", 3)
.controller("productListCtrl", ['$scope','$filter','productListActiveClass','productListPageCount','cart',function ($scope, $filter,
productListActiveClass, productListPageCount,cart) {
	var selectedCategory = null;
	$scope.pageSize = productListPageCount;
	$scope.selectedPage = 1;
	$scope.selectCategory = function (newCategory) {
		selectedCategory = newCategory;
		$scope.selectedPage = 1;
	}
	$scope.categoryFilterFn = function (product) {
		return selectedCategory == null ||
		product.category == selectedCategory;
	}
	
	$scope.getCategoryClass = function (category) {
		return selectedCategory == category ? productListActiveClass : "";
	}

	//实现分页：修改控制器，scope跟踪分页状态，实现过滤器更新视图 
	$scope.selectPage = function (newPage) {
		$scope.selectedPage = newPage;
	}
	$scope.getPageClass = function (page) {
		return $scope.selectedPage == page ? productListActiveClass : "";
	}

	$scope.addProductToCart = function(product){
		cart.addProduct(product.id,product.name,product.price);
	}
}]);;angular.module('sportsStore',['customFilters','productListCtrl','cart','ngRoute'])
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

;angular.module("customFilters", [])
//创建分类列表
.filter("unique", function () {
	return function (data, propertyName) { //propertyname指定要生成哪个字段的唯一列表
		//枚举数据对象的内容，用propertyname参数，构建独一无二的值的列表
		//检查传入数据是否为数组，属性名是否为字符串
		if (angular.isArray(data) && angular.isString(propertyName)) {
			var results = [];
			var keys = {};
			for (var i = 0; i < data.length; i++) {
				var val = data[i][propertyName];
				//isundefined检查属性是否定义
				if (angular.isUndefined(keys[val])) {
					keys[val] = true;
					results.push(val);
				}
			}
			return results;  
		} else { 
			return data;
		}   
	}
})
//从一个数组中返回一队列元素，代表产品页
.filter("range", ['$filter',function ($filter) {
	return function (data, page, size) {
		if (angular.isArray(data) && angular.isNumber(page) && angular.isNumber(size)) {
			var start_index = (page - 1) * size;
			if (data.length < start_index) {
				return [];
			} else {
				return $filter("limitTo")(data.splice(start_index), size);
			}
		}else{
			return data;
		}
	}
}])
.filter("pageCount", function () {
	return function (data, size) {
		if (angular.isArray(data)) {
			var result = [];
			for (var i = 0; i < Math.ceil(data.length / size) ; i++) {
				result.push(i);
			}
		return result; 
		} else {
			return data;
		}
	}
});