<template>
	<view>
		  <uni-search-bar maxlength="30" @confirm="search"  @input="input" @cancel="cancel"></uni-search-bar>
		<view calss="container">
			<!-- <view class="row sort-nav-box bg-white">
						<view class="col-xs-3 item" v-for="(item, index) in filter_list" :key="index" @click="filter(item.field,filter_sort=='desc'?'asc':'desc')" v-if="key.length>0">
							<view class="txt" v-bind:class="filter_field==item.field?'ac':''">{{item.title}}</view>
							<image :src="'../../static/images/sort-'+filter_sort+'.png'" style="height:20rpx;width:20rpx;" v-if="filter_field==item.field && filter_sort" class="m-l-5"></image>
						</view>
			        </view>
					 -->
					 <view class='container bg-white'>
					 			<view class='row p-t-20 p-b-20'>
					 				<view class='col-xs-9 p-l-10'>
					 					<view class='flex-align-start'>
					 						<view class='rec1 rec'></view>
					 						<view class='fs-15 f-black'>我搜索过的</view>
					 					</view>
					 				</view>
					 				<!-- <view class='col-xs-3 p-r-10 tr p-r-20'>
					 					<image src="/static/images/del.png" style='height:30rpx;width:30rpx;'></image>
					 				</view> -->
					 			</view>
					 			<view class='row'>
					 				<view class='col-xs-12 p-l-10 p-r-10'>
					 					<view class='srcbtn' v-for="(item, index) in history" :key="index" @tap.native.stop="bindimg" :data-con="item">{{item}}</view>
					 					<view class='noHistoryItem' v-if="searchRecord.length==0">你还没有搜索记录</view>
					 				</view>
					 			</view>
					 		</view>
		</view>
	</view>
</template>


<script>
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
import uniSearchBar from '../../wxcomponents/dist/uni-search-bar/uni-search-bar.vue';
import uniIcons from '../../wxcomponents/dist/uni-icons/uni-icons.vue';


export default {
	data() {
		return {
			
			key: [],
			word: '',
			value:'',
			history:[]
			
		};
	},

	components: {
		uniSearchBar,
		uniIcons
	},
	props: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.getSearchHistory();
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
		input(e){
			if(e.value !=null){
				this.setData({
					word: e.value
				});				
			}				
		},
		search(e){
				if(e.value !=null){	
					this.setData({
						word: e.value
					});
					this.toGoodList();
				}
		},
        cancel(){
			var that = this;
			that.setData({
				key: []
			});
		},
	
	  toGoodList(){
		  var that = this;
		  wx.navigateTo({
		    url: '/pages/entry/entry?keyword='+that.word
		  });
	  },
	  getSearchHistory(){
		  let that = this;
		  util.request(api.SearchHistory).then(function (res) {
		    if (res.errno === 0) {		
		  		if(res.data){
					that.setData({
						history:res.data
					})
				}
		    }
		  });
	  },
	  bindimg(e) {
		let that = this;
	  	that.setData({
			word: e.currentTarget.dataset.con
		})
	   that.toGoodList();
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
@import "../../static/css/main.css";
</style>
