<template>
	<view class="container" v-if="isshow">
		<view class="user-section">
			<image class="bg" src="/static/img/index-bg.png"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<image v-if="userInfo && userInfo.avatarUrl" class="portrait" :src="userInfo.avatarUrl || '/static/missing-face.png'" background-size="cover"></image>
				</view>
				<view class="info-box">
					<text class="username">{{ userInfo.userName || '游客' }}</text>
				</view>
			</view>
		</view>
		<view
			class="cover-container"
			:style="[
				{
					transform: coverTransform,
					transition: coverTransition
				}
			]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" src="/static/arc.png"></image>
			<view class="tj-sction">
				<view class="tj-item">
					<text class="num">128.8</text>
					<text>余额</text>
				</view>
				<view class="tj-item">
					<text class="num">0</text>
					<text>优惠券</text>
				</view>
				<view class="tj-item">
					<text class="num">20</text>
					<text>积分</text>
				</view>
			</view>
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/ucenter/order/order?id=-1')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon iconfont icon-icon_study"></text>
					<text style="font-size:28rpx;">全部订单</text>
				</view>
				<view class="order-item" @click="navTo('/pages/ucenter/order/order?id=0')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon iconfont icon-icon_im_keyboard"></text>
					<text style="font-size:28rpx;">待付款</text>
				</view>
				<view class="order-item" @click="navTo('/pages/ucenter/order/order?id=201')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon iconfont icon-icon_affiliations_li"></text>
					<text style="font-size:28rpx;">待收货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/ucenter/return/return?id=201')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon iconfont icon-icon_HRM"></text>
					<text style="font-size:28rpx;">退款/售后</text>
				</view>
			</view>
			<!-- 浏览历史 -->
			<view class="history-section icon">
				<view class="sec-header">
					<text class="yticon icon-lishijilu"></text>
					<text>浏览历史</text>
				</view>
				<scroll-view scroll-x class="h-list">
					<image
						@click="navTo('/pages/product/product')"
						src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553105186633&di=c121a29beece4e14269948d990f9e720&imgtype=0&src=http%3A%2F%2Fimg004.hc360.cn%2Fm8%2FM04%2FDE%2FDE%2FwKhQplZ-QteEBvsbAAAAADUkobU751.jpg"
						mode="aspectFill"
					></image>
				</scroll-view>
				<list-cell icon="iconfont icon-icon_alipay_line" iconColor="#e07472" title="充值" tips="充值兑换积分" @eventClick="navTo('/pages/ucenter/recharge/recharge')"></list-cell>
				<list-cell icon="iconfont icon-icon_GPS" iconColor="#5fcda2" title="地址管理" @eventClick="navTo('/pages/address/address')"></list-cell>
				<list-cell icon="iconfont icon-yaoqinghaoyou" iconColor="#9789f7" tips="邀请好友一起赚钱" title="分享"></list-cell>
				<list-cell icon="iconfont icon-icon_medal" iconColor="#ee883b" title="分销中心" tips="晒单抢红包" @eventClick="navTo('/pages/hexiao/yiorder/yiorder?id=-1')" v-if="isDistribut == 1"></list-cell>
				<list-cell icon="iconfont icon-icon_star" iconColor="#54b4ef" title="我的收藏" @eventClick="navTo('/pages/ucenter/collect/collect')"></list-cell>
				<list-cell icon="iconfont icon-icon_synergy" iconColor="#54b4ef" title="我的足迹" @eventClick="navTo('/pages/ucenter/footprint/footprint')"></list-cell>
				<list-cell icon="iconfont icon-saoma" iconColor="#e07472" title="核销扫码" border="" @eventClick="navTo('/pages/ucenter/scan/scan')"></list-cell>
				<list-cell icon="iconfont icon-icon_newgroup" iconColor="#e07472" title="店铺订单" border="" @eventClick="navTo('/pages/ucenter/shoporder/shoporder?id=-1')"></list-cell>
					
			</view>
		</view>
		<view class="logout" @tap="exitLogin">退出登录</view>
	</view>
</template>

<script>
import listCell from '@/wxcomponents/mix-list-cell';
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
	let startY = 0, moveY = 0, pageAtTop = true;
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
			isDistribut: 0
		};
	},

	components: {listCell},
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
		} else {
			wx.redirectTo({
				url: '../../customer/zcuslist/zcuslist?id=-2'
			});
			wx.removeStorageSync('userInfo');
		}

		this.setData({
			userInfo: getApp().globalData.userInfo
		});
	},
	onReady: function() {},
	onShow: function() {},
	onHide: function() {
		// 页面隐藏
	},
	onUnload: function() {
		// 页面关闭
	},
	onShareAppMessage: function() {
		this.noLogin();
		return {
			title: '邀请好友',
			path: 'pages/product/product?id=-1&userId=' + wx.getStorageSync('uId')
		};
	},
	methods: {
		navTo(url){
			uni.navigateTo({  
				url
			})  
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
<style lang="scss">
%flex-center {display: flex;flex-direction: column;justify-content: center;align-items: center;}
%section {display: flex;justify-content: space-around;align-content: center;background: #fff;border-radius: 10upx;}
.user-section {height: 520upx;padding: 100upx 30upx 0;position: relative;.bg {position: absolute;left: 0;top: 0;width: 100%;height: 100%;filter: blur(1px);opacity: .7;}
}
.user-info-box {height: 180upx;display: flex;align-items: center;position: relative;z-index: 1;.portrait {width: 130upx;height: 130upx;border: 5upx solid #fff;border-radius: 50%;}
	.username {font-size: $font-lg + 6upx;color: $font-color-dark;margin-left: 20upx;}
}
.vip-card-box {display: flex;flex-direction: column;color: #f7d680;height: 240upx;background: linear-gradient(left, rgba(0, 0, 0, .7), rgba(0, 0, 0, .8));border-radius: 16upx 16upx 0 0;overflow: hidden;position: relative;padding: 20upx 24upx;.card-bg {position: absolute;top: 20upx;right: 0;width: 380upx;height: 260upx;}
	.b-btn {position: absolute;right: 20upx;top: 16upx;width: 132upx;height: 40upx;text-align: center;line-height: 40upx;font-size: 22upx;color: #36343c;border-radius: 20px;background: linear-gradient(left, #f9e6af, #ffd465);z-index: 1;}
	.tit {font-size: $font-base+2upx;color: #f7d680;margin-bottom: 28upx;.yticon {color: #f6e5a3;margin-right: 16upx;}
	}
	.e-b {font-size: $font-sm;color: #d8cba9;margin-top: 10upx;}
}
.cover-container {background: $page-color-base;margin-top: -150upx;padding: 0 30upx;position: relative;background: #f5f5f5;padding-bottom: 20upx;.arc {position: absolute;left: 0;top: -34upx;width: 100%;height: 36upx;}
}
.tj-sction {@extend %section;.tj-item {@extend %flex-center;flex-direction: column;height: 140upx;font-size: $font-sm;color: #75787d;}
	.num {font-size: $font-lg;color: $font-color-dark;margin-bottom: 8upx;}
}
.order-section {@extend %section;padding: 28upx 0;margin-top: 20upx;.order-item {@extend %flex-center;width: 120upx;height: 120upx;border-radius: 10upx;font-size: $font-sm;color: $font-color-dark;}
	.yticon {font-size: 48upx;margin-bottom: 18upx;color: #fa436a;}
	.icon-shouhoutuikuan {font-size: 44upx;}
}
.history-section {padding: 30upx 0 0;margin-top: 20upx;background: #fff;border-radius: 10upx;.sec-header {display: flex;align-items: center;font-size: $font-base;color: $font-color-dark;line-height: 40upx;margin-left: 30upx;.yticon {font-size: 44upx;color: #5eba8f;margin-right: 16upx;line-height: 40upx;}
	}
	.h-list {white-space: nowrap;padding: 30upx 30upx 0;image {display: inline-block;width: 160upx;height: 160upx;margin-right: 20upx;border-radius: 10upx;}
	}
}
.logout{
    margin-top: 20rpx;
    height: 101rpx;
    width: 100%;
    line-height: 101rpx;
    text-align: center;
    color: #fff;
    font-size: 30rpx;
    background: #b4282d;
}
.service {
  position: static;
  background-color: transparent;
  /* color: transparent; */
  margin: 0;
  padding: 0;
  border: none;
  text-align: left;
  line-height: normal;
  display: inline;
}
</style>
