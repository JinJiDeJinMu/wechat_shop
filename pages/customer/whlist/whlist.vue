<template>
<!--pages/customer/whlist/whlist.wxml-->
<view class="container"> 
  <view class="cus-list" v-if="whList.length > 0">
    <view class="cusBox" v-for="(item, index) in whList" :key="index"> 
      <view class="common" style="background:linear-gradient(to right, #fc6c64, #fc9e5e)">
        <view class="cusli">
           <image :src="item.loginPassword"></image>    
        </view>
        <view class="cusli">
           <view class="li">{{item.nickname || ''}}</view>
        </view> 
      </view>   
    </view> 
  </view> 
  <view class="empty-view" v-if="whList.length <= 0">
      <image class="icon" src="../../../static/images/allorder.png"></image>
      <text class="text">无粉丝</text>
  </view>
</view>
</template>

<script>
// pages/customer/whlist/whlist.js
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");

export default {
  data() {
    return {
      whList: []
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("下一页");
    this.getWhList();
  },

  onPullDownRefresh() {
    // 增加下拉刷新数据的功能
    wx.showNavigationBarLoading();
    var self = this;
    self.getWhList();
  },

  onReady: function () {// 页面渲染完成
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
      success: function () {}
    });
    this.getWhList();
    setInterval(() => {
      wx.hideLoading();
    }, 1000);
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    getWhList() {
      let that = this;
      util.request(api.FansList, {}, 'POST').then(function (res) {
        if (res.errno === 0) {
          that.setData({
            whList: res.data
          });
          wx.hideLoading();
        }

        wx.hideNavigationBarLoading(); //完成停止加载

        wx.stopPullDownRefresh(); //停止下拉刷新
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
@import "./whlist.css";
</style>