<template>
<view class="container" v-if="isshow">
  <button class="userinfo">
    <view>
      <image v-if="userInfo && userInfo.avatarUrl" class="userinfo-avatar" :src="userInfo.avatarUrl" background-size="cover"></image>
    </view>
    <view class="marleft">
      <button class="userbutton" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">
        <view class="userinfo-nickname">
          <text style="font-size:20px;font-weight:bold;">{{ userInfo.userName?userInfo.userName:userInfo.nickName }}</text>
        </view>
      </button>
      <view class="userinfo-mobile" v-if="fUser.nickname">
        <text class="txt">推荐人: {{fUser.nickname}}</text>
      </view>
    </view>
  </button>
  <view class="my_order">
    <view class="cont">
      <view class="l">我的订单</view>
      <view class="r">
        <navigator url="/pages/ucenter/order/order?id=-1" class="a">
          <text>查看全部订单  </text>
          <image class="ordergo" src="../../../static/images/go.png" background-size="cover"></image>
        </navigator>
        <text class="jt"></text>
      </view>
    </view>
    <view class="order_detai">
      <view class="li">
        <navigator url="/pages/ucenter/order/order?id=0" class="a">
          <text class="icon dfk"></text>
          <text class="txt">待付款</text>
        </navigator>
      </view>
      <view class="li">
        <navigator url="/pages/ucenter/order/order?id=201" class="a">
          <text class="icon dfh"></text>
          <text class="txt">待发货</text>
        </navigator>
      </view>
      <view class="li">
        <navigator url="/pages/ucenter/order/order?id=201" class="a">
          <text class="icon dsh"></text>
          <text class="txt">待收货</text>
        </navigator>
      </view>
      <view class="li">
        <navigator url="/pages/ucenter/return/return?id=201" class="a">
          <text class="icon tk"></text>
          <text class="txt">退货/退款</text>
        </navigator>
      </view>
    </view>
  </view>
  <view style="clear:both;height:20rpx;background: #eee;width:100%;"></view>
  <view class="user-menu">
    <view class="menu_tit">
      <text class="menu_top">我的服务</text>
    </view>
    <button class="service" open-type="share">
      <view class="item no-border">
        <navigator url="url" class="a">
          <text class="iconfont icon-yaoqinghaoyou"></text>
          <text class="txt">邀请好友</text>
        </navigator>
      </view>
    </button>
    <view class="item">
      <navigator url="/pages/customer/list/list" class="a">
        <text class="iconfont icon-icon_likegood"></text>
        <text class="txt">推荐商品</text>
      </navigator>
    </view>
    <view class="item">
      <navigator url="/pages/ucenter/collect/collect" class="a">
        <text class="iconfont icon-icon_star"></text>
        <text class="txt">我的收藏</text>
      </navigator>
    </view>
    <view class="item">
      <navigator url="/pages/ucenter/footprint/footprint" class="a">
        <text class="iconfont icon-icon_synergy"></text>
        <text class="txt">我的足迹</text>
      </navigator>
    </view>
    <view class="item">
      <navigator url="/pages/ucenter/feedback/feedback" class="a">
        <text class="iconfont icon-icon_compile"></text>
        <text class="txt">意见反馈</text>
      </navigator>
    </view>
    <view class="item">
      <navigator url="../address/address" class="a">
        <text class="iconfont icon-icon_GPS"></text>
        <text class="txt">地址管理</text>
      </navigator>
    </view>
    <view class="item item-bottom">
      <navigator url="../../customer/whlist/whlist" class="a">
        <text class="iconfont icon-icon_group"></text>
        <text class="txt">我的粉丝</text>
      </navigator>
    </view>
    <view class="item item-bottom">
      <navigator url="/pages/ucenter/scan/scan" class="a">
        <text class="iconfont icon-saoma"></text>
        <text class="txt">核销扫码</text>
      </navigator>
    </view>
    <view class="item item-bottom">
      <navigator url="../../shopMap/shopMap" class="a">
        <text class="iconfont icon-dingwei"></text>
        <text class="txt">定位</text>
      </navigator>
    </view>
    
    <view class="item item-bottom">
      <navigator url="/pages/ucenter/shoporder/shoporder?id=-1" class="a">
        <text class="iconfont icon-icon_dispose"></text>
        <text class="txt">店铺订单</text>
      </navigator>
    </view>

    <view class="item item-bottom" v-if="isDistribut==1">
      <navigator url="/pages/hexiao/yiorder/yiorder?id=-1" class="a">
        <text class="iconfont icon-icon_medal"></text>
        <text class="txt">分销中心</text>
      </navigator>
    </view>

    <button class="service" open-type="contact">
      <view class="item no-border">
        <navigator url="url" class="a">
          <text class="iconfont icon-icon_service_fill"></text>
          <text class="txt">联系客服</text>
        </navigator>
      </view>
    </button>
  </view>
  <view class="logout" @tap="exitLogin">退出登录</view>
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
      hasMobile: '',
      fUser: {},
      commission: {
        allProfit: 0,
        getProfit: 0
      },
      isshow: false,
      isDistribut: 0
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

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
  onReady: function () {},
  onShow: function () {},
  onHide: function () {// 页面隐藏 
  },
  onUnload: function () {// 页面关闭 
  },
  onShareAppMessage: function () {
    this.noLogin();
    return {
      title: '邀请好友',
      path: 'pages/product/product?id=-1&userId=' + wx.getStorageSync('uId')
    };
  },
  methods: {
    getScancode: function () {
      let currentUser = getApp().globalData.userInfo;
      console.log(JSON.stringify(currentUser));
      let merchantId = wx.getStorageSync('merchantId');

      if (merchantId == "" || merchantId == "0" || merchantId == "null" || merchantId == null) {
        wx.showToast({
          title: '请退出登录,重新登录再试',
          icon: 'fail',
          duration: 2000
        });
      } else {
        // 允许从相机和相册扫码
        wx.scanCode({
          success: res => {
            console.log(res.result);
            wx.navigateTo({
              url: '../orderHexiao/orderHexiao?' + res.result
            });
          }
        });
      }
    },

    noLogin() {
      if (!wx.getStorageSync('token')) {
        wx.showToast({
          title: '请先登录～',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
    },

    doWithdraw() {
      let that = this;
      wx.navigateTo({
        url: '../../customer/auth/auth'
      });
    },

    bindGetUserInfo(e) {
      let token = wx.getStorageSync('token');

      if (token) {
        return false;
      }

      if (e.detail.userInfo) {
        //用户按了允许授权按钮
        user.loginByWeixin(e.detail).then(res => {
          let userInfo = wx.getStorageSync('userInfo');
          this.setData({
            userInfo: userInfo.userInfo,
            isshow: true
          });
          getApp().globalData.userInfo = userInfo.userInfo;
          getApp().globalData.token = res.data.openid;
          this.initDataInfo();
          this.initYJInfo();
        }).catch(err => {
          console.log(err);
        });
      } else {
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告通知',
          content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: res => {
                  if (res.authSetting["scope.userInfo"]) {
                    ////如果用户重新同意了授权登录
                    user.loginByWeixin(e.detail).then(res => {
                      let userInfo = wx.getStorageSync('userInfo');
                      this.setData({
                        userInfo: userInfo.userInfo,
                        isDistribut: userInfo.isDistribut,
                        isshow: true
                      });
                      getApp().globalData.userInfo = userInfo.userInfo;
                      getApp().globalData.token = res.data.openid;
                    }).catch(err => {
                      console.log(err);
                    });
                  }
                }
              });
            }
          }
        });
      }
    },

    exitLogin: function () {
      let that = this;
      wx.showModal({
        title: '提示',
        confirmColor: '#b4282d',
        content: '退出登录？',
        success: function (res) {
          if (res.confirm) {
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('userId');
            wx.removeStorageSync('isReal');
            wx.removeStorageSync('uId');
            wx.removeStorageSync('merchantId');
            wx.removeStorageSync('isDistribut');
            getApp().globalData.userInfo = {};
            that.setData({
              userInfo: {}
            });
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
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
@import "./index.css";
</style>