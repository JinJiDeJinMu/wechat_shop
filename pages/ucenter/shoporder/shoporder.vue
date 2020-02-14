<template>
	<view class="container">
		<view class="order_me">
			<view :class="'li ' + (orderId == -1 ? 'active' : '')" data-id="-1" @tap="switchCate">全部</view>
			<view :class="'li ' + (orderId == 0 ? 'active' : '')" data-id="0" @tap="switchCate">待付款</view>
			<view :class="'li ' + (orderId == 206 ? 'active' : '')" data-id="206" @tap="switchCate">待使用</view>
			<view :class="'li ' + (orderId == 201 ? 'active' : '')" data-id="201" @tap="switchCate">待收货</view>
			<view :class="'li ' + (orderId == 402 ? 'active' : '')" data-id="402" @tap="switchCate">已完成</view>
		</view>
		<view class="orders">
			<navigator :url="'../orderDetail/orderDetail?id=' + item.id" class="order" v-for="(item, index) in orderList" :key="index">
				<view class="order-goods">
					<view class="h">
						<view class="label">商品信息</view>
						<view class="status">{{ item.order_status_text }}</view>
					</view>
					<view class="goods">
						<view class="item">
							<view class="img"><image mode="aspectFit" :src="item.list_pic_url"></image></view>
							<view class="info">
								<view class="t">
									<text class="name">{{ item.goods_name }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="b">
						<view class="r">
							共{{ item.goods_num || 1 }}件商品 需付款：
							<text>￥{{ item.actual_price }}</text>
						</view>
					</view>
					<view class="b">
						<view class="r">
							<button class="btn gopay" :data-order-index="index" @tap.native.stop="confirmOrder" v-if="item.handleOption.confirm">确认收货</button>
						</view>
					</view>
				</view>
			</navigator>
		</view>

		<view v-if="orderList.length > 6" class="loadmore">
			<block v-if="nomore">
				<text>{{ nomoreText }}</text>
			</block>
			<block v-else>
				<text class="iconfont icon-loading loading" space="nbsp"></text>
				<text>{{ loadmoreText }}</text>
			</block>
		</view>
		<view class="empty-view" v-if="orderList.length <= 0">
			<image mode="aspectFit" class="icon" src="../../../static/images/allorder.png"></image>
			<text class="text">无订单数据</text>
		</view>
	</view>
</template>

<script>
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

export default {
	data() {
		return {
			warnText: '无订单数据',
			orderId: '',
			orderList: [],
			page: 1,
			size: 10,
			loadmoreText: '正在加载更多数据',
			nomoreText: '全部加载完成',
			nomore: false,
			totalPages: 1
		};
	},

	components: {},
	props: {},
	onLoad: function(options) {
		this.setData({
			orderId: options.id
		});
		wx.showLoading({
			title: '加载中...',
			success: function() {}
		});
		this.getOrderList();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		this.getOrderList();
	},

	onPullDownRefresh() {
		// 增加下拉刷新数据的功能
		wx.showNavigationBarLoading();
		var self = this;
		self.setData({
			orderList: [],
			page: 1,
			totalPages: 1
		});
		self.getOrderList();
	},

	onReady: function() {
		// 页面渲染完成
	},
	onShow: function() {},
	onHide: function() {
		// 页面隐藏
	},
	onUnload: function() {
		// 页面关闭
	},
	methods: {
		switchCate: function(event) {
			wx.showLoading({
				title: '加载中...'
			});
			var currentTarget = event.currentTarget;
			this.setData({
				orderId: currentTarget.dataset.id,
				totalPages: 1,
				page: 1,
				orderList: []
			});
			this.getOrderList();
		},

		getOrderList() {
			let that = this;
			let merchantId = wx.getStorageSync('merchantId');

			if (merchantId == '' || merchantId == '0' || merchantId == 'null' || merchantId == null) {
				util.showErrorToast('没有店铺限核销扫码,请重新登录或联系管理员');
				return false;
			}

			if (that.totalPages <= that.page - 1) {
				that.setData({
					nomore: true
				});
				return;
			}

			that.orderId = that.orderId == -1 ? '' : that.orderId;
			util.request(api.ShopOrderList, {
				page: that.page,
				size: that.size,
				merchantId: merchantId,
				order_status: that.orderId
			}).then(function(res) {
				that.orderId = that.orderId == "" ? -1 :that.orderId
				if (res.errno === 0) {
					that.setData({
						orderList: that.orderList.concat(res.data.list),
						page: res.data.currentPage + 1,
						totalPages: res.data.total
					});
					wx.hideLoading();
				} else {
					that.setData({
						warnText: res.errorMsg
					});
				}

				wx.hideNavigationBarLoading(); //完成停止加载

				wx.stopPullDownRefresh(); //停止下拉刷新
			});
		},

		confirmOrder(event) {
			//确认收货
			console.log('开始确认收货');
			let that = this;
			let orderIndex = event.currentTarget.dataset.orderIndex;
			let order = that.orderList[orderIndex];
			console.log('可以取消订单的情况');
			wx.showModal({
				title: '',
				content: '确定已经收到商品？',
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定');
						util.request(api.OrderConfirm, {
							orderId: order.id
						}).then(function(res) {
							console.log(res.errno);

							if (res.errno === 0) {
								console.log(res.data);
								wx.showModal({
									title: '提示',
									content: res.data,
									showCancel: false,
									confirmText: '继续',
									success: function(res) {
										//  util.redirect('/pages/ucenter/order/order');
										wx.navigateBack({
											url: 'pages/ucenter/order/order'
										});
									}
								});
							}
						});
					}
				}
			});
		},

		buyOrder(event) {
			let that = this;
			let orderIndex = event.currentTarget.dataset.orderIndex;
			let order = that.orderList[orderIndex];
			console.log('------------------');
			console.log(order.goods_id);
			wx.navigateTo({
				url: '/pages/goods/goods?id=' + order.goods_id
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
<style>
@import './shoporder.css';
</style>
