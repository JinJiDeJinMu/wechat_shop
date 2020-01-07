<template>
<view class="container">
    <view class="order_me">
       <view :class="'li ' + ( orderId ==-1  ? 'active' : '')" data-id="-1" @tap="switchCate">全部</view>
      <view :class="'li ' + ( orderId == 206 ? 'active' : '')" data-id="206" @tap="switchCate">待使用</view>
       <view :class="'li ' + ( orderId == 201 ? 'active' : '')" data-id="201" @tap="switchCate">待收货</view>
       <view :class="'li ' + ( orderId == 402 ? 'active' : '')" data-id="402" @tap="switchCate">已完成</view>
    </view>
    <view class="orders">
        <navigator :url="'../orderDetail/orderDetail?id=' + item.id" class="order" v-for="(item, index) in orderList" :key="index">
            <view class="order-goods">
              <view class="h">
                  <view class="label">订单号:{{item.orderSn}}</view>
                  <view class="status">{{item.statusText}}</view>
              </view>
              <view class="goods">
                  <view class="item">
                      <view class="info">
                          <view class="t">
                              <text class="name">分销等级:{{item.level}}</text> 
							  </view>
							   <view class="t">
							  <text class="name">创建时间:{{item.createdTime}}</text>
							   </view>
						<!-- 	    <view class="t">
							  <text class="name">完成时间:{{item.completeTime}}</text> 
							  </view> -->
							   <view class="t">
							  <text class="name">购买用户:{{item.nickname}}</text> 
							  </view>
                      </view>
                  </view>
              </view>
              <view class="b">
                <view class="r">所得佣金:{{item.money}} 订单金额：<text>￥{{item.goodsPrice}}</text>                  </view> 
              </view>
               <view class="b"> 
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
    <image mode="aspectFit" class="icon" src="../../../static/images/allorder.png"></image>
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
      warnText: '无订单数据',
      orderId: -1,
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
    wx.showLoading({
      title: '加载中...',
      success: function () {}
    });
    this.getOrderList();
  },
  onReachBottom: function () {
    this.getOrderList();
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    var self = this;
    self.setData({
      orderList: [],
      page: 1,
      totalPages: 1
    });
    self.getOrderList();
  },

  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  methods: {
    switchCate: function (event) {
      wx.showLoading({
        title: '加载中...'
      });
      var currentTarget = event.currentTarget;
      this.setData({
        orderId: currentTarget.dataset.id,
        totalPages: 1,
        page: 1,
        orderList: []
      });
      this.getOrderList();
    },

    getOrderList() {
      let that = this;
      that.orderId = that.orderId == -1 ? 0 : that.orderId;
      util.request(api.OrderShareDistributionList, {
        pageIndex: that.page,
        pageSize: that.size,
        status: that.orderId
      }).then(function (res) {
        console.log(res);

        if (res.code === 0) {
          that.setData({
            orderList: that.orderList.concat(res.data.list),
            page: res.data.currentPage + 1,
            totalPages: res.data.total
          });
          wx.hideLoading();
        } else {
          that.setData({
            warnText: res.msg
          });
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
@import "./shareorder.css";
</style>