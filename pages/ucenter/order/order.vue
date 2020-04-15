<template>
 	<view>
 		<view class="container">
 			<!-- <view class="row bg-fa" style="border-bottom:1px solid #d6d6d6;">
 				<view class="col-xs-10 p-t-8 p-b-8 p-r-0">
 				<view class="index-search-box style2" style="background:#ededed;">
 					<image src="/static/images/search.png" class="search" style="width:30rpx;height:30rpx;"></image>
 					<input type="text" name="keywords" placeholder="搜索订单编号、商品名称等" placeholder-style='color:#c2c2c2;' />
 					<text class='close z9'></text>
 				</view>
 				</view>
 				<view class="col-xs-2 block tc p-t-10 p-b-10 fs-15" style="line-height:56rpx;background:none;">搜索</view>
 			</view> -->
 			<view class="row nav-box bg-white" style="border-bottom:1px solid #d6d6d6;">
 				<view class="col-xs-2 pc-20 item" v-bind:class="orderId==-1?'ac':''" data-id="-1" @tap="switchCate">
 				<text>全部</text>
 				</view>
 				<view class="col-xs-2 pc-20 item" v-bind:class="orderId==0?'ac':''" data-id="0" @tap="switchCate">
 				<text>待付款</text>
 				</view>
 				<view class="col-xs-2 pc-20 item" v-bind:class="orderId==208?'ac':''" data-id="208" @tap="switchCate">
 				<text>待发货</text>
 				</view>
 				<view class="col-xs-2 pc-20 item" v-bind:class="orderId==207?'ac':''" data-id="207" @tap="switchCate">
 				<text>待收货</text>
 				</view>
 				<view class="col-xs-2 pc-20 item" v-bind:class="orderId==402?'ac':''" data-id="402" @tap="switchCate">
 				<text>待评价</text>
 				</view>
 			</view>
 		</view>
 		<view class="container order-list-box" v-if="orderList.length>0">
 			<navigator class="row bg-white m-t-10" v-for="(item, index) in orderList" :key="index" :url="'../orderDetail/orderDetail?id=' + item.id">
 				<view class="block col-xs-12 p-t-10 p-b-10 flex-between">
 				<view class="fl fs-13 m-t-1">订单编号: {{item.order_sn}}
 				</view>
				<view class="fr f-red fs-15"><block >{{item.order_status_text}}</block></view>
 				</view>
 				<block >
 				<view class="col-xs-12 m-t-3 p-t-5 p-b-5 bg-fa">
 				<view class="layout sub50">
 					<view class="col-main">
 					<view class="block wrap f-grey">
 						<view class="m-t-5 flex-between fs-12">
 						<text class="fl block pc-80 text-ellipsis"></text>
						<!-- <text class="pc-6 tl" style='color:#333;'>{{item.goods_name}}</text> -->
 						<text class="fr block pc-20 tr" style='color:#333;'>¥{{item.goods_price}}</text>
 						</view>
 						<view class="m-t-5 flex-between fs-12">
							<view class="pc-80 flex-align-start">				
								<view>{{item.goods_name}}</view>
							</view>
 						<view class="pc-20 tr">×{{item.goods_num||1}}</view>
 						</view>
 					</view>
 					</view>
 					<view class="col-sub">
 					<view>
 						<image :src="item.list_pic_url" mode="aspectFill" style="width:100rpx;height:100rpx;" class="bg-white" />
 					</view>
 					</view>
 				</view>
 				</view>
 				</block>
 				<view class="col-xs-12 tr f-grey b-b-1 p-b-10 p-t-10 fs-12">
 					共{{item.goods_num||1}}  合计: <text style='color:#333;font-size:26rpx;'>¥{{item.actual_price}}</text>（含运费: 0.00）
 				</view>
 				<view class="col-xs-12 tr p-t-8 p-b-8">
 				<view class="clearfix">
 					<view class="tr">
 						<!-- <view class="btn btn-default btn-sm" v-if="index==0" @click="onShowCancel">取消订单</view>
 						<view class="btn btn-main btn-sm" v-if="index==0">去支付</view>
 						<view class="btn btn-default btn-sm" v-if="index==1 || index==2">申请售后</view>
 						<view class="btn btn-main btn-sm" v-if="index==2" @click="onShowConfrim">确认收货</view>
 						<navigator url="/pages/uOrderComment/uOrderComment" class="btn btn-main btn-sm" v-if="index==3">评价订单</navigator>
 						<navigator :url="'/pages/uOrderInfo/uOrderInfo?status='+index" class="btn btn-default btn-sm" v-if="index < 4">订单详情</navigator>
 						<view class="btn btn-sm" v-if="index==4">
 							<view class="flex-align-center">
 								<image src="/static/images/del.png" style="width:30rpx;height:30rpx;" />
 								<text>删除</text>
 							</view>
 						</view> -->
						<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="payOrder" v-if="item.handleOption.pay">去付款</button>
						<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="cancelOrder" v-if="item.handleOption.cancel">取消订单</button>
						<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="confirmOrder" v-if="item.handleOption.confirm">确认收货</button>
						<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="buyOrder" v-if="item.handleOption.buy">再次购买</button>
						<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="commentOrder" v-if="item.handleOption.comment">评价</button>
						<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="lookcomment" v-if="item.handleOption.lookcomment">查看评价</button>
						<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="logistics" v-if="item.handleOption.logistics">查看物流</button>
 					</view>
 				</view>
 				</view>
 			</navigator>
			<!-- <view wx:if="{{nomore}}" class="f-grey fs-13 m-t-20" style="text-align: center;">没有更多数据了</view> -->
 		</view>
 		<view class="tc" v-else>
 			<image src="/static/images/empty.png" style="width:225rpx;margin-top:100rpx;" mode="widthFix" />
 			<view class="f-grey fs-13 m-t-20">您还没有相关的订单</view>
 		</view>
 
 		<view class="bg-black-o6 pf z9 t0 l0 r0 b0" v-if="isshowcancel" @click="onHideCancel"></view>
 		<view class="container pf b0 l0 r0 bg-white z99 slide-up-box" v-if="isshowcancel">
 			<view class="row">
 				<view class="col-xs-12 title">
 					<text class="name">取消原因</text>
 					<image src="/static/images/close-ico-2.png" class="close" @click="onHideCancel"></image>
 				</view>
 				<view class="col-xs-12 content">
 					<view class="m-b-10">
 						<text class="f-main fs-15">请选择取消订单的原因（必选）：</text>
 					</view>
 					<block v-for="(item, index) in reason_list" :key="index">
 					<view class="clearfix item">
 						<image :src="'/static/images/cart-check'+(index==2?'-ac':'')+'.png'" class="check"></image>
 						<view class="fl">{{item}}</view>
 					</view>
 					</block>
 				</view>
 				<!--
 				<view class="col-xs-12">
 					<view class="m-b-10 b-1 pd5">
 						<textarea name="reason_info" class="pc-100" placeholder="请填写备注"></textarea>
 					</view>
 				</view>-->
 				<view class="block radius-0 fs-16 col-xs-12 btn btn-main">
 				确认提交
 				</view>
 			</view>
 		</view>
 		<!-- 弹窗 -->
 		<view class="bg-black-o6 pf b0 l0 r0 t0 z9" v-if="isshowconfirm"></view>
 		<view class='modal-pop-box' v-if="isshowconfirm">
 			<image class='close' src='/static/images/pop-close-2.png' @click="onHideConfrim"></image>
 			<view class='content'>
 				<view class="title">是否确认收到货</view>
 			</view>
 			<view class="footer-box two">
 				<view class="box box1 pc-50" style="background:#f1f1f1;border:none;">未收到货</view>
 				<view class="box box2 pc-50">已收到货</view>
 			</view>
 		</view>
 		<!-- 弹窗 -->
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
      if (that.totalPages <= that.page-1) {
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
            page: that.page+1,
            totalPages: res.data.pages
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
		console.log(orderIndex);
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
@import "../../../static/css/main.css";
page{background:#f7f7f7;}
.nav-box .item{padding:0;}
.nav-box .item text{padding:26rpx 4rpx 22rpx 4rpx;}
</style>