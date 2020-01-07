<template>
<view class="unsettled">
  <view class="hexiao-group">
    <!-- 左边数据 -->
    <view class="group-left">
      <view>未结算</view>
      <view class="money-l">￥
        <text class="qian">{{unsetMoney||0}}元</text>
      </view>
    </view>
    <!-- 右边数据 -->
    <view class="group-right">
      <view>可提现</view>
      <view class="money-l">￥
        <text class="qian">{{totalMoney||0}}元</text>
      </view>
    </view>
     <view class="zan-btn zan-btn--small  zan-btn--primary" style="float:left;margin-top:20rpx;" @tap="getGoldApply">提现</view>
  </view>

  <!-- 列表 -->
  <view class="group-list" v-for="(item, index) in earnList" :key="index">
    <view class="group-con">
      <!-- 时间 -->
      <view class="group-time">
        <view>{{item.createdTime}}</view>
      </view>
      <view class="ding">
        <image src="../../../static/images/ding1.png" class="ding-img"></image>
      </view>
      <view class="group-money">
        <view>￥
          <text>{{item.money}}</text>
        </view>
        <view>{{item.orderSn}}</view>
      </view>
      <!-- 待结算 -->
      <view class="dai">{{item.statusText}}</view>
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
      page: 1,
      size: 10,
      totalPages: 1,
      earnList: [],
      unsetMoney: 0,
      totalMoney: 0
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    let isDistribut = wx.getStorageSync('isDistribut');

    if (isDistribut) {} else {}

    this.getEarningMoneyList();
  },
  onReachBottom: function () {
    this.getEarningMoneyList();
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    var self = this;
    self.setData({
      earnList: [],
      page: 1,
      totalPages: 1
    });
    self.getEarningMoneyList();
  },

  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onShareAppMessage: function () {},
  methods: {
    // 头像信息
    getGoldApply() {
      wx.navigateTo({
        url: '/pages/customer/auth/auth'
      });
    },

    getEarningMoneyList: function () {
      let that = this;
      util.request(api.getUserEarnings, {
        pageIndex: that.page,
        pageSize: that.size
      }).then(function (res) {
        console.log(res);

        if (res.code === 0) {
          that.setData({
            earnList: that.earnList.concat(res.data.list),
            page: res.data.pageNum + 1,
            totalPages: res.data.total,
            unsetMoney: res.unsetMoney,
            totalMoney: res.totalMoney
          });
          wx.setStorageSync('unsetMoney', res.unsetMoney);
          wx.hideLoading();
        } else {
          console.log(res);
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
@import "./unsettled.css";
</style>