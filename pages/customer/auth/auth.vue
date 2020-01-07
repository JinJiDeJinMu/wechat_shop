<template>
<view class="add-address">
    <view class="add-form">
        <view class="form-item">
			<van-cell-group>
			  <van-field :value="items.name" label="真实姓名" left-icon="contact" placeholder="请输入真实姓名" error-message required border="false" @change="bindinputName"></van-field>
			</van-cell-group>
        </view>
        <view class="form-item">
			<van-cell-group>
			  <van-field value="输入框已禁用" label="提现金额" left-icon="balance-list-o" disabled border="false"></van-field>
			</van-cell-group>
        </view> 
    </view> 
    <view class="btns">
        <button class="cannel" @tap="resetInfo">重置</button>
        <van-button type="primary" class="save" @tap="saveCashApply">提交审核</van-button>
    </view> 
</view>
</template>

<script>
// pages/customer/addwh/addwh.js
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");
import vanButton from "../../../wxcomponents/vant-weapp/button/index";
import vanField from "../../../wxcomponents/vant-weapp/field/index";

export default {
  data() {
    return {
      items: {
        name: '',
        amount: ''
      },
      unsetMoney: 0
    };
  },

  components: {
    vanButton,
    vanField
  },
  props: {},
  onLoad: function (options) {
    let unsetMoney = wx.getStorageSync('unsetMoney');
    this.setData({
      unsetMoney: unsetMoney
    });
  },
  methods: {
    resetInfo: function () {
      const item = this.items;
      item.name = '';
      this.setData({
        items: item
      });
    },

    bindinputName(event) {
      let items = this.items;
      items.name = event.detail || event;
      ;
      console.log(event.detail);
      this.setData({
        items: items
      });
    },

    bindinputAmount(e) {
      let items = this.items;
      items.amount = e.detail.value;
      this.setData({
        items: items
      });
    },

    saveCashApply() {
      let that = this;

      if (that.items.name == '') {
        util.showErrorToast('请输入真实姓名');
        return false;
      }

      if (that.unsetMoney == 0) {
        util.showErrorToast('无提现金额,请去分享海报赚钱');
        return false;
      }

      util.request(api.distriapply, {
        realName: that.items.name,
        tel: ''
      }, 'POST', 'application/x-www-form-urlencoded').then(function (res) {
        if (res.errno === 0) {
          wx.showToast({
            title: '提交成功,请等待审核'
          });
        } else {
          util.showErrorToast(res.errmsg);
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
@import "./auth.css";
</style>