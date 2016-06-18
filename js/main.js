function g(selector) {
	var method = selector.substr(0, 1) == '.' ? 'getElementsByClassName' : 'getElementById';
	return document[method](selector.substr(1));
}

// 随机数生成器 range[min, max]
function random(range) {
	var min = Math.min(range[0], range[1]);
	var max = Math.max(range[0], range[1]);
	var num = Math.random() * (max - min) + min;
	return Math.ceil(num);
}

function addPhotos() {
	var wrap = g('#wrap').innerHTML;
	var html = [];
	var navs = [];

	for(var i = 0; i < data.length; i++) {
		var _html = wrap.replace('{{index}}', i)
						.replace('{{img}}', data[i].src)
						.replace('{{caption}}', data[i].caption)
						.replace('{{desc}}', data[i].desc);
		html.push(_html);

		var nav = '<span class="i" id="i_' + i + '" onclick=turn(g(\'#photo_' + i + '\'))><i class="fa fa-repeat"></i></span>';
		navs.push(nav);
	}
	html.push('<div class="nav">' + navs.join('') + '</div>');
	g('#wrap').innerHTML = html.join('');

	rsort(random([0, data.length - 1]));
}
addPhotos();

//随机设置左区域、右区域图片的坐标
//rangs= {left: {x: [min, max], y:[]}, right: {}}
function set_l_r_range() {
	var rangs = {left: {x: [], y:[]}, right: {}};

	var wrapW = g('#wrap').clientWidth;
	var wrapH = g('#wrap').clientHeight;
	var photoW = g('.photo')[0].clientWidth;
	var photoH = g('.photo')[0].clientHeight;

	rangs.left.x = random([0 - photoW, wrapW / 2 - photoW / 2]);
	rangs.left.y = random([0 - photoH, wrapH]);
	rangs.right.x = random([wrapW / 2 + photoW / 2, wrapW]);
	rangs.right.y = random([0 - photoH, wrapH]);

	return rangs;
}

// 将图片排序
function rsort(n) {
	var _photos = g('.photo');
	var photos = [];
	//将所有图片的'photo-center'类清除
	for(var i = 0; i < _photos.length; i++) {
		var _photo = _photos[i];
		_photo.className = _photo.className.replace(/\s*photo-center\s*/, ' ');
		_photo.className = _photo.className.replace(/\s*photo-front\s*/, ' ');
		_photo.className = _photo.className.replace(/\s*photo-back\s*/, ' ');
		_photo.style.left = '';
		_photo.style.top = '';
		_photo.style['-webkit-transform'] = 'rotate(360deg) scale(1.3)';
		_photo.style['-moz-transform'] = 'rotate(360deg) scale(1.3)';
		_photo.style['-ms-transform'] = 'rotate(360deg) scale(1.3)';
		_photo.style.transform = 'rotate(360deg) scale(1.3)';

		photos.push(_photo);
	}

	// 随机设置一张图片居中
	var clsName = g('#photo_' + n).className;
	g('#photo_' + n).className += ' photo-front';
	g('#photo_' + n).className += ' photo-center';
	photos.splice(n, 1);
	//设置对应按钮属性
	var navs = g('.i');
	//将按钮的'i-current'类清除
	$.each(navs, function (inx, nav) {
		nav.className = nav.className.replace(/\s*i-current\s*/, ' ');
		nav.className = nav.className.replace(/\s*i-back\s*/, ' ');
	});
	g('#i_' + n).className += ' i-current ';

	//设置左分区和右分区
	var left_photos = photos.splice(0, Math.ceil(photos.length / 2));
	var right_photos = photos;
	$.each(left_photos, function (index, lp) {
		lp.style.left = set_l_r_range().left.x + 'px';
		lp.style.top = set_l_r_range().left.y + 'px';
		lp.style['-webkit-transform'] = 'rotate(' + random([-120, 120]) + 'deg) scale(1)';
		lp.style['-moz-transform'] = 'rotate(' + random([-120, 120]) + 'deg) scale(1)';
		lp.style['-ms-transform'] = 'rotate(' + random([-120, 120]) + 'deg) scale(1)';
		lp.style.transform = 'rotate(' + random([-120, 120]) + 'deg) scale(1)';
	});
	$.each(right_photos, function (index, rp) {
		rp.style.left = set_l_r_range().right.x + 'px';
		rp.style.top = set_l_r_range().right.y + 'px';
		rp.style['-webkit-transform'] = 'rotate(' + random([-120, 120]) + 'deg) scale(1)';
		rp.style['-moz-transform'] = 'rotate(' + random([-120, 120]) + 'deg) scale(1)';
		rp.style['-ms-transform'] = 'rotate(' + random([-120, 120]) + 'deg) scale(1)';
		rp.style.transform = 'rotate(' + random([-120, 120]) + 'deg) scale(1)';
	});
}

//1.翻页
function turn (elem) {
	var cls = elem.className;
	var n = elem.id.split('_')[1];

	if(!/photo-center/.test(cls)) {
		rsort(n);
		return;
	}

	if(/photo-front/.test(cls)) {
		cls = cls.replace(/photo-front/, 'photo-back');
		g('#i_' + n).className += ' i-back';
	} else {
		cls = cls.replace(/photo-back/, 'photo-front');
		g('#i_' + n).className = g('#i_' + n).className.replace(/\s*i-back\s*/, ' ');
	}

	elem.className = cls;
}