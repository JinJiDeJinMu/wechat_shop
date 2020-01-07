<template>
<view class="page">
    <view class="weui-msg">
       <view class="iconfont icon-saoma" style="font-size:50px">
        </view>
        <view class="weui-msg__text-area">
            <view class="weui-msg__title">核销扫码</view>
      </view>
    <view class="page__bd page__bd_spacing">
      <button class="weui-btn" type="primary" @tap="getScancode">核销扫描</button>
    </view>
    </view>
</view>
</template>

<script>
var utils = require("../../../utils/util.js");

export default {
  data() {
    return {};
  },

  components: {},
  props: {},
  onLoad: function (options) {
    console.log("index 生命周期 onload" + JSON.stringify(options)); //在此函数中获取扫描普通链接二维码参数

    let q = decodeURIComponent(options.scene);

    if (q) {
      console.log("index 生命周期 onload url=" + q);
      console.log("index 生命周期 onload 参数 flag=" + utils.getQueryString(q, 'orderNo'));
    }

    let currentUser = getApp().globalData.userInfo;
    console.log(JSON.stringify(currentUser));
    wx.setStorage({
      key: "mydata",
      data: {
        name: 'xiaoming',
        age: 30
      },
      success: function () {
        console.log('----------'); //wx.navigateBack();   //返回上一个页面
      }
    });
  },
  methods: {
    getScancode: function () {
      var _this = this; // 允许从相机和相册扫码


      wx.scanCode({
        success: res => {
          console.log(res.result);
          wx.navigateTo({
            url: '../orderHexiao/orderHexiao?id=' + res.result
          });
          var result = res.result;
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
@import "./scan.css";
</style>