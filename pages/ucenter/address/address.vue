<template>
<view class="container">
    <view class="address-list" v-if="addressList.length > 0">
        <view class="item" v-for="(item, index) in addressList" :key="index" @tap="addressAddOrUpdate" :data-address-id="item.id">
            <view class="l">
              <view class="box">
                <view class="name">{{item.userName}}</view>
                <view class="mobile">{{item.telNumber}}</view>
                </view>
                <view class="box">
                    <view class="default" v-if="item.is_default">默认</view>
                    <view class="address">{{item.full_region+item.detailInfo}}</view>
                </view> 
            </view>
            <view class="r">
                <image @tap.native.stop="deleteAddress" :data-address-id="item.id" class="del" src="../../../static/images/del-address.png"></image>
            </view>
        </view>
    </view>
    <view>
    <view class="address-list ">
    <view class="text-item">当前定位地址为:{{address}}</view>
    <view class="text-item">当前定位经度为:{{latitude}}</view>
    <view class="text-item">当前定位纬度为:{{longitude}}</view>
    </view>

    </view>
    <view class="empty-view" v-if="addressList.length <= 0">
      <image class="icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/noAddress-26d570cefa.png"></image>
      <text class="text">收货地址在哪里</text>
    </view>
    <view class="add-address" @tap="addressAddOrUpdate" data-address-id="0">添加</view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");
var QQMapWX = require("../../../wxcomponents/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js");

export default {
  data() {
    return {
      addressList: [],
      latitude: '定位中',
      longitude: '定位中',
      latitude1: '定位中',
      longitude1: '定位中',
      address: '定位中'
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {// 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {// 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getAddressList();
    this.getLocation();
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    wxgetLocation() {
      wx.chooseLocation({
        success: function (res) {
          console.log(res);
          var latitude = res.latitude;
          var longitude = res.longitude;
          console.log(latitude + "****" + longitude);
          var address = res.address;
          var name = res.name;
          console.log(name + '****' + address);
        },
        fail: function (e) {
          console.log(e);
        }
      });
    },

    getLocation() {
      var that = this;
      wx.getLocation({
        //调用API得到经纬度
        //type: 'wgs84',
        type: 'gcj02',
        success: function (res) {
          var speed = res.speed;
          var accuracy = res.accuracy;
          var latitude = res.latitude;
          var longitude = res.longitude;
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          }); //地址解析

          var demo = new QQMapWX({
            key: api.TcentConfigMapKey // 这个KEY的获取方式在上面链接 腾讯位置服务的开发文档中有详细的申请密钥步骤

          });
          demo.reverseGeocoder({
            //地址解析
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function (res) {
              console.log(res); //获得地址

              that.setData({
                address: res.result.address
              });
            },
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) {
              console.log(res);
            }
          });
        }
      });
    },

    getAddressList() {
      let that = this;
      util.request(api.AddressList).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            addressList: res.data
          });
        }
      });
    },

    addressAddOrUpdate(event) {
      console.log(event);
      wx.navigateTo({
        url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
      });
    },

    deleteAddress(event) {
      console.log(event.target);
      let that = this;
      wx.showModal({
        title: '',
        content: '确定要删除地址？',
        success: function (res) {
          if (res.confirm) {
            let addressId = event.target.dataset.addressId;
            util.request(api.AddressDelete, {
              id: addressId
            }, 'POST').then(function (res) {
              if (res.errno === 0) {
                that.getAddressList();
              }
            });
            console.log('用户点击确定');
          }
        }
      });
      return false;
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
@import "./address.css";
</style>