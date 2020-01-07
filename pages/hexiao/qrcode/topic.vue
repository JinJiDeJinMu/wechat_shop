<template>
<view class="container">
     <image style="width: 200px; height: 200px; background-color: #eeeeee;" :src="imgUrl"></image>
<canvas style="width: 200px; height: 200px;" canvas-id="myQrcode"></canvas>

</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");
import drawQrcode from "../../../utils/weapp.qrcode.min";
var app = getApp().globalData;

export default {
  data() {
    return {
      token: '',
      imgUrl: '' // 小程序二维码

    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    getToken();
    console.log("---------1--------"); // 页面初始化 options为页面跳转所带来的参数

    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: 'https://github.com/yingye'
    });
    console.log("----------2-------");
  },
  onReady: function () {// 页面渲染完成
  },
  onShow: function () {// 页面显示
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    getToken() {
      let that = this;
      wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa637df01806a720c&secret=4f19e83e8f687889eb1c9c7cedd7930c',
        // 具体传参见文档
        success: res => {
          console.log(res);
          that.setData({
            token: res.data.access_token
          });
          that.getUnlimited(res.data.access_token);
        }
      });
    },

    getUnlimited(id) {
      const that = this;
      wx.request({
        url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + id,
        // 切记tooken连接在地址后面，不要放在data中，否则会导致报错，token过期
        data: {
          scene: wx.getStorageSync('thisCode'),
          page: 'pages/index/index',
          width: 280,
          is_hyaline: true
        },
        header: {
          'content-type': 'application/json;charset=utf-8'
        },
        responseType: 'arraybuffer',
        // 很重要一定要传
        method: 'POST',
        // 一定要用POST，用get报错
        success: res => {
          // res中data这时看是个空数组，但经过下面解析就会出现数据
          let data = wx.arrayBufferToBase64(res.data);
          that.setData({
            imgUrl: 'data:image/PNG;base64,' + data // 一定不要漏掉

          });
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
@import "./topic.css";
</style>