<template>
<view class="page">
    <view class="weui-msg">
        <view class="weui-msg__icon-area">
            <icon type="warn" size="64"></icon>
        </view>
        <view class="weui-msg__text-area">
            <view class="weui-msg__title">操作失败</view>
            <view class="weui-msg__desc">内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现<navigator url class="weui-msg__link">文字链接</navigator></view>
        </view>
        <view class="weui-msg__tips-area">
            <view class="weui-msg__tips">内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现<navigator url class="weui-msg__link">文字链接</navigator></view>
        </view>
        <view class="weui-msg__opr-area">
            <view class="weui-btn-area">
                <button class="weui-btn" type="default">辅助操作</button>
            </view>
        </view>
        <view class="weui-msg__extra-area">
            <view class="weui-footer">
                <view class="weui-footer__links">
                    <navigator url class="weui-footer__link">底部链接文本</navigator>
                </view>
                <view class="weui-footer__text">Copyright © 2008-2016 weui.io</view>
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
@import "./msg_fail.css";
</style>