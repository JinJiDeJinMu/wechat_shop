<template>
<view class="container">
    <view class="address-box">
        <view class="address-item" @tap="selectAddress" v-if="checkedAddress.id > 0">
            <view class="l">
                <text class="name">{{checkedAddress.userName}}</text>
                <text class="default" v-if="checkedAddress.is_default === 1">默认</text>
            </view>
            <view class="m">
                <text class="mobile">{{checkedAddress.telNumber}}</text>
                <text class="address">{{checkedAddress.full_region+checkedAddress.detailInfo}}</text>
            </view>
            <view class="r">
                <image src="../../../static/images/address_right.png"></image>
            </view>
        </view>
        <view class="address-item address-empty" @tap="addAddress" v-if="!checkedAddress.id">
            <view class="m">
               还没有收货地址，去添加
            </view>
            <view class="r">
                <image src="../../../static/images/address_right.png"></image>
            </view>
        </view>
    </view>
    <view class="goods-items">
        <view class="item" v-for="(item, index) in checkedGoodsList" :key="index">
          <view class="proName">{{item.merchantName || ''}}</view>
          <view class="proBox" v-for="(iitem, index2) in item.cartVoList" :key="index2">
              <view class="img">
                  <image :src="iitem.list_pic_url||iitem.primary_pic_url"></image>
              </view>
              <view class="info">
                  <view class="t">
                      <text class="name">{{iitem.goods_name || ''}}</text>
                      <text class="number">x{{iitem.number || 1}}</text>
                  </view>
           <view class="m">{{skuName||''}}</view>
                  <view class="b">￥{{iitem.retail_price || '0.00'}}</view>
              </view>
          </view>
        <view class="coupon-box" :data-merid="item.merchantId" :data-price="item.orderTotalPrice" @tap="tapCoupon">
    </view>
      <view class="order-box"> 
          <view class="order-item">
              <view class="l">
                  <text class="name">运费</text>
              </view>
              <view class="r">
                  <text class="txt">￥{{item.freightPrice}}</text>
              </view>
          </view>
          <view class="order-item">
              <view class="l">
                  <text class="name">商品合计</text>
              </view>
              <view class="r">
                  <text class="txt">￥{{item.actualPrice}}</text>
              </view>
          </view>
        </view>
      </view>
    </view>
    <view class="order-total">
        <view class="l">实付：￥{{actualPrice}}</view>
        <button class="r" :disabled="isY" @tap="submitOrder">去付款</button>
    </view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");
const pay = require("../../../services/pay.js");

export default {
  data() {
    return {
      checkedGoodsList: [],
      checkedAddress: {},
      checkedCoupon: [],
      couponList: [],
      goodsTotalPrice: 0.00,
      //商品总价
      freightPrice: 0.00,
      //快递费
      couponPrice: 0.00,
      //优惠券的价格
      orderTotalPrice: 0.00,
      //订单总价
      actualPrice: 0.00,
      //实际需要支付的总价
      addressId: 0,
      couponId: 0,
      isBuy: false,
      couponDesc: '',
      couponCode: '',
      buyType: '',
      couponIdArr: [],
      item: {},
      type: null,
      groupBuyingId: '',
      skuName: '',
      activityType: 1
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.isBuy) {
      this.setData({
        isBuy: options.isBuy
      });
    }

    if (options.addressId) {
      this.setData({
        addressId: options.addressId
      });
    }

    if (options.type) {
      this.setData({
        type: options.type
      });
    }

    if (options.groupBuyingId) {
      this.setData({
        groupBuyingId: options.groupBuyingId
      });
    }

    if (options.activityType) {
      this.setData({
        activityType: options.activityType
      });
    }

    this.buyType = this.isBuy ? 'detailBuy' : 'cart'; //每次重新加载界面，清空数据

    getApp().globalData.userCoupon = 'NO_USE_COUPON';
    getApp().globalData.courseCouponCode = {};
  },
  onReady: function () {// 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getCouponData();
    wx.showLoading({
      title: '加载中...'
    });
    this.getCheckoutInfo();
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    switch1Change(e) {
      console.log('switch1 发生 change 事件，携带值为', e.detail.value);
    },

    getCheckoutInfo: function () {
      let that = this;
      var url = api.CartCheckout;
      let buyType = this.isBuy ? 'detailBuy' : 'cart';
      var sumPrice = 0;
      util.request(url, {
        addressId: that.addressId,
        couponId: that.couponId,
        type: buyType,
        activityType: that.activityType
      }).then(function (res) {
        if (res.errno === 0) {
          for (var i = 0; i < res.data.checkedGoodsList.length; i++) {
            var param = res.data.checkedGoodsList[i];

            for (var j = 0; j < that.couponIdArr.length; j++) {
              if (param.merchantId == that.couponIdArr[j].merchantId) {
                param.couponName = that.couponIdArr[j].name;
                param.couponPrice = that.couponIdArr[j].type_money;
                sumPrice += that.couponIdArr[j].type_money;
              }
            }
          }

          that.setData({
            skuName: res.data.skuName,
            checkedGoodsList: res.data.checkedGoodsList,
            checkedAddress: res.data.checkedAddress,
            actualPrice: util.accSub(res.data.actualPrice, sumPrice),
            //couponPrice: res.data.couponPrice,
            freightPrice: res.data.freightPrice,
            goodsTotalPrice: res.data.goodsTotalPrice,
            orderTotalPrice: res.data.orderTotalPrice
          }); //设置默认收获地址

          if (that.checkedAddress) {
            let addressId = that.checkedAddress.id;

            if (addressId) {
              that.setData({
                addressId: addressId
              });
            }
          } else {
            wx.showModal({
              title: '',
              content: '请添加默认收货地址!',
              success: function (res) {
                if (res.confirm) {
                  that.selectAddress();
                  console.log('用户点击确定');
                }
              }
            });
          }
        }

        wx.hideLoading();
      });
    },

    selectAddress() {
      wx.navigateTo({
        url: '/pages/shopping/address/address'
      });
    },

    addAddress() {
      wx.navigateTo({
        url: '/pages/shopping/addressAdd/addressAdd'
      });
    },

    /**
     * 获取优惠券
     */
    getCouponData: function () {
      if (getApp().globalData.userCoupon == 'USE_COUPON') {
        if (this.couponIdArr.length > 0) {
          for (var i = 0; i < this.couponIdArr.length; i++) {
            if (this.couponIdArr[i].merchantId == getApp().globalData.courseCouponCode.merchantId) {
              this.couponIdArr.splice(i, 1);
            }
          }
        }

        this.setData({
          couponIdArr: this.couponIdArr.concat(getApp().globalData.courseCouponCode)
        });
      } else if (getApp().globalData.userCoupon == 'NO_USE_COUPON') {
        this.setData({
          couponDesc: "不使用优惠券",
          couponId: 0
        });
      }
    },

    /**
     * 选择可用优惠券
     */
    tapCoupon: function (e) {
      var merid = e.currentTarget.dataset.merid;
      var price = e.currentTarget.dataset.price;
      let that = this;
      wx.navigateTo({
        url: '../selCoupon/selCoupon?buyType=' + that.buyType + '&merid=' + merid + '&price=' + price
      });
    },
    submitOrder: function () {
      let that = this;

      if (that.addressId <= 0) {
        util.showErrorToast('请选择收货地址');
        return false;
      }

      wx.showLoading({
        title: '提交中'
      });

      if (that.couponIdArr.length > 0) {
        this.setData({
          couponId: ''
        });

        for (var i = 0; i < that.couponIdArr.length; i++) {
          that.couponId += that.couponIdArr[i].user_coupon_id + ',';
        }
      }

      if (that.couponId != "" & that.couponId != null & that.couponId != undefined) {
        if (that.couponId.indexOf(',') > -1) {
          that.couponId = that.couponId.substr(0, that.couponId.length - 1);
        }
      }

      var param = {};
      param.addressId = that.addressId;
      param.promoterId = wx.getStorageSync('userId') || 0;
      param.couponId = that.couponId == 0 ? null : that.couponId, param.type = that.buyType;
      param.payType = that.type;
      param.groupBuyingId = that.groupBuyingId;
      util.request(api.OrderSubmit, param, 'POST').then(res => {
        wx.hideLoading();

        if (res.errno === 0) {
          const orderId = res.data.orderInfo.id;
          pay.payOrder(parseInt(orderId)).then(res => {
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=1&orderId=' + orderId
            });
          }).catch(res => {
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=0&orderId=' + orderId
            });
          });
        }else {
          util.showErrorToast('下单失败');
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
@import "./checkout.css";
</style>