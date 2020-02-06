<template>
<view class="container">
  <view class="pay-result">
    <view class="success" v-if="status == true">
      <view class="msg">付款成功</view>
    </view>
    <view class="error" v-if="status != true">
      <view class="msg">付款失败</view>
    </view>
  </view>
</view>
</template>
<script>
var util = require("../../utils/util.js");
var api = require("../../config/api.js");
const pay = require("../../services/pay.js");
export default {
  data() {
    return {
      status: false,
      scoreflowId: 0
    };
  },
  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      scoreflowId: options.scoreflowId || 24,
      status: options.status
    });
    this.updateSuccess();
  },
  onReady: function () {},
  onShow: function () {// 页面显示
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    updateSuccess: function () {
      let that = this;
      util.request(api.PayScoreQuery, {
        scoreflowId: that.scoreflowId
      }).then(function (res) {
		  if(res.errno === 0){
			this.setData({
			  status: true
			});
		  }
	  });
    },
    payOrder() {
      pay.payOrder(parseInt(this.orderId)).then(res => {
        this.setData({
          status: true
        });
      }).catch(res => {
        util.showErrorToast('支付失败');
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
@import "./payScoreResult.css";
</style>