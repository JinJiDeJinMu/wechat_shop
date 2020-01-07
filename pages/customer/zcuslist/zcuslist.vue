<template>
<!--pages/customer/cuslist/cuslist.wxml-->
<view class="container"> 
  <view class="cont">
    <view class="selinfo">
      <image class="sel" src="../../../static/images/Welogo.png"></image>
      <label>未名严选 申请获得</label>
    </view>
    <view class="tit">以下权限</view>
    <view class="selinfo">
        <!-- <image class="sel" src="../../../static/images/icon_xz.png"></image> -->
        <label>获取你的公开信息（昵称、头像、地区及性别）</label>
    </view>
    <view class="bottom-btn">
        <button class="r" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">同意</button>
    </view>
    <view class="bottom-new" v-if="id == -2">
        <button class="r" @tap="goUrl">拒绝</button>
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
      id: 0,
      type: null,
      userId: 0,
      userInfo: {}
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    var that = this;

    if (options.id) {
      that.setData({
        id: options.id
      });
    }

    if (options.type) {
      that.setData({
        type: options.type
      });
    }
  },
  onReady: function () {// 页面渲染完成
  },
  onShow: function () {},
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    bindGetUserInfo(e) {
      let that = this;
      let token = wx.getStorageSync('token');
      wx.showLoading({
        title: '加载中'
      });

      if (token) {
        that.setFid();
        return false;
      } else {
        if (e.detail.userInfo) {
          console.log('-----------登录------请求---------'); //用户按了允许授权按钮

          user.loginByWeixin(e.detail).then(res => {
            let userInfo = wx.getStorageSync('userInfo');
            that.setData({
              userInfo: userInfo.userInfo
            });
            getApp().globalData.userInfo = userInfo.userInfo;
            getApp().globalData.token = res.data.openid;
            that.setFid();
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
                        that.setData({
                          userInfo: userInfo.userInfo
                        });
                        getApp().globalData.userInfo = userInfo.userInfo;
                        getApp().globalData.token = res.data.openid;
                        that.setFid();
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
      }
    },

    setFid: function () {
      let that = this;

      if (that.id == -1) {
        wx.switchTab({
          url: '../../index/index'
        });
      } else if (that.id == -2) {
        wx.switchTab({
          url: '../../ucenter/index/index'
        });
      } else {
        wx.navigateTo({
          url: '../../goods/goods?id=' + that.id + '&type=' + that.type
        });
      }

      wx.hideLoading();
    },
    goUrl: function () {
      wx.switchTab({
        url: '/pages/index/index'
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
@import "./zcuslist.css";
</style>