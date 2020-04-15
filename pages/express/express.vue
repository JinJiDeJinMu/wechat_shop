<template>
<!--pages/express/express.wxml-->
<view class="container">
  <view class="wrapper">
    <view class="deliveryInfo" style="background:url(http://jiales.gz-yami.com/delivery-bg.png) center center no-repeat #fff;">
      <view class="icon-express" style="background:url(http://jiales.gz-yami.com/delivery-car.png) no-repeat;background-size:100% 100%;">
      </view>
      <view class="infoWarp">
        <view class="companyname">
          <text class="key">物流公司：</text>
          <text class="value"></text>
        </view>
        <view class="expno">
          <text class="key">运单编号：</text>
          <text class="value"></text>
        </view>
      </view>
    </view>
    <view class="deliveryDetail">
      <block v-for="(item, index) in dvyData" :key="index">
        
        <view :class="'detailItem ' + (index==0?'lastest':'')">
          <view class="dot">
            <image src="../../static/icon/delive-dot.png"></image>
             <image src="../../static/icon/dot.png"></image>
          </view>
          <view class="detail">
            <view class="desc">{{item.context}}</view>
            <view class="time">{{item.time}}</view>
          </view>
        </view>
      </block>
    </view>
  </view>
</view>
</template>

<script>
// pages/express/express.js
var util = require("../../utils/util.js");
var api = require("../../config/api.js");

export default {
  data() {
    return {
      companyName: "",
      // 运单编号
      dvyFlowId: "",
      dvyData: [],
      orderId: 0,
      orderInfo: {},
      orderGoods: [],
      handleOption: {}
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    wx.showLoading();
    this.setData({
      orderId: options.order_no
    }); // console.log(this.data.orderId);

    this.viewlook();
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
    viewlook() {
      let that = this;
      util.request(api.OrderDetail, {
        orderId: that.orderId
      }).then(function (res) {
        console.log(res.data);
        that.setData({
          dvyFlowId: res.data.orderInfo.order_sn
        });
        wx.hideLoading();
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
@import "./express.css";
</style>