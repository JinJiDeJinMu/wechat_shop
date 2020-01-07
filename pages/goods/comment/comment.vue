<template>
<!--pages/goods/comment/comment.wxml-->
<view class="header">
  <view class="empty-view" style="margin-top: 10%;height: 5%;" v-if="pinglun.length <= 0">
    <image mode="aspectFit" class="icon" src="../../../static/images/allorder.png"></image>
    <text class="text">该商品暂无评论数据</text>
  </view>
  <view v-for="(item, index) in pinglun" :key="index" class="con-top" @tap="detail" :data-name="item">
    <view class="header-con">
      <view class="header-left">
        <image :src="item.userInfo.avatar" class="header-img"></image>
        <text class="con">{{item.userInfo.nickname}}</text>
        <i-cell-group>
          <i-cell>
            <i-rate :value="item.starLevel"></i-rate>
          </i-cell>
        </i-cell-group>
      </view>
      <text class="time">{{item.createTime}}</text>
    </view>
    <!-- 评价内容 -->
    <view class="appraise">{{item.content}}</view>
    <!-- 图片 -->
    <view class="tupain" v-for="(model, index2) in item.commentPictureList" :key="index2">
      <image :src="model.picUrl"></image>
    </view>
  </view>

</view>
</template>

<script>

// pages/goods/comment/comment.js
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");
var user = require("../../../services/user.js");
import iRate from "../../../wxcomponents/dist/rate/index";

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
    iRate
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      idd: options.id
    });
    var that = this;
    util.request('http://school.chundengtai.com/api/v2/comment/list', {
      goodId: that.idd
    }, "GET").then(function (res) {
      that.setData({
        pinglun: res.data.list
      });

      for (var i = 0; i < that.pinglun.length; i++) {
        that.pinglun[i].createTime = util.formatTimeTwo(that.pinglun[i].createTime, 'Y-M-D h:m:s');
      }

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
@import "./comment.css";
</style>