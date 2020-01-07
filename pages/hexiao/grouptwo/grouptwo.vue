<template>
<!--pages/hexiao/grouptwo/grouptwo.wxml-->
<!--pages/hexiao/groupone/groupone.wxml-->
<view class="groupone">
  <view class="my-two">
    <view class="one-img">
      <image src="../../../static/images/man1.png"></image>
    </view>
    <view class="my-jia">群管:
      <text>26</text>人</view>
  </view>
   <view class="yiorder-header" @tap="yiorder">
    <!-- 图片 -->
    <view>
      <image src="../../../static/images/Welogo.png" class="header-img"></image>
    </view>
    <!-- 公司  电话 -->
    <view class="group-show">
      <view class="header-job">
        <view class="job">怪女孩</view>
        <view class="phone">
          <text>团队奉献:</text>
          <text>￥25.9</text>
        </view>
      </view>
      <!-- 查看累计收益 -->
      <!-- <view class="group-show"> -->
      <view class="show">
        <view class="show-cha">
          <text>查看累计收益</text>
          <image src="../../../static/images/address_right.png" class="cha-img"></image>
        </view>
      </view>
    </view>
  </view>
   <view class="yiorder-header">
    <!-- 图片 -->
    <view>
      <image src="../../../static/images/Welogo.png" class="header-img"></image>
    </view>
    <!-- 公司  电话 -->
    <view class="group-show">
      <view class="header-job">
        <view class="job">怪女孩</view>
        <view class="phone">
          <text>团队奉献:</text>
          <text>￥25.9</text>
        </view>
      </view>
      <!-- 查看累计收益 -->
      <!-- <view class="group-show"> -->
      <view class="show">
        <view class="show-cha">
          <text>查看累计收益</text>
          <image src="../../../static/images/address_right.png" class="cha-img"></image>
        </view>
      </view>
    </view>
  </view>
  <view class="yiorder-header">
    <!-- 图片 -->
    <view>
      <image src="../../../static/images/Welogo.png" class="header-img"></image>
    </view>
    <!-- 公司  电话 -->
    <view class="group-show">
      <view class="header-job">
        <view class="job">怪女孩</view>
        <view class="phone">
          <text>团队奉献:</text>
          <text>￥25.9</text>
        </view>
      </view>
      <!-- 查看累计收益 -->
      <!-- <view class="group-show"> -->
      <view class="show">
        <view class="show-cha">
          <text>查看累计收益</text>
          <image src="../../../static/images/address_right.png" class="cha-img"></image>
        </view>
      </view>
    </view>
  </view>
  <view class="yiorder-header">
    <!-- 图片 -->
    <view>
      <image src="../../../static/images/Welogo.png" class="header-img"></image>
    </view>
    <!-- 公司  电话 -->
    <view class="group-show">
      <view class="header-job">
        <view class="job">怪女孩</view>
        <view class="phone">
          <text>团队奉献:</text>
          <text>￥25.9</text>
        </view>
      </view>
      <!-- 查看累计收益 -->
      <!-- <view class="group-show"> -->
      <view class="show">
        <view class="show-cha">
          <text>查看累计收益</text>
          <image src="../../../static/images/address_right.png" class="cha-img"></image>
        </view>
      </view>
    </view>
  </view>
  <view class="yiorder-header">
    <!-- 图片 -->
    <view>
      <image src="../../../static/images/Welogo.png" class="header-img"></image>
    </view>
    <!-- 公司  电话 -->
    <view class="group-show">
      <view class="header-job">
        <view class="job">怪女孩</view>
        <view class="phone">
          <text>团队奉献:</text>
          <text>￥25.9</text>
        </view>
      </view>
      <!-- 查看累计收益 -->
      <!-- <view class="group-show"> -->
      <view class="show">
        <view class="show-cha">
          <text>查看累计收益</text>
          <image src="../../../static/images/address_right.png" class="cha-img"></image>
        </view>
      </view>
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
    yiorder() {
      wx.navigateTo({
        url: '/pages/hexiao/hexiao',
        success: function (res) {}
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
@import "./grouptwo.css";
</style>