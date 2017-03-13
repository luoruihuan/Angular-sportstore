angular.module("customFilters", [])
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