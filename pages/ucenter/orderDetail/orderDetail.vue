
<template>
	<view>
		<view class="container orderinfo-page">
			<view class="row bg-white p-t-10 p-b-10 pr b-b-1">
				<view class="col-xs-1 tc"></view>
				<view class="col-xs-11">
					<view class="flex-between">
						<view class="fl">收货人：{{orderInfo.consignee}}</view>
						<view class="fr">{{orderInfo.mobile}}</view>
					</view>
					<view class="m-t-5">收货地址：{{orderInfo.province}}{{orderInfo.city}}{{orderInfo.district}}{{orderInfo.address}}</view>
				</view>
				<image src="../../../static/images/address.png" class="m-t-10" style="position:absolute;top:50%;margin-top:-20rpx;width:40rpx;height:40rpx;left:28rpx;"/>
			</view>
			<view class="row bg-white p-t-15 p-b-15 pr b-b-1">
				<view class="col-xs-1"></view>
				<view class="col-xs-11 flex-between">
					<view class="fl">配送方式</view>
					<view class="fr f-grey">{{orderInfo.shipping_name}}</view>
				</view>
				<image src="/static/images/car.png" class="m-t-10" style="position:absolute;top:50%;margin-top:-25rpx;width:50rpx;height:50rpx;left:20rpx;"/>
			</view>
		</view>

		<view class="container lr15 order-list-box">
		<view class="row bg-white m-t-10">
			<view class="col-xs-12 p-t-5 p-b-5 b-b-1" v-for="(item, index) in orderGoods" :key="index">
			<view class="layout sub50">
				<view class="col-main">
					<view class="block wrap f-grey">
						<view class="flex-between fs-12">
							<text class="fl block pc-80 text-ellipsis">{{item.goods_name}}</text>
							<text class="fr block pc-20 tr" style='color:#333;'>¥{{item.retail_price}}</text>
						</view>
						<view class="m-t-10 flex-between fs-12">
							<view class="fl block pc-80 flex-align-start">
								<view>规格: {{item.goods_specifition_name_value||''}}</view>
							</view>
							<text class="fr block pc-20 tr">×{{item.number}}</text>
						</view>
					</view>
				</view>
				<view class="col-sub">
					<view>
						<image :src="item.list_pic_url" mode="aspectFill" style="width: 100rpx; height: 100rpx;" class="bg-f5" />
					</view>
				</view>
			</view>
			</view>
			<view class="col-xs-12 fs-12 m-t-10 flex-between">
				<view class="fl">运费</view>
				<view class="fr">¥{{orderInfo.shipping_fee}}</view>
			</view>
			<!-- <view class="col-xs-12 fs-12 m-t-10 flex-between">
				<view class="fl ">积分抵扣</view>
				<view class="fr">- ¥10.00</view>
			</view>
			<view class="col-xs-12 fs-12 m-t-10 flex-between">
				<view class="fl">优惠券抵扣</view>
				<view class="fr">- ¥10.00</view>
			</view> -->
			<view class="col-xs-12 fs-12 m-t-10 flex-between">
				<view class="fl">商品合计：</view>
				<view class="fr">¥{{orderInfo.goods_price}}</view>
			</view>
			<view class="col-xs-12 fs-12 m-t-10 m-b-10 flex-between">
				<view class="fl">实付款(含运费)：</view>
				<view class="fr f-red">¥<text class="fs-15 f-b">{{orderInfo.actual_price}}</text></view>
			</view>
		</view>
		</view>
		
		<view class="container orderinfo-page">
		<view class="row fs-12 p-t-5 p-b-5 bg-white m-t-10">
			<view class="col-xs-12 p-t-3 p-b-3 flex-between">
				<view class="m-t-1">订单编号：</view>
				<view class="f-grey flex-align-end">
					<text class="m-r-5">{{orderInfo.order_sn}}</text>
					<view class="btn btn-xs btn-default f-main" @click="fuzhi">复制</view>
				</view>
			</view>
			<view class="col-xs-12 p-t-3 p-b-3 flex-between">
				<view class="">下单时间：</view>
				<view class="f-grey">{{orderInfo.add_time}}</view>
			</view>
			<!-- <view class="col-xs-12 p-t-3 p-b-3 flex-between">
				<view class="">支付方式：</view>
				<view class="f-grey">支付宝支付</view>
			</view> -->
			<view class="col-xs-12 p-t-3 p-b-3 flex-between" >
				<view class="">支付时间：</view>
				<view class="f-grey" v-if="orderInfo.pay_time">{{orderInfo.pay_time}}</view>
			</view>
			
			<view class="col-xs-12 p-t-3 p-b-3 flex-between" >
				<view class="">付款时间：</view>
				<view class="f-grey" v-if="orderInfo.confirm_time">{{orderInfo.confirm_time}}</view>
			</view>
			<!-- <view class="col-xs-12 p-t-3 p-b-3 flex-between" >
				<view class="">发货时间：</view>
				<view class="f-grey">2018-8-8 12:00:00</view>
			</view>
			<view class="col-xs-12 p-t-3 p-b-3 flex-between">
				<view class="">成交时间：</view>
				<view class="f-grey">2018-8-8 12:00:00</view>
			</view> -->
		

		<!-- <view class="container order-footer">
			<view class="row">
				<view class="col-xs-12 flex-between">
				<view class="fl f-red">
					<block >剩余支付时间: 29:05:59</block>
					<block >等待商家发货</block>
				</view>
				<view class="flex-align-start">
					<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="payOrder" v-if="orderInfo.handleOption.pay">去付款</button>
					<button class="btn btn-default btn-sm" :data-order-index="index" @tap.native.stop="cancelOrder" v-if="orderInfo.handleOption.cancel">取消订单</button>
					<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="confirmOrder" v-if="item.handleOption.confirm">确认收货</button>
					<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="buyOrder" v-if="item.handleOption.buy">再次购买</button>
					<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="commentOrder" v-if="item.handleOption.comment">评价</button>
					<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="lookcomment" v-if="item.handleOption.lookcomment">查看评价</button>
					<button class="btn btn-main btn-sm" :data-order-index="index" @tap.native.stop="logistics" v-if="item.handleOption.logistics">查看物流</button>
				</view>
				</view>
			</view>
		</view> -->

		<!-- <view class="bg-black-o6 pf z9 t0 l0 r0 b0" v-if="isshowcancel" @click="onHideCancel"></view>
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
				
				<view class="col-xs-12">
					<view class="m-b-10 b-1 pd5">
						<textarea name="reason_info" class="pc-100" placeholder="请填写备注"></textarea>
					</view>
				</view>
				<view class="block radius-0 fs-16 col-xs-12 btn btn-main">
				确认提交
				</view>
			</view>
		</view> -->
		<!-- 弹窗 -->
		<!-- <view class="bg-black-o6 pf b0 l0 r0 t0 z9" v-if="isshowconfirm"></view>
		<view class='modal-pop-box' v-if="isshowconfirm">
			<image bindtap='doHideTake' class='close' src='/static/images/pop-close-2.png' @click="onHideConfrim"></image>
			<view class='content'>
				<view class="title">是否确认收到货</view>
			</view>
			<view class="footer-box two">
				<view class="box box1 pc-50" style="background:#f1f1f1;border:none;">未收到货</view>
				<view class="box box2 pc-50">已收到货</view>
			</view>
		</view> -->
		<!-- 弹窗 -->
	</view>
	</view>
	</view>
</template>

<script>
var util = require("../../../utils/util.js");
var md5 = require("../../../utils/md5.js");
var api = require("../../../config/api.js");
import QR from "../../../utils/qrcode";
/* function countdown(that) {
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
} */

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
      handleOption: {},
	  status:0,
		reason_list:[
			'订单不能按预计时间送达',
			'操作有误（商品、地址等选错）',
			'重复下单/误下单',
			'其它渠道价格更低',
			'该商品京东降价了',
			'不想买了',
			'商品无货',
			'其他原因'
		],
		isshowcancel:false,
		isshowconfirm:false
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
	  onShowCancel(){
	  				this.isshowcancel = true;
	  			},
	  			onHideCancel(){
	  				this.isshowcancel = false;
	  			},
	  			onShowConfrim(){
	  				this.isshowconfirm = true;
	  			},
	  			onHideConfrim(){
	  				this.isshowconfirm = false;
	  			},
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

  //订单号复制
   fuzhi(){
	   var that = this; 
	   wx.setClipboardData({
	         data: '1111111',
	         success(res) {
	           wx.showToast({
	             title: '复制成功',
	           })
	           wx.getClipboardData({
	             success(res) {
	               console.log(that.orderInfo.order_sn) 
	             }
	           })
	         }
	    })
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
@import "../../../static/css/main.css";
</style>