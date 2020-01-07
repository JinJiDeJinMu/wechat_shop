<template>
<view class="container">
  <view class="collect-list">
    <view class="item" @tap="openGoods" v-for="(item, index) in collectList" :key="index" :data-index="index">
      <image class="img" :src="item.primaryPicUrl"></image>
      <view class="info">
        <view class="name">{{item.name || ''}}</view>
        <view class="subtitle">{{item.goodsBrief || ''}}</view>
        <view class="price">￥{{item.retailPrice || '0.00'}}</view>
      </view>
    </view>
  </view>
  <view class="empty-view" v-if="collectList.length <= 0">
      <image class="icon" src="../../../static/images/allorder.png"></image>
      <text class="text">无收藏信息</text>
    </view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");

export default {
  data() {
    return {
      typeId: 0,
      collectList: [],
      touch_start: "",
      touch_end: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {
    this.getCollectList();
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    getCollectList() {
      let that = this;
      util.request(api.GetShareGoods, {}).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            collectList: res.data
          });
        }
      });
    },

    openGoods(event) {
      let that = this;
      let goodsId = this.collectList[event.currentTarget.dataset.index].goodsId;
      wx.navigateTo({
        url: '/pages/goods/goods?id=' + goodsId
      });
    },

    //按下事件开始  
    touchStart: function (e) {
      let that = this;
      that.setData({
        touch_start: e.timeStamp
      });
      console.log(e.timeStamp + '- touch-start');
    },
    //按下事件结束  
    touchEnd: function (e) {
      let that = this;
      that.setData({
        touch_end: e.timeStamp
      });
      console.log(e.timeStamp + '- touch-end');
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
@import "./list.css";
</style>