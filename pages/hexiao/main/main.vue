<template>
<view>
<!--pages/main/index.wxml-->
<view class="container-box">
    <view class="img-box">
        <image @tap="previewImg" mode="scaleToFill" :src="imagePath"></image>
    </view>
    <form @submit="formSubmit">
        <view class="input-row">
            <label>网址</label>
            <input name="url" value type="text" maxlength="255" :placeholder="placeholder"></input>
        </view>
        <!--<view class="input-row">
            <label>金额</label>
            <input name="money" type="number" maxlength="7"  placeholder="1000000"/>
        </view>-->
        <button formType="submit" class="mybtn" type="primary">生成二维码</button>
    </form>
      <button @tap="getScancode" class="mybtn" type="primary">扫描二维码</button>
</view>
<view :hidden="maskHidden" class="mask"></view>
<view class="canvas-box">
  <canvas :hidden="canvasHidden" style="width: 686rpx;height: 686rpx;background:#f1f1f1;" canvas-id="mycanvas"></canvas>
</view>
</view>
</template>

<script>
// pages/main/index.js
var QR = require("../../../utils/qrcode.js");

export default {
  data() {
    return {
      result: '',
      canvasHidden: false,
      maskHidden: true,
      imagePath: '',
      placeholder: 'http://school.chundengtai.com?uid=eeeerr&timestamp=939393&orderNo=20198878272&procode=iiuuywere' //默认二维码生成文本

    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize(); //动态设置画布大小

    var initUrl = this.placeholder;
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
  },
  onReady: function () {},
  onShow: function () {// 页面显示
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    getScancode: function () {
      var _this = this; // 允许从相机和相册扫码


      wx.scanCode({
        success: res => {
          wx.navigateTo({
            url: '/pages/my/my?title=' + res.result
          });
          var result = res.result;

          _this.setData({
            result: result
          });
        }
      });
    },
    //适配不同屏幕大小的canvas
    setCanvasSize: function () {
      var size = {};

      try {
        var res = wx.getSystemInfoSync();
        var scale = 750 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽

        var width = res.windowWidth / scale;
        var height = width; //canvas画布为正方形

        size.w = width;
        size.h = height;
      } catch (e) {
        // Do something when catch error
        console.log("获取设备信息失败" + e);
      }

      return size;
    },
    createQrCode: function (url, canvasId, cavW, cavH) {
      //调用插件中的draw方法，绘制二维码图片
      QR.api.draw(url, canvasId, cavW, cavH);
      setTimeout(() => {
        this.canvasToTempImage();
      }, 1000);
    },
    //获取临时缓存照片路径，存入data中
    canvasToTempImage: function () {
      var that = this;
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
            imagePath: tempFilePath // canvasHidden:true

          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    },
    //点击图片进行预览，长按保存分享图片
    previewImg: function (e) {
      var img = this.imagePath;
      console.log(img);
      wx.previewImage({
        current: img,
        // 当前显示图片的http链接
        urls: [img] // 需要预览的图片http链接列表

      });
    },
    formSubmit: function (e) {
      var that = this;
      var url = e.detail.value.url;
      that.setData({
        maskHidden: false
      });
      wx.showToast({
        title: '生成中...',
        icon: 'loading',
        duration: 2000
      });
      var st = setTimeout(function () {
        wx.hideToast();
        var size = that.setCanvasSize();
        var size = that.setCanvasSize(); //动态设置画布大小

        var initUrl = that.placeholder; //that.createQrCode(initUrl, "mycanvas", size.w, size.h);
        //绘制二维码

        that.createQrCode(url, "mycanvas", size.w, size.h);
        that.setData({
          maskHidden: true
        });
        clearTimeout(st);
      }, 2000);
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
@import "./main.css";
</style>