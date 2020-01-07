<template>
<view class="container">
  <picker @change="bindPickerChange" :value="index" :range="array">
    <view class="picker">
      <view class="fb-type">
        <view class="type-label">{{array[index]}}</view>
        <image class="type-icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/pickerArrow-a8b918f05f.png"></image>
      </view>
    </view>
  </picker>
  <view class="fb-body">
    <textarea class="content" placeholder="对我们网站、商品、服务，你还有什么建议吗？你还希望在严选上买到什么？请告诉我们..." @input="contentInput" maxlength="500" auto-focus="true" :value="content"></textarea>
    <view class="text-count">{{contentLength}}/500</view>
  </view>
  <view class="fb-mobile">
    <view class="label">手机号码</view>
    <view class="mobile-box">
      <input class="mobile" maxlength="11" type="number" placeholder="方便我们与你联系" @input="mobileInput" :value="mobile"></input>
    </view>
  </view>
  <view class="fb-btn" @tap="sbmitFeedback">提交</view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");

export default {
  data() {
    return {
      array: ['请选择反馈类型', '商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
      index: 0,
      content: '',
      contentLength: 0,
      mobile: ''
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    bindPickerChange: function (e) {
      this.setData({
        index: e.detail.value
      });
    },
    mobileInput: function (e) {
      let that = this;
      this.setData({
        mobile: e.detail.value
      }); // console.log(that.data.mobile);
    },
    contentInput: function (e) {
      let that = this;
      this.setData({
        contentLength: e.detail.cursor,
        content: e.detail.value
      }); // console.log(that.data.content);
    },
    cleanMobile: function () {
      let that = this;
    },
    sbmitFeedback: function (e) {
      let that = this;

      if (that.index == 0) {
        util.showErrorToast('请选择反馈类型');
        return false;
      }

      if (that.content == '') {
        util.showErrorToast('请输入反馈内容');
        return false;
      }

      if (that.mobile == '') {
        util.showErrorToast('请输入手机号码');
        return false;
      }

      if (!util.validatePhone(that.mobile)) {
        util.showErrorToast('请输入正确手机号码');
        return false;
      }

      wx.showLoading({
        title: '提交中...',
        mask: true,
        success: function () {}
      });
      util.request(api.FeedbackAdd, {
        mobile: that.mobile,
        index: that.index,
        content: that.content
      }, 'POST').then(function (res) {
        if (res.errno === 0) {
          console.log(res.data);
          wx.hideLoading();
          wx.showToast({
            title: res.data,
            icon: 'success',
            duration: 2000,
            complete: function () {
              console.log('重新加载');
              that.setData({
                index: 0,
                content: '',
                contentLength: 0,
                mobile: ''
              });
            }
          });
        } else {
          util.showErrorToast(res.data);
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
@import "./feedback.css";
</style>