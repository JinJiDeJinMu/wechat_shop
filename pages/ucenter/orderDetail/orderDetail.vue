<template>
<view class="container order-container">
    <view class="order-info">
        <view class="item-a">下单时间：{{orderInfo.add_time}}</view>
        <view class="item-b">订单编号：{{orderInfo.order_sn}}</view>
        <view class="item-a" v-if="orderInfo.shipping_name">物流公司：{{orderInfo.shipping_name}}</view>
        <view class="item-b" v-if="orderInfo.shipping_no">物流编号：{{orderInfo.shipping_no}}</view>
        <view class="item-c">
            <view class="l">实付：<text class="cost">￥{{orderInfo.actual_price}}</text></view>
        </view>
    </view>

    <view class="order-goods">
        <view class="h">
            <view class="label">商品信息</view>
            <view class="status">{{orderInfo.order_status_text}}</view>
        </view>
        <view class="goods">
            <view class="item" v-for="(item, index) in orderGoods" :key="index">
                <view class="img">
					<navigator :url="'../../goods/goods?id=' + item.goods_id">
                    <image mode="aspectFit" :src="item.list_pic_url"></image>
					</navigator>
                </view>
                <view class="info">
                    <view class="t">
						<navigator :url="'../../goods/goods?id=' + item.id">
                        <text class="name">{{item.goods_name}}</text>
                        <text class="number">x{{item.number}}</text>
						</navigator>
                    </view>
                    <view class="attr">{{item.goods_specifition_name_value||''}}</view>
                    <view class="price">￥{{item.retail_price}}</view>
                </view>
            </view>
        </view>
</view>
    <view class="order-bottom">
        <view class="address">
            <view class="t">
                <text class="name">{{orderInfo.consignee}}</text>
                <text class="mobile">{{orderInfo.mobile}}</text>
            </view>
            <view class="b">{{orderInfo.full_region + orderInfo.address}}</view>
        </view>
        <view class="total">
            <view class="t">
                <text class="label">商品合计：</text>
                <text class="txt">￥{{orderInfo.goods_price}}</text>
            </view>
            <view class="t">
                <text class="label">运费：</text>
                <text class="txt">￥{{orderInfo.freight_price}}</text>
            </view>
        </view>
  </view>
     <view class="zhong" v-if="orderInfo.goods_type == 6 &&(orderInfo.order_status == 201||orderInfo.order_status == 206)">
      <view class="ts">到店自提核销凭证</view>
      <view class="img-box">
      <image @tap="previewImg" style="width: 450rpx;height: 450rpx;background:#f1f1f1;" :src="imagePath"></image>
  </view>
   </view> 
 <view class="canvas-box">
  <canvas :hidden="canvasHidden" style="width: 686rpx;height: 686rpx;background:#f1f1f1;" canvas-id="mycanvas"></canvas>
</view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var md5 = require("../../../utils/md5.js");
var api = require("../../../config/api.js");
import QR from "../../../utils/qrcode";
function countdown(that) {
  var second = that.data.second;

  console.log(second);
  if (second == 0) {
    return;
  }

  var time = setTimeout(function () {
    that.setData({
      second: second - 2
    });
    countdown(that);
  }, 4000);
}

export default {
  data() {
    return {
      second: 60,
      result: '',
      canvasHidden: false,
      maskHidden: true,
      imagePath: '',
      expireTime: 20,
      //过期时间，这里设置为20秒
      orderId: 0,
      orderInfo: {},
      orderGoods: [],
      handleOption: {}
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    console.log(this.orderId);
    this.getOrderDetail();
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
    checkHexiaoStatus: function (orderNo, orderId, userId, mId) {
      var that = this;
      var times = 0;
      let params = {
        orderNo: orderNo,
        orderId: orderId,
        userId: userId,
        merchantId: mId
      };
      var i = setInterval(function () {
        times++;

        if (times >= 18) {} else {clearInterval(i);}

        console.log(params);
        util.request(api.WriteOffCodeNotify, params).then(function (res) {
          if (res.errno === 0) {
            console.log(res);
            clearInterval(i);
            wx.navigateTo({
              url: '../msg/msgorder?id=' + orderId
            });
          }
        });
      }, 5000);
    },

    getOrderDetail() {
      let that = this;
      util.request(api.OrderDetail, {
        orderId: that.orderId
      }).then(function (res) {
        if (res.errno === 0) {
          console.log(res.data);
          that.setData({
            orderInfo: res.data.orderInfo,
            orderGoods: res.data.orderGoods,
            handleOption: res.data.handleOption
          });

          if (res.data.orderInfo.goods_type == 6 && (res.data.orderInfo.order_status == 201 || res.data.orderInfo.order_status == 206)) {
            let scene = 'orderType=hexiao';
            scene += '&price=' + res.data.orderInfo.all_price;
            scene += '&orderId=' + res.data.orderInfo.id;
            scene += '&orderNo=' + res.data.orderInfo.order_sn;
            scene += '&userId=' + res.data.orderInfo.user_id;
            scene += '&merchantId=' + res.data.orderInfo.merchant_id;
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            scene += '&timestamp=' + timestamp;
            scene += '&sign=' + md5.md5(scene);
            console.log(scene);
            var size = that.setCanvasSize(); //动态设置画布大小

            that.createQrCode(scene, "mycanvas", size.w, size.h);
            that.checkHexiaoStatus(res.data.orderInfo.order_sn, res.data.orderInfo.id, res.data.orderInfo.user_id, res.data.orderInfo.merchant_id);
          }
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

    payTimer() {
      let that = this;
      let orderInfo = that.orderInfo;
      setInterval(() => {
        console.log(orderInfo);
        orderInfo.add_time -= 1;
        that.setData({
          orderInfo: orderInfo
        });
      }, 1000);
    },

    cancelOrder() {
      console.log('开始取消订单');
      let that = this;
      let orderInfo = that.orderInfo;
      console.log(orderInfo);
      var order_status = orderInfo.order_status;
      console.log(order_status);
      var errorMessage = '';

      switch (order_status) {
        case 300:
          {
            console.log('已发货，不能取消');
            errorMessage = '订单已发货';
            break;
          }

        case 301:
          {
            console.log('已收货，不能取消');
            errorMessage = '订单已收货';
            break;
          }

        case 101:
          {
            console.log('已经取消');
            errorMessage = '订单已取消';
            break;
          }

        case 102:
          {
            console.log('已经删除');
            errorMessage = '订单已删除';
            break;
          }

        case 401:
          {
            console.log('已经退款');
            errorMessage = '订单已退款';
            break;
          }

        case 402:
          {
            console.log('已经退款退货');
            errorMessage = '订单已退货';
            break;
          }
      }

      if (errorMessage != '') {
        console.log(errorMessage);
        util.showErrorToast(errorMessage);
        return false;
      }

      wx.showModal({
        title: '',
        content: '确定要取消此订单？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            util.request(api.OrderCancel, {
              orderId: orderInfo.id
            }).then(function (res) {
              console.log(res.errno);

              if (res.errno === 0) {
                console.log(res.data);
                wx.showModal({
                  title: '提示',
                  content: res.data,
                  showCancel: false,
                  confirmText: '继续',
                  success: function (res) {
                    wx.navigateBack({
                      url: 'pages/ucenter/order/order'
                    });
                  }
                });
              }
            });
          }
        }
      });
    },

    payOrder() {
      let that = this;
      util.request(api.PayPrepayId, {
        orderId: that.orderId || 15
      }).then(function (res) {
        if (res.errno === 0) {
          const payParam = res.data;
          wx.requestPayment({
            'timeStamp': payParam.timeStamp,
            'nonceStr': payParam.nonceStr,
            'package': payParam.package,
            'signType': payParam.signType,
            'paySign': payParam.paySign,
            'success': function (res) {
              console.log(res);
            },
            'fail': function (res) {
              console.log(res);
            }
          });
        }
      });
    },

    confirmOrder() {
      //确认收货
      console.log('开始确认收货');
      let that = this;
      let orderInfo = that.orderInfo;
      console.log(orderInfo);
      var order_status = orderInfo.order_status;
      console.log(order_status);
      var errorMessage = '';

      switch (order_status) {
        case 300:
          {
            console.log('已发货，不能取消');
            errorMessage = '订单已发货';
            break;
          }

        case 301:
          {
            console.log('已收货，不能再收货');
            errorMessage = '订单已收货';
            break;
          }

        case 101:
          {
            console.log('已经取消');
            errorMessage = '订单已取消';
            break;
          }

        case 102:
          {
            console.log('已经删除');
            errorMessage = '订单已删除';
            break;
          }

        case 401:
          {
            console.log('已经退款');
            errorMessage = '订单已退款';
            break;
          }

        case 402:
          {
            console.log('已经退款退货');
            errorMessage = '订单已退货';
            break;
          }
      }

      if (errorMessage != '') {
        console.log(errorMessage);
        util.showErrorToast(errorMessage);
        return false;
      }

      console.log('可以取消订单的情况');
      wx.showModal({
        title: '',
        content: '确定已经收到商品？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            util.request(api.OrderConfirm, {
              orderId: orderInfo.id
            }).then(function (res) {
              console.log(res.errno);

              if (res.errno === 0) {
                console.log(res.data);
                wx.showModal({
                  title: '提示',
                  content: res.data,
                  showCancel: false,
                  confirmText: '继续',
                  success: function (res) {
                    wx.navigateBack({
                      url: 'pages/ucenter/order/order'
                    });
                  }
                });
              }
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
@import "./orderDetail.css";
</style>