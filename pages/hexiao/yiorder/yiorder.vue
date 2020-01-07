<template>
<view class="yiorder">
  <!-- 头部 -->
  <view class="yiorder-header" @tap="yicenter">
    <!-- 图片 -->
    <view>
      <image v-if="userInfo && userInfo.avatarUrl" :src="userInfo.avatarUrl" class="header-img"></image>
    </view>
    <!-- 公司  电话 -->
    <view class="header-job">
      <text class="job">{{userInfo.userName?userInfo.userName:userInfo.nickName}}</text>
      <text class="phone">{{tel}}</text>
    </view>
  </view>
  <view class="cumulative">
    <view class="cumulative-profit" style="width:550rpx;float:left;">可提现收益</view>
        <view class="zan-btn zan-btn--small  zan-btn--primary" style="float:left;" @tap="unsettled">提现</view>
    <view class="cumulative-money" style="clear:both;">
      <text>￥</text>
      <text>{{userSummery.totalIncome||0}}</text>
    </view>
  </view>
  <!-- 累计收益 -->
  <view class="cumulative">
    <view class="cumulative-profit">累计收益</view>
    <view class="cumulative-money">
      <text>￥</text>
      <text>{{userSummery.totalIncome||0}}</text>
    </view>
  </view>
  <!-- 未结算 -->
  <view class="unsettled" @tap="unsettled">
    <view class="unsettled-wei">查看收入明细</view>
    <view class="unsettled-money">
      <text>￥{{userSummery.unbalanced||0}}</text>
      <text>></text>
    </view>
  </view>
    <view class="unsettled" @tap="shareOrderList">
    <view class="unsettled-wei">查看分销订单</view>
    <view class="unsettled-money">
      <text>￥{{userSummery.shareOrderNum||0}}</text>
      <text>></text>
    </view>
  </view>
    <view class="unsettled" @tap="unsettled">
    <view class="unsettled-wei">查看合伙奖励收益</view>
    <view class="unsettled-money">
      <text>￥{{userSummery.partnerIncome||0}}</text>
      <text>></text>
    </view>
  </view>
  <!-- 群管 -->
  <view class="grouptube">
    <view class="group">
      <image src="../../../static/images/man.png"></image>
      <view class="group-qun">群管</view>
    </view>
    <view class="hexiao-group">
      <!-- 左边数据 -->
      <view class="group-left" @tap="groupleft">
        <view>{{userSummery.statsPerson||0}}</view>
        <view>我的群管</view>
      </view>
      <!-- 右边数据 -->
      <view class="group-right" @tap="groupright">
        <view class="right-money">￥
          <text>{{userSummery.statsIncome||0}}</text>
        </view>
        <view>累计收益</view>
      </view>
    </view>
    <view class="my-two" @tap="mytwo">
      <view>{{userSummery.speedPartner||0}}</view>
      <view>我的加速度合伙人</view>
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
      userInfo: {},
      tel: '',
      userSummery: {},
      hasMobile: '',
      totalShouyi: 0,
      isshow: false,
      isDistribut: 0
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
    this.getUserDistributionInfo();
  },
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
    // 头像信息
    yicenter() {
      wx.navigateTo({
        url: '/pages/hexiao/portrait/portrait'
      });
    },

    // 我的群管
    groupleft() {
      wx.navigateTo({
        url: '/pages/hexiao/groupone/groupone'
      });
    },

    // 加速度合伙人
    mytwo() {
      wx.navigateTo({
        url: '/pages/hexiao/grouptwo/grouptwo'
      });
    },

    // 未结算
    unsettled() {
      wx.navigateTo({
        url: '/pages/hexiao/unsettled/unsettled'
      });
    },

    shareOrderList() {
      wx.navigateTo({
        url: '/pages/ucenter/shareorder/shareorder'
      });
    },

    // 累计收益
    groupright() {
      wx.navigateTo({
        url: '/pages/hexiao/hexiao'
      });
    },

    getUserDistributionInfo: function () {
      let that = this;
      util.request(api.getUserDistributionInfo, {}).then(function (res) {
        console.log(res);

        if (res.code === 0) {
          if (res.data) {
            that.setData({
              userSummery: res.data.list
            });
          }
        } else {
          console.log(res);
        }
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
@import "./yiorder.css";
</style>