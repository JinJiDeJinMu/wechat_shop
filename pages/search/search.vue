<template>
	<view>
		<van-search :value="value" placeholder="请输入搜索关键词" use-action-slot @search="onSearch" @change="onChange"><view slot="action" @tap="sousuo">搜索</view></van-search>

		<view class="container">
			<view class="zuixin">
				<view class="goods1" v-for="(item, key) in key" :key="key">
					<navigator :url="'../goods/goods?id=' + item.id">
						<image :src="item.list_pic_url" class="goods11"></image>
						<view class="goods12">{{ item.name }}</view>
						<view class="goods13">
							<view class="goods131">￥{{ item.retail_price }}</view>
							<view class="goods132" v-if="model.market_price">￥{{ item.market_price }}</view>
						</view>
					</navigator>
				</view>
				<view class="empty-view" style="margin-top: 30%" v-if="key.length <= 0">
					<image mode="aspectFit" class="icon" src="../../static/images/allorder.png"></image>
					<text class="text">无商品数据</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
import vanSearch from '../../wxcomponents/vant-weapp/search';
import vanButton from '../../wxcomponents/vant-weapp/button';

export default {
	data() {
		return {
			key: [],
			word: ''
		};
	},

	components: {
		vanSearch,
		vanButton
	},
	props: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
	methods: {
		sousuo() {
			this.getDate();
		},

		onSearch(e) {
			var word = e.detail;
			this.setData({
				word: word
			});
			this.getDate();
		},

		onChange(e) {
			var word = e.detail;
			console.log(word);
			this.setData({
				word: word
			});
		},

		getDate() {
			var that = this;
			wx.request({
				url: 'http://school.chundengtai.com/api/search/search',
				//仅为示例，并非真实的接口地址
				data: {
					keyword: this.word
				},
				header: {
					'content-type': 'application/json' // 默认值
				},

				success(res) {
					that.setData({
						key: res.data.data.data
					});
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
<style>
@import './search.css';
</style>
