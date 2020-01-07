<template>
<view class="container">
  <view class="help">使用说明</view>
  <view class="empty-view" v-if="couponList.length <= 0">
    <image class="icon" src="../../../static/images/allorder.png"></image>
    <text class="text">无优惠卷信息</text>
  </view>
  <view v-else class="coupon-list">
    <block v-for="(item, index) in couponList" :key="index">
      <view :data-item="item" @tap="tapCoupon" class="item" :style="'background: ' + (item.coupon_status==1?'linear-gradient(to right,#cfa568,#e3bf79)':'linear-gradient(to right,#999,#DDDDDD)')">
        <view class="content">
          <view class="left">
            <view class="name">{{item.name}}</view>
            <view class="time">有效期至{{item.use_end_date}}</view>
          </view>
          <view class="right">
            <image v-if="item.coupon_status==1" class="mid-img" src="../../../static/images/coupon_ksy.png"></image>
            <image v-if="item.coupon_status==3" class="mid-img" src="../../../static/images/coupon_bky.png"></image>
          </view>
        </view>
        <view class="condition">
          <text class="txt">满￥{{item.min_goods_amount}} 减￥{{item.type_money}}</text>
        </view>
      </view>
    </block>
  </view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");
import showEmptyData from "../../../wxcomponents/show-empty-data/show-empty-data";

export default {
  data() {
    return {
      couponList: null,
      buyType: ''
    };
  },

  components: {
    showEmptyData
  },
  props: {},
  onLoad: function (options) {
    this.buyType = options.buyType;
    var merchantId = options.merid;
    var goodsTotalPrice = options.price;
    this.validCouponList(merchantId, goodsTotalPrice);
  },
  methods: {
    validCouponList: function (merchantId, goodsTotalPrice) {
      let that = this;
      util.request(api.ValidCouponList, {
        merchantId: merchantId,
        goodsTotalPrice: goodsTotalPrice
      }).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            couponList: res.data
          });
        }
      });
    },

    /**
     * 点击不使用优惠券
     * 返回上一页
     */
    noUseCoupon: function () {
      getApp().globalData.userCoupon = 'NO_USE_COUPON';
      wx.navigateBack({});
    },
    tapCoupon: function (event) {
      let item = event.currentTarget.dataset.item;

      if (item.coupon_status != 1) {
        return;
      }

      getApp().globalData.userCoupon = 'USE_COUPON';
      getApp().globalData.courseCouponCode = item;
      wx.navigateBack({});
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
@import "./selCoupon.css";
</style>