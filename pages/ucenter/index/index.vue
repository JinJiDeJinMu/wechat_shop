<template>
	<view>
		<image class="user-header-bg" src="/static/images/user-header-bg.png" mode='widthFix'></image>
		<view class="container oh p-b-10 user-header-box">
			<view class="row user-brief">
				<navigator class="block col-xs-3 tr">
					<image :src="userInfo.avatarUrl" class="avatar"></image>
				</navigator>
				<view class="col-xs-9 p-l-0">
					<view class="username">{{ userInfo.userName ? userInfo.userName : userInfo.nickName }}</view>
				</view>
			</view>
			<view class="row user-count">
				<navigator url="/pages/ucenter/recharge/recharge" class="block col-xs-4" v-show="flag">
					<view class="num">{{score}}</view>
					<view class="txt">帐户余额</view>
				</navigator>
				<navigator :url="'/pages/ucenter/score/score?number=' + number" class="block col-xs-4">
					<view class="num">{{number}}</view>
					<view class="txt">积分金币</view>
				</navigator>
				<navigator url="/pages/ucenter/coupon/coupon" class="block col-xs-4">
					<view class="num">0</view>
					<view class="txt">优惠券</view>
				</navigator>
			</view>
		</view>

		<view class="container">
			<view class="row">
				<view class="col-xs-12">
				<view class="user-icon-menu-box" style="border-radius:20rpx;">
					<view class="flex-between title">
						<text class="fs-14">我的订单</text>
						<navigator url="/pages/ucenter/order/order?id=-1" class="flex-between">
							<view class="fs-13 m-r-5" style="color:#626262;">全部订单</view> 
							<image src="../../../static/images/right-2.png" style="width:20rpx;height:20rpx" />
						</navigator>
					</view>
					<navigator url="/pages/ucenter/order/order?id=0" class="item block pc-20 fl">
						<view class="img"><image src="../../../static/images/order-1.png" /></view>
						<view class="txt">待付款</view>
					</navigator>
					<navigator url="/pages/ucenter/order/order?id=208" class="item block pc-20 fl">
						<view class="img"><image src="../../../static/images/order-2.png" /></view>
						<view class="txt">待发货</view>
						<!-- <text class="num none">3</text> -->
					</navigator>
					<navigator url="/pages/ucenter/order/order?id=207" class="item block pc-20 fl">
						<view class="img"><image src="../../../static/images/order-3.png" /></view>
						<view class="txt">待收货</view>
					</navigator>
					<navigator url="/pages/ucenter/order/order?id=402" class="item block pc-20 fl">
						<view class="img"><image src="../../../static/images/order-4.png" /></view>
						<view class="txt">待评价</view>
					</navigator>
					<navigator url="/pages/ucenter/order/orderService?id=502" class="item block pc-20 fl">
						<view class="img"><image src="../../../static/images/order-5.png" /></view>
						<view class="txt">售后</view>
					</navigator>
				</view>
				</view>
			</view>
		</view>
		<view class="container m-t-10">
			<view class="row">
				<view class="col-xs-12">
				<view class="user-icon-menu-box" style="border-radius:20rpx;">
					<view class="flex-between title">
						<text class="fs-14">我的服务</text>
					</view>
					<!-- <view url="/pages/uQrcode/uQrcode" class="item" open-type="share">
						<view class="img"><image src="../../../static/images/user-1.png" /></view>
						<button open-type="share" class="txt" style="background-color: transparent;border: none;outline: none;">邀请好友</button>
					</view> -->
					<view class="item">     
							  <button  open-type="share"  class='pos_'>邀请好友</button>
							  <image class="icon_kf_" src="/static/images/user-1.png"></image>  
					       <view class="dbtext_">邀请好友</view>	
					</view>
					<navigator url="/pages/ucenter/collect/collect" class="item">
						<view class="img"><image src="../../../static/images/user-2.png" /></view>
						<view class="txt">我的收藏</view>
						<!--<text class="num">3</text>-->
					</navigator>
					<navigator url="/pages/ucenter/footprint/footprint" class="item">
						<view class="img"><image src="../../../static/images/user-3.png" /></view>
						<view class="txt">我的足迹</view>
					</navigator>
					<navigator url="/pages/ucenter/address/address" class="item">
						<view class="img"><image src="../../../static/images/user-4.png" /></view>
						<view class="txt">我的地址</view>
					</navigator>
					
					<navigator url="/pages/ucenter/feedback/feedback" class="item">
						<view class="img"><image src="../../../static/images/user-6.png" /></view>
						<view class="txt">意见反馈</view>
					</navigator>
					<!-- <navigator url="" class="item">
						<view class="img"><image src="../../../static/images/user-7.png" /></view>
						<button class="txt" open-type="contact" style="background-color: transparent;border: none;outline: none;">联系客服</button>
					</navigator> -->
					<view class="item">
							  <button  open-type="contact" class='pos_'>联系客服</button>
							  <image class="icon_kf_" src="/static/images/user-7.png"></image>  
					       <view class="dbtext_">联系客服</view>	
					</view>
				</view>
				</view>
			</view>
		</view>

   
		<!-- <view class="m-b-15 p-l-15 p-r-15 m-t-10">
			<navigator url="/pages/uSetting/uSetting" class="flex-between bg-white pd15" style="border-radius:20rpx;">
				<text class="fs-15" style="line-height:48rpx;">其它设置</text>
				<image src="/static/images/right-2.png" style="width:38rpx;height:38rpx" />
			</navigator>
		</view> -->

	</view>
</template>

<script>
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
let startY = 0,
	moveY = 0,
	pageAtTop = true;
export default {
	data() {
		return {
			coverTransform: 'translateY(0px)',
			coverTransition: '0s',
			moving: false,
			userInfo: {},
			hasMobile: '',
			fUser: {},
			commission: {
				allProfit: 0,
				getProfit: 0
			},
			isshow: false,
			isDistribut: 0,
			score:0.00,
			number:0,
			flag:false
		};
	},
	components: {},
	props: {},
	onLoad: function(options) {
		let userInfo = wx.getStorageSync('userInfo');
		let token = wx.getStorageSync('token');
		if (token) {
			this.setData({
				isshow: true,
				isDistribut: wx.getStorageSync('isDistribut')
			});
			getApp().globalData.userInfo = userInfo.userInfo;
			getApp().globalData.token = token;
			this.getMyScore();
		} else {
			wx.redirectTo({
				url: '../../customer/zcuslist/zcuslist?id=-2'
			});
			wx.removeStorageSync('userInfo');
		}
		this.userInfo = getApp().globalData.userInfo;
	},
	onReady: function() {},
	onShow: function() {},
	onHide: function() {},
	onUnload: function() {},
	onPullDownRefresh() {
	  var self = this;
	  self.getMyScore();
	  wx.stopPullDownRefresh();
	},
	
	methods: {
		getMyScore: function() {
			let that = this;
			util.request(api.MyScore).then(function(res) {
				that.setData({flag: res.data.flag});
				if (res.code === 200) {
					if(res.data.cdtUserScore !=null){				
							that.setData({
								score: res.data.cdtUserScore.score,
								number: res.data.cdtUserScore.number							
							});
						
						
					}
				}
			});
		},
		onShareAppMessage() {
			this.noLogin();
			return {
				title: '邀请好友',
				path: 'pages/product/product?id=-1&userId=' + wx.getStorageSync('uId')
			};
		},
		navTo(url) {
			console.log(url);
			uni.navigateTo({
				url
			});
		},
		/**
		 *  会员卡下拉和回弹
		 *  1.关闭bounce避免ios端下拉冲突
		 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
		 *    transition设置0.1秒延迟，让css来过渡这段空窗期
		 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
		 */
		coverTouchstart(e) {
			if (pageAtTop === false) {
				return;
			}
			this.coverTransition = 'transform .1s linear';
			startY = e.touches[0].clientY;
		},
		coverTouchmove(e) {
			moveY = e.touches[0].clientY;
			let moveDistance = moveY - startY;
			if (moveDistance < 0) {
				this.moving = false;
				return;
			}
			this.moving = true;
			if (moveDistance >= 80 && moveDistance < 100) {
				moveDistance = 80;
			}
			if (moveDistance > 0 && moveDistance <= 80) {
				this.coverTransform = `translateY(${moveDistance}px)`;
			}
		},
		coverTouchend() {
			if (this.moving === false) {
				return;
			}
			this.moving = false;
			this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
			this.coverTransform = 'translateY(0px)';
		},
		getScancode: function() {
			let currentUser = getApp().globalData.userInfo;
			console.log(JSON.stringify(currentUser));
			let merchantId = wx.getStorageSync('merchantId');
			if (merchantId == '' || merchantId == '0' || merchantId == 'null' || merchantId == null) {
				wx.showToast({
					title: '请退出登录,重新登录再试',
					icon: 'fail',
					duration: 2000
				});
			} else {
				// 允许从相机和相册扫码
				wx.scanCode({
					success: res => {
						console.log(res.result);
						wx.navigateTo({
							url: '../orderHexiao/orderHexiao?' + res.result
						});
					}
				});
			}
		},

		noLogin() {
			if (!wx.getStorageSync('token')) {
				wx.showToast({
					title: '请先登录～',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
		},
		doWithdraw() {
			let that = this;
			wx.navigateTo({
				url: '../../customer/auth/auth'
			});
		},

		bindGetUserInfo(e) {
			let token = wx.getStorageSync('token');
			if (token) {
				return false;
			}
			if (e.detail.userInfo) {
				//用户按了允许授权按钮
				user.loginByWeixin(e.detail)
					.then(res => {
						let userInfo = wx.getStorageSync('userInfo');
						this.setData({
							userInfo: userInfo.userInfo,
							isshow: true
						});
						getApp().globalData.userInfo = userInfo.userInfo;
						getApp().globalData.token = res.data.openid;
						this.initDataInfo();
						this.initYJInfo();
						this.onLoad();
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				//用户按了拒绝按钮
				wx.showModal({
					title: '警告通知',
					content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
					success: function(res) {
						if (res.confirm) {
							wx.openSetting({
								success: res => {
									if (res.authSetting['scope.userInfo']) {
										////如果用户重新同意了授权登录
										user.loginByWeixin(e.detail)
											.then(res => {
												let userInfo = wx.getStorageSync('userInfo');
												this.setData({
													userInfo: userInfo.userInfo,
													isDistribut: userInfo.isDistribut,
													isshow: true
												});
												getApp().globalData.userInfo = userInfo.userInfo;
												getApp().globalData.token = res.data.openid;
											})
											.catch(err => {
												console.log(err);
											});
									}
								}
							});
						}
					}
				});
			}
		},
		exitLogin: function() {
			let that = this;
			wx.showModal({
				title: '提示',
				confirmColor: '#b4282d',
				content: '退出登录？',
				success: function(res) {
					if (res.confirm) {
						wx.removeStorageSync('token');
						wx.removeStorageSync('userInfo');
						wx.removeStorageSync('userId');
						wx.removeStorageSync('isReal');
						wx.removeStorageSync('uId');
						wx.removeStorageSync('merchantId');
						wx.removeStorageSync('isDistribut');
						getApp().globalData.userInfo = {};
						that.setData({
							userInfo: {}
						});
						wx.switchTab({
							url: '/pages/index/index'
						});
					}
				}
			});
		},
		setData: function(obj, callback) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function(key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function(key2, index) {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}

					data = data[key2];
				});
			});
			callback && callback();
		}
	}
};
</script>
<style >
@import "../../../static/css/main.css";
</style>
