<template>
<view class="container">
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
                    <image :src="item.list_pic_url"></image>
                </view>
                <view class="info">
                    <view class="t">
                        <text class="name">{{item.goods_name}}</text>
                        <text class="number">x{{item.number}}</text>
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
        <view class="pay-fee">
            <text class="label">实付：</text>
            <text class="txt">￥{{orderInfo.actual_price}}</text>
        </view>
    </view>
    <view class="page__bd page__bd_spacing">
    <button class="weui-btn" type="primary" @tap="confirmHexiao">确认核销               </button>
  </view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");

export default {
  data() {
    return {
      result: '',
      canvasHidden: false,
      maskHidden: true,
      imagePath: '',
      orderId: 0,
      orderInfo: {},
      orderGoods: [],
      handleOption: {},
      hexiaoParams: {}
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    console.log("index 生命周期 onload" + JSON.stringify(options)); //在此函数中获取扫描普通链接二维码参数

    let q = decodeURIComponent(options);

    if (q) {
      console.log("index 生命周期 onload url=" + q);
      let id = util.getQueryString(q, 'id');
      console.log("index 生命周期 onload 参数 flag=" + util.getQueryString(q, 'id'));
      let params = JSON.parse(JSON.stringify(options)); // 页面初始化 options为页面跳转所带来的参数

      this.setData({
        orderId: params.orderId,
        hexiaoParams: params
      });
      this.getOrderDetail();
    }
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
          }); //that.payTimer();
        }
      });
    },

    confirmHexiao() {
      let that = this;
      let orderInfo = that.orderInfo;
      let hexiaoParam = that.hexiaoParams;
      console.log('可以取消订单的情况');
      let merchantId = wx.getStorageSync('merchantId');

      if (merchantId == "" || merchantId == "0" || merchantId == "null" || merchantId == null) {
        wx.showToast({
          title: '没有店铺限核销扫码,请联系管理员',
          icon: 'fail',
          duration: 2000
        });
      }

      if (merchantId == hexiaoParam.merchantId) {
        wx.showModal({
          title: '核销订单确认',
          content: '确定要核销此订单？',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              util.request(api.WriteOffUrl, {
                orderId: hexiaoParam.orderId,
                orderNo: hexiaoParam.orderNo,
                userId: hexiaoParam.userId,
                merchantId: hexiaoParam.merchantId,
                timestamp: hexiaoParam.timestamp
              }, 'POST', 'application/x-www-form-urlencoded').then(function (res) {
                if (res.errno === 0) {
                  console.log(res);
                  wx.navigateTo({
                    url: '../msg/msg_success?orderNo=' + hexiaoParam.orderNo
                  });
                }
              });
            }
          }
        });
      } else {
        wx.showToast({
          title: '没有店铺权限,请联系管理员',
          icon: 'fail',
          duration: 2000
        });
      }
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

      console.log('可以取消订单的情况');
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
@import "./orderHexiao.css";
</style>