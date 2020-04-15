<template>
<view class="container">
					<view class="row item-comment-box">					
						<view class="col-xs-12 content-box" v-if="pinglun.length>0">
							<view class="item" v-for="(item, index) in pinglun" :key="index">
								<view class="avatar"><image :src="item.userInfo.avatar" class="bg-f5" mode="aspectFill"/></view>
								<view class="user">
								<text class="name">{{item.userInfo.nickname}}   
								</text>
								<i-cell-group>
								  <i-cell>
									<i-rate :value="item.starLevel"></i-rate>
								  </i-cell>
								</i-cell-group>
								<text class="time">{{item.createTime}}</text>
								</view>
								<view class="text text-ellipsis">
									{{item.content}}
								</view>
		
								<view class="imgs" v-if="item.commentPictureList>0">
									<view  v-for="(model, index) in item.commentPictureList" :key="index" mode="aspectFill" >
										<image :src="model.picUrl" style="width:80rpx;height:80rpx;" class="bg-f5"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");
var user = require("../../../services/user.js");


export default {
  data() {
    return {
      idd: '',
      commentPictureList: [],
      userInfo: [],
      content: [],
      pinglun: [],
      time: []
    };
  },

  components: {
  
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  console.log(options.id);
    this.setData({
      idd: options.id
    });
    var that = this;
    util.request(api.CommentList, {
      goodId: that.idd
    }, "GET").then(function (res) {
      that.setData({
        pinglun: res.data.list
      });
      that.setData({
        pinglun: that.pinglun
      });
    });
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
    detail(e) {
      console.log(e);
      var content = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.name)); // var content = JSON.stringify(e.currentTarget.dataset.name);

      wx.navigateTo({
        url: '../detail/detail?content=' + content
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
@import "../../../static/css/main.css";
</style>