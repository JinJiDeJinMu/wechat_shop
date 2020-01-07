<template>
<!--pages/hexiao/portrait/portrait.wxml-->
<view class="portrait">
  <view class="portrait-header">
    <view>头像</view>
    <view>
      <image v-if="userInfo && userInfo.avatarUrl" :src="userInfo.avatarUrl" class="header-img"></image>
    </view>
  </view>
  <view class="portrait-header">
    <view>名称</view>
    <view>{{userInfo.userName?userInfo.userName:userInfo.nickName}}</view>
  </view>
  <view class="portrait-header">
    <view>手机号</view>
    <view>{{tel}}</view>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      userInfo: {},
      isshow: false,
      isDistribut: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token'); //console.log(userInfo);
    // 页面显示

    if (token) {
      this.setData({
        isshow: true,
        isDistribut: wx.getStorageSync('isDistribut')
      });
      getApp().globalData.userInfo = userInfo.userInfo;
      getApp().globalData.token = token;
    } else {
      wx.redirectTo({
        url: '../../customer/zcuslist/zcuslist?id=-2'
      });
      wx.removeStorageSync('userInfo');
    }

    this.setData({
      userInfo: getApp().globalData.userInfo
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
@import "./portrait.css";
</style>