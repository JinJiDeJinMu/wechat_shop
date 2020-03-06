<template>
	<!--pages/enjoy/enjoy.wxml-->
	<view class="enjoy" v-if="ad_content.length >0">
		<u-parse :content="ad_content" @preview="preview" @navigate="navigate" ></u-parse>
	</view>
</template>

<script>
	const util = require("../../utils/util.js");
	const api = require("../../config/api.js");
	import uParse from '../../wxcomponents/u-parse/u-parse.vue';
export default { 
	data() {
		return {
			ad_content:''
		};
	},

	components: {uParse},
	props: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var that = this;
		util.request(api.BannerContent,{bannerId:options.id}).then(function (res) {
			console.log(res.data.content)
			if(res.code == 200){
				if(res.data.content_show){
					that.setData({
					 ad_content :res.data.content_show.content
					});
				}
			}
		 
		});
		
	},

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
		preview(src, e) {
		     // do something
		   },
		   navigate(href, e) {
		     // do something
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
@import './enjoy.css';
</style>
