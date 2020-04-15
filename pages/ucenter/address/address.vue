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
                <image @tap.native.stop="deleteAddress" :data-address-id="item.id" class="del" src="../../../static/images/del.png"></image>
            </view>
        </view>
    </view>
    <view>
    <!-- <view class="address-list ">
    <view class="text-item">当前定位地址为:{{address}}</view>
    <view class="text-item">当前定位经度为:{{latitude}}</view>
    <view class="text-item">当前定位纬度为:{{longitude}}</view>
    </view> -->

    </view>
    <view class="empty-view" v-if="addressList.length <= 0">
      <image class="icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/noAddress-26d570cefa.png"></image>
      <text class="text">收货地址在哪里</text>
    </view>
    <view class="add-address" @tap="addressAddOrUpdate" data-address-id="0">添加</view>
	
	<!-- <view class="row m-b-20">
		<view class="col-xs-12 m-b-10">
			<navigator url="/pages/uAddressEdit/uAddressEdit" class="btn btn-main fs-18 pc-100" style="padding:20rpx 40rpx;" @tap="addressAddOrUpdate" data-address-id="0">新增地址</navigator>
		</view>
	</view> -->

</view>
</template>
<!-- <template>
	<view>
		<view class="container ">
			<view class="row">
				<view class="col-xs-12 bg-white p-t-15 m-b-10" v-for="(item, index) in addressList" :key="index">
					<view class="">
						<text>{{item.userName}}</text>
						<text>{{item.telNumber}}</text>
					</view>
					<view class="f-shallow m-t-10"><text class="f-red" v-if="item.is_default">[默认地址]</text> {{item.full_region+item.detailInfo}}</view>
					<view class="flex-between m-t-10 pdtb10 b-t-1 f-shallow">
						<view class="flex-between">
							<image :src="'/static/images/cart-check'+(item.is_default?'-ac':'')+'.png'" style="width:40rpx;height:40rpx;"></image>
							<view class="m-l-5 fs-13">设为默认地址</view>
						</view>
						<view class="flex-between ">
							<navigator url="/pages/uAddressEdit/uAddressEdit" class="flex-between">
								<image src="../../../static/images/edit.png" style="width:26rpx;height:26rpx;" />
								<view class="m-l-5">编辑</view>
							</navigator> 
							<view class="flex-between m-l-20">
								<image src="../../../static/images/del.png" style="width:26rpx;height:26rpx;"  />
								<view class="m-l-5">删除</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="container lr15 pf b0 l0 r0">
		<view class="row m-b-20">
			<view class="col-xs-12 m-b-10">
				<navigator url="/pages/uAddressEdit/uAddressEdit" class="btn btn-main fs-18 pc-100" style="padding:20rpx 40rpx;">新增地址</navigator>
			</view>
		</view>
		</view>
	</view>
</template> -->
<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");
/* var QQMapWX = require("../../../wxcomponents/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js"); */

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
@import "../../../static/css/main.css";
</style>