<template>
<view class="page">
    <view class="weui-msg">
        <view class="weui-msg__icon-area">
            <icon type="success" size="64"></icon>
        </view>
        <view class="weui-msg__text-area">
            <view class="weui-msg__title">核销成功</view>
      </view>
        <view class="weui-msg__opr-area">
            <view class="weui-btn-area">
                <button class="weui-btn" type="primary" @tap="getScancode">继续扫码</button>
            </view>
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
    getScancode: function () {
      var _this = this; // 允许从相机和相册扫码


      wx.scanCode({
        success: res => {
          //console.log(res.result)
          wx.navigateTo({
            url: '../orderHexiao/orderHexiao?id=' + res.result
          });
          var result = res.result;
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
@import "./msg_success.css";
</style>