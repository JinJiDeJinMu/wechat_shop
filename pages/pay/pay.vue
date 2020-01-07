<template>
<view class="container">
  <view class="total">
    <view class="label">订单金额</view>
    <view class="txt">{{actualPrice}}元</view>
  </view>
  <view class="pay-list">
    <view class="h">请选择支付方式</view>
    <view class="b">
      <view class="item">
        <view class="checkbox checked"></view>
        <image src="../../static/images/wxpay.png" class="icon"></image>
        <view class="name">微信支付</view>
      </view>
    </view>
  </view>
  <view class="tips">小程序只支持微信支付，如需其它支付方式，请在网页版支付</view>
  <view class="pay-btn" @tap="startPay">确定</view>
</view>
</template>

<script>
var util = require("../../utils/util.js");
var api = require("../../config/api.js");

export default {
  data() {
    return {
      orderId: 0,
      actualPrice: 0.00
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId,
      actualPrice: options.actualPrice
    });
  },
  onReady: function () {},
  onShow: function () {// 页面显示
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    //向服务请求支付参数
    requestPayParam() {
      let that = this;
      util.request(api.PayPrepayId, {
        orderId: that.orderId,
        payType: 1
      }).then(function (res) {
        if (res.errno === 0) {
          let payParam = res.data;
          wx.requestPayment({
            'timeStamp': payParam.timeStamp,
            'nonceStr': payParam.nonceStr,
            'package': payParam.package,
            'signType': payParam.signType,
            'paySign': payParam.paySign,
            'success': function (res) {
              wx.redirectTo({
                url: '/pages/payResult/payResult?status=true&orderId=' + that.orderId
              });
            },
            'fail': function (res) {
              wx.redirectTo({
                url: '/pages/payResult/payResult?status=false&orderId=' + that.orderId
              });
            }
          });
        }
      });
    },

    startPay() {
      this.requestPayParam();
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
@import "./pay.css";
</style>