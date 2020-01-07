<template>
<!--pages/goods/detail/detail.wxml-->
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
    <view v-for="(i, index) in conten.commentPictureList" :key="index">
      <view class="tupain">
        <image :src="i.pic_url"></image>
      </view>
    </view>
  </view>
</view>
</template>

<script>
import iRate from "../../../wxcomponents/dist/rate/index";

export default {
  data() {
    return {
      conten: []
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
    console.log(options);
    let con = JSON.parse(decodeURIComponent(options.content)); // let con = JSON.parse(options.content)

    this.setData({
      conten: con
    });
    console.log(this.conten);
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