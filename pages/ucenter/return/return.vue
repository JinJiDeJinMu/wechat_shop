<template>
<view class="container">
    <view class="orders">
        <navigator :url="'../orderDetail/orderDetail?id=' + item.id" class="order" v-for="(item, index) in orderList" :key="index">
            <view class="order-goods">
              <view class="h">
                  <view class="label">商品信息</view>
                  <view class="status">{{item.order_status_text}}</view>
              </view>
              <view class="goods">
                  <view class="item">
                      <view class="img">
                          <image :src="item.list_pic_url"></image>
                      </view>
                      <view class="info">
                          <view class="t">
                              <text class="name">{{item.goods_name}}</text> 
                          </view> 
                      </view>
                  </view>
              </view>
              <view class="b">
                <view class="r">共{{item.goodsCount}}件商品 需付款：￥{{item.actual_price}}                  </view> 
              </view>
               <view class="b"> 
                <view class="r">
                    <button class="btn" :data-order-index="index" @tap.native.stop="cancelOrder" v-if="item.handleOption.cancel">退款</button>
                </view>
              </view> 
          </view> 
        </navigator>
    </view>

    <view v-if="orderList.length>6" class="loadmore">
      <block v-if="nomore">
        <text>{{nomoreText}}</text>
      </block>
      <block v-else>
        <text class="iconfont icon-loading loading" space="nbsp"></text>
        <text> {{loadmoreText}}</text>
      </block>
    </view>
     <view class="empty-view" v-if="orderList.length <= 0">
      <image class="icon" src="../../../static/images/allorder.png"></image>
      <text class="text">无订单数据</text>
    </view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");

export default {
  data() {
    return {
      orderId: '',
      orderList: [],
      page: 1,
      size: 10,
      loadmoreText: '正在加载更多数据',
      nomoreText: '全部加载完成',
      nomore: false,
      totalPages: 1
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    this.setData({
      orderId: options.id
    });
    console.log(options);
    wx.showLoading({
      title: '加载中...',
      success: function () {}
    });
    this.getOrderList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("下一页");
    this.getOrderList();
  },
  onReady: function () {// 页面渲染完成
  },
  onShow: function () {},
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    getOrderList() {
      let that = this;

      if (that.totalPages <= that.page - 1) {
        that.setData({
          nomore: true
        });
        return;
      }

      that.orderId = that.orderId == -1 ? "" : that.orderId;
      util.request(api.OrderList, {
        page: that.page,
        size: that.size,
        order_status: that.orderId
      }).then(function (res) {
        if (res.errno === 0) {
          console.log(res.data);
          that.setData({
            orderList: that.orderList.concat(res.data.data),
            page: res.data.currentPage + 1,
            totalPages: res.data.totalPages
          });
          wx.hideLoading();
        }
      });
    },

    cancelOrder(event) {
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.orderList[orderIndex];
      console.log('可以取消订单的情况');
      wx.showModal({
        title: '',
        content: '确定要取消此订单？',
        success: function (res) {
          if (res.confirm) {
            util.request(api.OrderCancel, {
              orderId: order.id
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
@import "./return.css";
</style>