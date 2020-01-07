<template>
<!--pages/hexiao/hexiao.wxml-->
<view class="hexiao">
  <view class="hexiao-group">
    <!-- 左边数据 -->
    <view class="group-left">
      <view>未结算(元)</view>
      <view>￥
        <text>435.90</text>
      </view>
    </view>
    <!-- 右边数据 -->
    <view class="group-right">
      <view>累计收益(元)</view>
      <view>￥
        <text>16788.90</text>
      </view>
    </view>
  </view>
  <view class="order_me">
    <view class="li">全部</view>
    <view class="li">已结算</view>
    <view class="li">待结算</view>
  </view>
  <!-- 列表 -->
  <view class="group-list">
    <view class="group-con">
      <!-- 时间 -->
      <view class="group-time">
        <view>今日</view>
        <view>10:53</view>
      </view>
      <view class="ding">
        <image src="../../static/images/ding1.png" class="ding-img"></image>
      </view>
      <view class="group-money">
        <view>￥
          <text>16788.90</text>
        </view>
        <view>6218743096582182394</view>
      </view>
      <!-- 待结算 -->
      <view class="dai">待结算</view>
    </view>

    <view class="group-con">
      <!-- 时间 -->
      <view class="group-time">
        <view>今日</view>
        <view>10:53</view>
      </view>
      <view class="ding">
        <image src="../../static/images/ding1.png" class="ding-img"></image>
      </view>
      <view class="group-money">
        <view>￥
          <text>16788.90</text>
        </view>
        <view>6218743096582182394</view>
      </view>
      <!-- 待结算 -->
      <view class="dai">待结算</view>
    </view>
    <view class="group-con">
      <!-- 时间 -->
      <view class="group-time">
        <view>今日</view>
        <view>10:53</view>
      </view>
      <view class="ding">
        <image src="../../static/images/ding1.png" class="ding-img"></image>
      </view>
      <view class="group-money">
        <view>￥
          <text>16788.90</text>
        </view>
        <view>6218743096582182394</view>
      </view>
      <!-- 待结算 -->
      <view class="dai">待结算</view>
    </view>
    <view class="group-con">
      <!-- 时间 -->
      <view class="group-time">
        <view>今日</view>
        <view>10:53</view>
      </view>
      <view class="ding">
        <image src="../../static/images/ding1.png" class="ding-img"></image>
      </view>
      <view class="group-money">
        <view>￥
          <text>16788.90</text>
        </view>
        <view>6218743096582182394</view>
      </view>
      <!-- 待结算 -->
      <view class="dai">待结算</view>
    </view>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
@import "./hexiao.css";
</style>