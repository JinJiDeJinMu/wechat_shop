<template>
<view class="container">
    <view class="form-box">
    	<view class="form-item">
    		<input class="username" :value="username" @input="bindUsernameInput" placeholder="请输入账号" auto-focus></input>
    		<image v-if="username.length > 0" id="clear-username" class="clear" src="../../../static/images/clear_input.png" @tap.native.stop="clearInput"></image>
    	</view>
		<view class="form-item-code">
			<view class="form-item code-item">
				<input class="code" :value="code" @input="bindCodeInput" placeholder="验证码"></input>
				<image class="clear" id="clear-code" v-if="code.length > 0" src="../../../static/images/clear_input.png" @tap.native.stop="clearInput"></image>
			</view>
			<image class="code-img" src="https://dl.reg.163.com/cp?pd=yanxuan_web&pkid=SkeBZeG&random=1489903563234"></image>
		</view>
    	<button type="default" class="login-btn" @tap="startNext">下一步</button>
    </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      username: '',
      code: ''
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {},
  methods: {
    startLogin: function () {
      var that = this;
    },
    bindUsernameInput: function (e) {
      this.setData({
        username: e.detail.value
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
@import "./reset.css";
</style>