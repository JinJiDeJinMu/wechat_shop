<template>
<view class="header">
  <view>
     <view class="header-con">
       <view class="header-left">
         <image :src="conten.userInfo.avatar" class="header-img"></image>
         <text class="con">{{conten.userInfo.nickname}}</text>
         <i-cell-group>
           <i-cell>
             <i-rate :value="conten.starLevel"></i-rate>
           </i-cell>
         </i-cell-group>
       </view>
       <view class="time">{{conten.createTime}}</view>
     </view>
     <!-- 评价内容 -->
     <view class="appraise">{{conten.content}}</view>
     <!-- 图片 -->
     <view class="tupain" v-for="(item, index) in conten.commentPictureList" :key="index">
        <image :src="item.picUrl"></image> 
     </view>
   </view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");
export default {
  data() {
    return {
      id:'',
	  conten:[]
    };
  },

  components: {
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
		id:options.order_no
	})
	this.query();
  },

 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
	  query: function() { 
		let that = this;
	  	util.request(api.CommentQuery,
		{orderNo:that.id}).then(function(res) {
			console.log(res.data);
			if(res.code == 200){
				if(res.data){
					that.setData({
						conten : res.data
					})
				}
			}
	  	});
		
	  },
    setData: function (obj, callback) {
      let that = this;
      let keys = [];
      let val, data;
      Object.keys(obj).forEach(function (key) {
        keys = key.split('.');
        val = obj[key];
        data = that.$data;
        keys.forEach(function (key2, index) {
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
@import "./detail.css";
</style>