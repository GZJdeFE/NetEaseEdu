/*
 *@method : 获取当前active的item
 **/
var getCurrentIndex = function(items) {
	var currentIndex, i, len = items.length;
	for (i = 0; i < len; i++) {
		// 正则匹配
		if (/active/.test(items[i].className)) {
			currentIndex = i;
			break;
		}
	}
	return currentIndex;
}

/*
 *@method : 轮播图
 **/
var banner = function(){
	// 获取images和points的所有元素
	var imagesRoot = document.getElementById('banner-images');
	var bannerImages = imagesRoot.getElementsByTagName("li");
	var pointsRoot = document.getElementById("banner-points");
	var bannerPoints = pointsRoot.getElementsByTagName("li");

	var initialClassOfImage = "banner-image";
	var initialClassOfPoint = "banner-point";

	bannerImages[0].className = "banner-image-active";
	bannerPoints[0].className = "banner-point-active";

	// 替换原理 : 更换class
	function bannerNext(currentIndex, targetIndex) {
		bannerImages[currentIndex].className = initialClassOfImage;
		bannerImages[targetIndex].className = initialClassOfImage + "-active";

		bannerPoints[currentIndex].className = initialClassOfPoint;
		bannerPoints[targetIndex].className = initialClassOfPoint + "-active";
	}

	// 自动替换
	var autoNext = function() {
		var currentIndex = getCurrentIndex(bannerImages), targetIndex;	
		if (currentIndex == (bannerImages.length - 1)) {
			targetIndex = 0;
		} else {
			targetIndex = currentIndex + 1;
		}
		bannerNext(currentIndex, targetIndex);
	};
	// 设置5s更换
	var startAutoNext = setInterval(autoNext, 4000);

	imagesRoot.onmouseover = function() {
		clearInterval(startAutoNext);
	}
	imagesRoot.onmouseout = function() {
		startAutoNext = setInterval(autoNext, 4000);
	}
	pointsRoot.addEventListener('click', function(e){
		if (e.target.tagName == 'LI') {
			var currentIndex = getCurrentIndex(bannerImages);
			var targetIndex = parseInt(e.target.getAttribute("data-slide-to"));

			bannerNext(currentIndex, targetIndex);
		}
	}, false);
};
banner();

/*
 *@method : 封装ajax方法
 *@params : url:请求地址
 *			options:{type:请求方法;data:请求参数}
 *			callback:{onsuccess:成功回调;onfailed:失败回调}
**/
var ajax = function(url, options, callback) {
	var xhr = new XMLHttpRequest();
	var method, queryString = "", requestURL = url;
	var requestParams = [];

	requestURL += (requestURL.indexOf('?') == -1 ? '?' : '&');
	method = options.type;

	if (options.data) {
		if (typeof options.data == 'string') {
			queryString == options.data;
		} else {
			for(var para in options.data) {
				var key = encodeURIComponent(para);
				var value = encodeURIComponent(options.data[para]);
				requestParams.push(key + "=" + value);
			}
			queryString = requestParams.join('&');
			requestURL += queryString;
		}
	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status >= 200 && xhr.status < 300) {
				callback.onsuccess(JSON.parse(xhr.responseText));
			} else {
				callback.onfailed(xhr);
			}
		}
	};

	if (method == 'get') {
		xhr.open(method, requestURL, true);
		xhr.send(null);
	} else {
		xhr.open(method, url, true);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(queryString);
	}
}

/*
 *@method : 获取最热排行
**/
var getHotRanking = function() {
	var onSuccess = parseHotRankingData;

	var url = "http://study.163.com/webDev/hotcouresByCategory.htm";
	var callback = {
		onsuccess : onSuccess
	};
	var options = {
		type : 'get'
	}
	ajax(url, options, callback);
};
getHotRanking();

/*
 *@method : 对最热排行的数据进行解析和展示
 *@params : data:返回的数据
**/
function parseHotRankingData(data) {
	var hotRankingList = document.getElementById('hot-ranking-list');
	hotRankingList.innerHTML = '';
	var html = '';
	console.log(data.length);
	for (var i = 0; i < data.length; i++) {
		html += '<li class="hot-course">' +
					'<img class="hot-course-img" src="' + data[i].smallPhotoUrl + '">' + 
					'<div class="hot-course-box">' + 
						'<h3 class="hot-course-name">' + data[i].name + '</h3>' +
						'<p class="hot-course-num">' +
							'<span class="hot-course-num-icon"></span>' +
							'<span class="hot-course-count">' + data[i].learnerCount + '</span>' +
						'</p>' +
					'</div>' +
				'</li>';
	}
	hotRankingList.innerHTML = html+html;
	var index = 0;
	setInterval(function() {	
		var ul = document.getElementById('hot-ranking-list');
		var li = ul.getElementsByTagName('li')[0];
		index++;
		li.style.cssText = 'margin-top: ' + (-68*index) + 'px;';
		if (index == 21) {
			li.style.marginTop == '';
			index = 0;
			li.transition = 'margin 0ms';
		}
	}, 5000);
}