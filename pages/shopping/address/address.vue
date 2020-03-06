<template>
<view class="container">
    <view class="address-list" v-if="addressList.length > 0">
        <view class="item" v-for="(item, index) in addressList" :key="index" @tap="selectAddress" :data-address-id="item.id">
            <view class="l">
                <view class="name">{{item.userName}}</view>
                <view class="default" v-if="item.is_default">默认</view>
            </view>
            <view class="c">
                <view class="mobile">{{item.telNumber}}</view>
                <view class="address">{{item.full_region+item.detailInfo}}</view>
            </view>
            <view class="r">
                <image @tap.native.stop="addressAddOrUpdate" :data-address-id="item.id" class="del" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/address-edit-7fee7b0d63.png"></image>
				<image @tap.native.stop="addressdel" :data-address-id="item.id" class="del" src="../../../static/img/close-ico-1.png"></image>
			</view>
        </view>
    </view>
    <view class="empty-view" v-if="addressList.length <= 0">
      <image class="icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/noAddress-26d570cefa.png"></image>
      <text class="text">收货地址在哪里</text>
    </view>
    <view class="add-address" @tap="addressAddOrUpdate" data-address-id="0">新建</view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");

export default {
  data() {
    return {
      addressList: []
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
        url: '/pages/shopping/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
      });
    },

    addressdel(event) {
	  console.log(event.currentTarget.dataset.addressId);
	  var addressId = event.currentTarget.dataset.addressId;
	  var that = this;
	  util.request(api.AddressDelete,{id:addressId},'POST').then(function (res) {
	    if (res.errno === 0) {
	      util.showSuccessToast('地址删除成功');
		  that.getAddressList();
	    }
	  });
	},
    selectAddress(event) {
      var addressId = event.currentTarget.dataset.addressId; //选择该收货地址

      wx.navigateTo({
        url: '/pages/shopping/checkout/checkout?addressId=' + addressId + '&isBuy=buy'
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
@import "./address.css";
</style>