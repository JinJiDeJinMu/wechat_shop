var api = require("../config/api.js");

function validatePhone(phone) {
	const re = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
	return re.test(phone);
}

const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : '0' + n;
};

function formatTimeTwo(number, format) {
	var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
	var returnArr = []; // var date = new Date(number * 1000);//时间戳为10位

	var date = new Date(number); //时间戳为13位

	returnArr.push(date.getFullYear());
	returnArr.push(formatNumber(date.getMonth() + 1));
	returnArr.push(formatNumber(date.getDate()));
	returnArr.push(formatNumber(date.getHours()));
	returnArr.push(formatNumber(date.getMinutes()));
	returnArr.push(formatNumber(date.getSeconds()));

	for (var i in returnArr) {
		format = format.replace(formateArr[i], returnArr[i]);
	}

	return format;
}
/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET", contentType = "application/json") {
	return new Promise(function(resolve, reject) {
		wx.request({
			url: url,
			data: data,
			method: method,
			header: {
				'Content-Type': contentType,
				'X-Nideshop-Token': wx.getStorageSync('token')
			},
			success: function(res) {
				if (res.statusCode == 200) {
					if (res.data.errno == 401) {
						console.log(url);
						console.log(data);
						console.log(res.data); //需要登录后才可以操作

						wx.showModal({
							title: '',
							content: '请先登录',
							success: function(res) {
								if (res.confirm) {
									wx.removeStorageSync("userInfo");
									wx.removeStorageSync("token");
									wx.switchTab({
										url: '/pages/index/index'
									});
								}
							}
						});
					} else {
						resolve(res.data);
					}
				} else {
					reject(res.errMsg);
				}
			},
			fail: function(err) {
				reject(err);
			}
		});
	});
}

function getQueryString(url, name) {
	var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
	var r = url.substr(1).match(reg);

	if (r != null) {
		return r[2];
	}

	return null;
}
/**
 * 检查微信会话是否过期
 */
function checkSession() {
	return new Promise(function(resolve, reject) {
		wx.checkSession({
			success: function() {
				resolve(true);
			},
			fail: function() {
				reject(false);
			}
		});
	});
}
/**
 * 调用微信登录
 */


function login() {
	return new Promise(function(resolve, reject) {
		wx.login({
			success: function(res) {
				if (res.code) {
					//登录远程服务器
					resolve(res);
				} else {
					reject(res);
				}
			},
			fail: function(err) {
				reject(err);
			}
		});
	});
}

function redirect(url) {
	//判断页面是否需要登录
	if (false) {
		wx.redirectTo({
			url: '/pages/auth/login/login'
		});
		return false;
	} else {
		wx.redirectTo({
			url: url
		});
	}
}

function showErrorToast(msg) {
	wx.showToast({
		title: msg,
		image: '/static/images/icon_error.png'
	});
}

function showSuccessToast(msg) {
	wx.showToast({
		title: msg
	});
}

function accSub(arg1, arg2) {
	var r1, r2, m, n;

	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}

	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}

	m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度

	n = r1 >= r2 ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

function ctDate(date) {
	if (!date) return "";
	const now = Date.now();
	let diff;
	date = typeof date == "number" ? date : +new Date(date);
	diff = now - date;

	switch (Math.floor(diff / 3600000 / 24)) {
		case 0:
			return "今天";

		case 1:
			return "昨天";

		case 2:
			return "两天前";

		case 3:
			return "三天前";

		case 4:
			return "四天前";

		case 5:
			return "五天前";

		default:
			return formatTime(date);
	}
}

const showToast = (title = '加载中...', icon = 'loading', duration = 60000) => {
	wx.showToast({
		title: title,
		mask: true,
		icon: icon,
		duration: duration
	});
};

const hideToast = () => {
	wx.hideToast();
};

const showModal = (title = '系统提示', str = '', showCancel = true, confirmText = '确定', fn, color = {
	cancelColor: '#999999',
	confirmColor: '#7D73C3'
}, cancelText = "取消") => {
	wx.showModal({
		title: title,
		content: str,
		showCancel: showCancel,
		cancelText: cancelText,
		confirmText: confirmText,
		confirmColor: color.confirmColor,
		cancelColor: color.cancelColor,
		success: res => {
			return typeof fn == 'function' && fn(res);
		}
	});
}; // 用户授权检查


const checkPermission = (type, onSuccess, content) => {
	let that = this;
	type = 'scope.' + type;
	wx.getSetting({
		success(getRes) {
			const setting = getRes.authSetting;

			if (setting[type] === false) {
				wx.showModal({
					title: '温馨提示',
					content: '请您授权其相关权限',
					showCancel: true,
					cancelText: "取消",
					confirmText: "我知道了",
					confirmColor: '#999999',
					cancelColor: '#7D73C3',
					success: res => {
						if (res.confirm) {
							wx.openSetting({
								success(openRes) {
									if (openRes.authSetting[type] === true) {
										typeof onSuccess === 'function' && onSuccess();
									}
								}

							});
						}
					}
				});
			} else if (setting[type] === true) {
				//如果已有授权直接执行对应动作
				typeof onSuccess === 'function' && onSuccess();
			} else {
				//如果未授权，直接执行对应动作，会自动查询授权
				typeof onSuccess === 'function' && onSuccess();
			}
		}

	});
};

module.exports = {
	// formatTime,
	// nformatTime,
	ctDate,
	formatTime,
	formatTimeTwo,
	request,
	redirect,
	showErrorToast,
	showSuccessToast,
	checkSession,
	login,
	validatePhone,
	getQueryString,
	accSub,
	showToast,
	hideToast,
	showModal,
	checkPermission
};
