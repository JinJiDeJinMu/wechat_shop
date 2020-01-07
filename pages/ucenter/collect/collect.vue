<template>
<view class="container">
  <view class="ts-mes"><text class="ca">长按可取消收藏!</text></view>
  <view class="collect-list">
    <view class="item" @tap="openGoods" @touchstart="touchStart" @touchend="touchEnd" v-for="(item, index) in collectList" :key="index" :data-index="index">
      <image class="img" :src="item.list_pic_url"></image>
      <view class="info">
        <view class="name">{{item.name || ''}}</view>
        <view class="subtitle">{{item.goods_brief || ''}}</view>
        <view class="price">￥{{item.retail_price || '0.00'}}</view>
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
      util.request(api.CollectList, {
        typeId: that.typeId
      }).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            collectList: res.data
          });
        }
      });
    },

    openGoods(event) {
      let that = this;
      let goodsId = this.collectList[event.currentTarget.dataset.index].value_id; //触摸时间距离页面打开的毫秒数  

      var touchTime = that.touch_end - that.touch_start; //如果按下时间大于350为长按  

      if (touchTime > 350) {
        wx.showModal({
          title: '',
          content: '确定取消收藏吗？',
          success: function (res) {
            if (res.confirm) {
              util.request(api.CollectAddOrDelete, {
                typeId: that.typeId,
                valueId: goodsId
              }, 'POST').then(function (res) {
                if (res.errno === 0) {
                  wx.showToast({
                    title: '取消成功',
                    icon: 'success',
                    duration: 2000
                  });
                  that.getCollectList();
                }
              });
            }
          }
        });
      } else {
        wx.navigateTo({
          url: '/pages/goods/goods?id=' + goodsId
        });
      }
    },

    //按下事件开始  
    touchStart: function (e) {
      let that = this;
      that.setData({
        touch_start: e.timeStamp
      });
    },
    //按下事件结束  
    touchEnd: function (e) {
      let that = this;
      that.setData({
        touch_end: e.timeStamp
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
@import "./collect.css";
</style>