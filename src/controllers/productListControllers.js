angular.module("productListCtrl",[])
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
}]);