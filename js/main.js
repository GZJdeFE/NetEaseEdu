/*
 *@method : 获取当前active的item
 **/
var getCurrnetIndex = function(items) {
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
		var currentIndex = getCurrnetIndex(bannerImages), targetIndex;	
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
			var currentIndex = getCurrnetIndex(bannerImages);
			var targetIndex = parseInt(e.target.getAttribute("data-slide-to"));

			bannerNext(currentIndex, targetIndex);
		}
	}, false);
};
banner();