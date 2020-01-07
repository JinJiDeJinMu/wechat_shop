<template>
<view class="container">
  <view class="form-box">
    <view class="form-item">
      <input class="username" :value="username" @input="bindUsernameInput" placeholder="用户名" auto-focus></input>
      <image v-if="username.length > 0" id="clear-username" class="clear" src="../../../static/images/clear_input.png" @tap.native.stop="clearInput"></image>
    </view>
    <view class="form-item">
      <input class="password" :value="password" password @input="bindPasswordInput" placeholder="密码"></input>
      <image class="clear" id="clear-password" v-if="password.length > 0" src="../../../static/images/clear_input.png" @tap.native.stop="clearInput"></image>
    </view>
    <view class="form-item">
      <input class="password" :value="confirmPassword" password @input="bindConfirmPasswordInput" placeholder="确认密码"></input>
      <image class="clear" id="clear-confirm-password" v-if="confirmPassword.length > 0" src="../../../static/images/clear_input.png" @tap.native.stop="clearInput"></image>
    </view>
    <view class="form-item-code">
      <view class="form-item code-item">
        <input class="code" :value="code" @input="bindCodeInput" placeholder="验证码"></input>
        <image class="clear" id="clear-code" v-if="code.length > 0" src="../../../static/images/clear_input.png" @tap.native.stop="clearInput"></image>
      </view>
      <image class="code-img" src="https://dl.reg.163.com/cp?pd=yanxuan_web&pkid=SkeBZeG&random=1489903563234"></image>
    </view>
    <button type="default" class="login-btn" @tap="startRegister">注册</button>
  </view>
</view>
</template>

<script>
var api = require("../../../config/api.js");

export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      code: '',
      loginErrorCount: 0
    };
  },

  components: {},
  props: {},
  methods: {
    startRegister: function () {
      var that = this;

      if (that.password.length < 3 || that.username.length < 3) {
        wx.showModal({
          title: '错误信息',
          content: '用户名和密码不得少于3位',
          showCancel: false
        });
        return false;
      }

      if (that.password != that.confirmPassword) {
        wx.showModal({
          title: '错误信息',
          content: '确认密码不一致',
          showCancel: false
        });
        return false;
      }

      wx.request({
        url: api.Register,
        data: {
          username: that.username,
          password: that.password
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              'loginErrorCount': 0
            });
            wx.setStorage({
              key: "token",
              data: res.data.data.token,
              success: function () {
                wx.switchTab({
                  url: '/pages/ucenter/index/index'
                });
              }
            });
          } // console.log(res.data.data.token)

        }
      });
    },
    bindUsernameInput: function (e) {
      this.setData({
        username: e.detail.value
      });
    },
    bindPasswordInput: function (e) {
      this.setData({
        password: e.detail.value
      });
    },
    bindConfirmPasswordInput: function (e) {
      this.setData({
        confirmPassword: e.detail.value
      });
    },
    bindCodeInput: function (e) {
      this.setData({
        code: e.detail.value
      });
    },
    clearInput: function (e) {
      switch (e.currentTarget.id) {
        case 'clear-username':
          this.setData({
            username: ''
          });
          break;

        case 'clear-password':
          this.setData({
            password: ''
          });
          break;

        case 'clear-confirm-password':
          this.setData({
            confirmPassword: ''
          });
          break;

        case 'clear-code':
          this.setData({
            code: ''
          });
          break;
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
@import "./register.css";
</style>