<template>
<view class="container">
  <view class="form-box">
    <view class="form-item">
      <input class="username" :value="username" @input="bindUsernameInput" placeholder="账号" auto-focus></input>
      <image v-if="username.length > 0" id="clear-username" class="clear" src="../../../static/images/clear_input.png" @tap.native.stop="clearInput"></image>
    </view>
    <view class="form-item">
      <input class="password" :value="password" password @input="bindPasswordInput" placeholder="密码"></input>
      <image class="clear" id="clear-password" v-if="password.length > 0" src="../../../static/images/clear_input.png" @tap.native.stop="clearInput"></image>
    </view>
    <view class="form-item-code" v-if="loginErrorCount >= 3">
      <view class="form-item code-item">
        <input class="code" :value="code" @input="bindCodeInput" placeholder="验证码"></input>
        <image class="clear" id="clear-code" v-if="code.length > 0" src="../../../static/images/clear_input.png" @tap.native.stop="clearInput"></image>
      </view>
      <image class="code-img" src="https://dl.reg.163.com/cp?pd=yanxuan_web&pkid=SkeBZeG&random=1489903563234"></image>
    </view>
    <button type="default" class="login-btn" @tap="startLogin">登录</button>
    <view class="form-item-text">
      <navigator url="/pages/auth/register/register" class="register">注册账号</navigator>
      <navigator url="/pages/auth/reset/reset" class="reset">忘记密码</navigator>
    </view>
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
      code: '',
      loginErrorCount: 0
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {},
  methods: {
    startLogin: function () {
      var that = this;

      if (that.password.length < 1 || that.username.length < 1) {
        wx.showModal({
          title: '错误信息',
          content: '请输入用户名和密码',
          showCancel: false
        });
        return false;
      }

      wx.request({
        url: api.Login,
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
          }
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
@import "./login.css";
</style>