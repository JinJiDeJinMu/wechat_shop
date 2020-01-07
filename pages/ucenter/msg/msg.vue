<template>
<view class="page">
    <view class="page__hd">
        <view class="page__title">Msg</view>
        <view class="page__desc">提示页</view>
    </view>
    <view class="page__bd">
        <view class="weui-btn-area">
            <button class="weui-btn" type="default" @tap="openSuccess">成功提示页</button>
            <button class="weui-btn" type="default" @tap="openFail">失败提示页</button>
            <button class="weui-btn" type="default" @tap="openText">无图标提示页</button>
            <button class="weui-btn" type="default" @tap="openTextPrimary">无图标提示页</button>
        </view>
    </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {},
  methods: {
    openSuccess: function () {
      wx.navigateTo({
        url: 'msg_success'
      });
    },
    openText: function () {
      wx.navigateTo({
        url: 'msg_text'
      });
    },
    openTextPrimary: function () {
      wx.navigateTo({
        url: 'msg_text_primary'
      });
    },
    openFail: function () {
      wx.navigateTo({
        url: 'msg_fail'
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
@import "./msg.css";
</style>