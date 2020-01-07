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
               <button class="weui-btn" type="primary" @tap="redirectBack">查看订单({{second}})</button>
           </view>
      </view>
    </view>
</view>
</template>

<script>
function countdown(that) {
  var second = that.data.second;

  if (second == 0) {
    // console.log("Time Out...");
    that.redirectBack();
    return;
  }

  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }, 1000);
}

export default {
  data() {
    return {
      result: '',
      second: 10,
      orderId: 0
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.id) {
      this.setData({
        orderId: options.id
      });
    }

    countdown(this);
  },
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
    redirectBack: function () {
      if (this.orderId) {
        wx.navigateTo({
          url: '../orderDetail/orderDetail?id=' + this.orderId
        });
      } else {
        wx.navigateTo({
          url: '/pages/ucenter/order/order?id=-1'
        });
      }
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
@import "./msgorder.css";
</style>