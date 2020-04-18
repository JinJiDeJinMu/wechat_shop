<!-- <template>
<view class="container">
  <view class="help">使用说明</view>
  <view class="empty-view" v-if="couponList.length <= 0">
    <image class="icon" src="../../../static/images/allorder.png"></image>
    <text class="text">无优惠卷信息</text>
  </view>
  <view v-else class="coupon-list">
    <block v-for="(item, index) in couponList" :key="index">
      <view :data-item="item" @tap="tapCoupon" class="item" :style="'background: ' + (item.coupon_status==1?'linear-gradient(to right,#cfa568,#e3bf79)':'linear-gradient(to right,#999,#DDDDDD)')">
        <view class="content">
          <view class="left">
            <view class="name">{{item.name}}</view>
            <view class="time">有效期至{{item.use_end_date}}</view>
          </view>
          <view class="right">
            <image v-if="item.coupon_status==1" class="mid-img" src="../../../static/images/coupon_ksy.png"></image>
            <image v-if="item.coupon_status==3" class="mid-img" src="../../../static/images/coupon_bky.png"></image>
          </view>
        </view>
        <view class="condition">
          <text class="txt">满￥{{item.min_goods_amount}} 减￥{{item.type_money}}</text>
        </view>
      </view>
    </block>
  </view>
</view>
</template> -->
<template>
 	<view>
 		<view class="container m-t-3">
 			<view class="row nav-box bg-white">
 				<view class="col-xs-4 item" >
 					<text>未使用</text>
 				</view>
 				<!-- <view  class="col-xs-4 item" v-bind:class="type==1?'ac':''" @click="onType(1)">
 					<text>已使用</text>
 				</view>
 				<view  class="col-xs-4 item" v-bind:class="type==2?'ac':''" @click="onType(2)">
 					<text>已失效</text>
 				</view> -->
 			</view>
 		</view>
 		<view class="container coupon-container" >
 			<view class="row bg-white m-t-10 radius-4 pr" v-for="(item, index) in CouponList" :key="index">
 				<view class="col-xs-9 p-t-10 p-b-10">
 				<view class="layout sub60">
 					<view class="col-main">
 					<view class="wrap">
 						<view class="f-b fs-16">{{item.name}}</view>
 						<!-- <view class="m-t-7 fs-12 f-grey">优惠范围 </view> -->
						
 						<view class="m-t-7 flex-between" v-if="item.type ==0">
 							<view class="fs-12 f-red fl">
 								<text class="f-b fs-16" >¥{{item.reduceMoney}}</text>
								<text class="f-b fs-16" v-if="item.type ==1">{{item.discount*10}}折</text>
								<text class="f-b fs-16" v-if="item.type ==2">¥{{item.offsetMoney}}</text>
 							</view>
 							<view class="m-t-3" >
 								<text v-if="item.useType == 0">全场</text>
								<text v-if="item.useType == 1">指定分类</text>
								<text v-if="item.useType == 2">指定商品</text>
								满{{item.fullMoney}}元可使用
 							</view>
 						</view>
						<view class="m-t-7 flex-between" v-if="item.type ==1">
							<view class="fs-12 f-red fl">								
								<text class="f-b fs-16" >{{item.discount*10}}折</text>							
							</view>
							<view class="m-t-3">
								<text v-if="item.useType == 0">全场</text>
								<text v-if="item.useType == 1">指定分类</text>
								<text v-if="item.useType == 2">指定商品</text>
								{{item.discount*10}}折可使用
							</view>
						</view>
						<view class="m-t-7 flex-between" v-if="item.type ==2">
							<view class="fs-12 f-red fl">								
								<text class="f-b fs-16" >¥{{item.offsetMoney}}</text>							
							</view>
							<view class="m-t-3">
								<text v-if="item.useType == 0" class="f-b fs-16">全场</text>
								<text v-if="item.useType == 1" class="f-b fs-16">指定分类</text>
								<text v-if="item.useType == 2" class="f-b fs-16">指定商品</text>
								抵{{item.offsetMoney}}现金可使用
							</view>
							
						</view>	
						<view class="fr fs-11 f-shallow m-t-3" v-if="item.timeType == 0">有效期{{item.endDate}}前</view>
						<view class="fr fs-11 f-shallow m-t-3" v-if="item.timeType == 1">有效期{{item.endTime}}前</view>
 					</view>
				
 					</view>
 					<view class="col-sub">
 						<image :src="item.imgUrl" class="pc-100" mode="widthFix"></image>
 					</view>
 				</view>
 				</view>
 				<view class="col-xs-3 p-l-0 p-r-0 tc right p-t-3">
 					<view url="/pages/index/index" class="btn btn-main btn-sm m-t-10"  @click="tobuy">去使用</view>
 									
 				</view>
 				<text class="circle top"></text>
 				<text class="circle bottom"></text>
 				<text class="circle left"></text>
 				<text class="circle right"></text>
 			</view>
 		</view>
 	</view>
 </template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");
/* import showEmptyData from "../../../wxcomponents/show-empty-data/show-empty-data"; */

export default {
  data() {
    return {
      couponList: [],
      buyType: '',
	  type:0
    };
  },

  components: {
   
  },
  props: {},
  onLoad: function (options) {
    /* this.buyType = options.buyType;
    var merchantId = options.merid;
    var goodsTotalPrice = options.price;
    this.validCouponList(merchantId, goodsTotalPrice); */
	this.validCouponList();
  },
  methods: {
    validCouponList: function () {
      let that = this;
      util.request(api.UserCheckCoupon).then(function (res) {
        if (res.code === 200) {
          that.setData({
            couponList: res.data
          });
        }
      });
    },

    /**
     * 点击不使用优惠券
     * 返回上一页
     */
    noUseCoupon: function () {
      getApp().globalData.userCoupon = 'NO_USE_COUPON';
      wx.navigateBack({});
    },
    tapCoupon: function (event) {
      let item = event.currentTarget.dataset.item;

      if (item.coupon_status != 1) {
        return;
      }

      getApp().globalData.userCoupon = 'USE_COUPON';
      getApp().globalData.courseCouponCode = item;
      wx.navigateBack({});
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