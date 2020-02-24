<template>
<view class="container">
  <view class="order_me">
    <view :class="'li ' + ( orderId == -1  ? 'active' : '')" data-id="-1" @tap="switchCate">全部</view>
    <view :class="'li ' + ( orderId == 0  ? 'active' : '')" data-id="0" @tap="switchCate">待付款</view>
<!--    <view :class="'li ' + ( orderId == 206 ? 'active' : '')" data-id="206" @tap="switchCate">待使用</view> -->
    <view :class="'li ' + ( orderId == 207 ? 'active' : '')" data-id="207" @tap="switchCate">待收货</view>
    <view :class="'li ' + ( orderId == 402 ? 'active' : '')" data-id="402" @tap="switchCate">已完成</view>
	<view :class="'li ' + ( orderId == 403 ? 'active' : '')" data-id="403" @tap="switchCate">已评价</view>
  </view>
  <view class="orders">
    <navigator :url="'../orderDetail/orderDetail?id=' + item.id" class="order" v-for="(item, index) in orderList" :key="index">
      <view class="order-goods">
        <view class="h">
          <view class="label">订单号:{{item.order_sn}}</view>
          <view class="status">{{item.order_status_text}}</view>
        </view>
        <view class="goods">
          <view class="item">
            <view class="img">
              <image mode="aspectFit" :src="item.list_pic_url"></image>
            </view>
            <view class="info">
              <view class="t">
                <text class="name">{{item.goods_name}}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="b">
          <view class="r">共{{item.goods_num||1}}件商品 需付款：
            <text>￥{{item.actual_price}}</text> </view>
        </view>
        <view class="b">
          <view class="r">
            <button class="btn gopay" :data-order-index="index" @tap.native.stop="payOrder" v-if="item.handleOption.pay">去付款</button>
            <button class="btn gocancel" :data-order-index="index" @tap.native.stop="cancelOrder" v-if="item.handleOption.cancel">取消订单</button>
            <button class="btn gopay" :data-order-index="index" @tap.native.stop="confirmOrder" v-if="item.handleOption.confirm">确认收货</button>
            <button class="btn gopay" :data-order-index="index" @tap.native.stop="buyOrder" v-if="item.handleOption.buy">再次购买</button>
            <button class="btn gopay" :data-order-index="index" @tap.native.stop="commentOrder" v-if="item.handleOption.comment">评价</button>
			 <button class="btn gopay" :data-order-index="index" @tap.native.stop="lookcomment" v-if="item.handleOption.lookcomment">查看评价</button>
            <button class="btn gopay" :data-order-index="index" @tap.native.stop="logistics" v-if="item.handleOption.logistics">查看物流</button>
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
      orderId: '',
      orderList: [],
      page: 1,
      size: 10,
      loadmoreText: '正在加载更多数据',
      nomoreText: '全部加载完成',
      nomore: false,
      totalPages: 1,
      con: true  
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    this.setData({
     orderId: options.id
    });	
    wx.showLoading({
      title: '加载中...'
    });
    this.getOrderList(); // 根据id判断评价

    if (this.orderId == 1) {
      this.setData({
        con: !this.con
      });

      if (!this.con) {
		  console.log("ssss");
        wx.navigateTo({
          url: '/pages/goods/detail/detail?orderno='+orderId,
        });
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   this.getOrderList();
  },

  onPullDownRefresh: function() {
    var self = this;
    self.setData({
      orderList: [],
	  page: 1,
	  size: 10,
	  totalPages:1
    });
   self.getOrderList();
   wx.stopPullDownRefresh(); //停止下拉刷新
  },

  onReady: function () {// 页面渲染完成
  },
  onShow: function () {},
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    switchCate: function (event) {
      wx.showLoading({
        title: '加载中...'
      });
      var currentTarget = event.currentTarget;
	  console.log('=='+currentTarget.dataset.id);
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
		that.orderId = that.orderId == "" ? -1 :that.orderId
          that.setData({
            orderList: that.orderList.concat(res.data.list),
            page: res.data.endRow+1,
            totalPages: res.data.total
          });
          wx.hideLoading();
        }
      });
    },

    payOrder(event) {
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.orderList[orderIndex];
      wx.redirectTo({
        url: '/pages/pay/pay?orderId=' + order.id + '&actualPrice=' + order.actual_price
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
                wx.showModal({
                  title: '提示',
                  content: res.data,
                  showCancel: false,
                  confirmText: '继续',
                  success: function (res) {
                    wx.switchTab({
                      url: '/pages/ucenter/index/index'
                    });
                  }
                });
              }
            });
          }
        }
      });
    },

    confirmOrder(event) {
      //确认收货
      console.log('开始确认收货');
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.orderList[orderIndex];
      console.log('可以取消订单的情况');
      wx.showModal({
        title: '',
        content: '确定已经收到商品？',
        success: function (res) {
          if (res.confirm) {
            util.request(api.OrderConfirm, {
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

    // 再次购买
    buyOrder(event) {
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.orderList[orderIndex];
      console.log(order.goods_id);
      wx.navigateTo({
        url: '/pages/goods/goods?id=' + order.goods_id
      });
    },

    // 评价
    commentOrder(event) {
      console.log(event);
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.orderList[orderIndex];
      wx.navigateTo({
        url: '/pages/goods/publish/publish?order_no=' + order.id + '&good_id=' + order.goods_id + '&user_id=' + order.user_id
      });
    },
	//查看评论
	lookcomment(event){
		let that = this;
		let orderIndex = event.currentTarget.dataset.orderIndex;
		let order = that.orderList[orderIndex];
		console.log(order)
		wx.navigateTo({
		  url: '/pages/goods/detail/detail?order_no=' + order.id
		});
	},
    // 查看物流
    logistics(event) {
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.orderList[orderIndex];
      wx.navigateTo({
        url: '/pages/express/express?order_no=' + order.id + '&good_id=' + order.goods_id + '&user_id=' + order.user_id
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
@import "./order.css";
</style>