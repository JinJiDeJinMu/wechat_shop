<template><view></view></template><script>
var utils = require("../../../utils/util.js");

export default {
  data() {
    return {
      result: ''
    };
  },

  components: {},
  props: {},
  onReady: function () {
    var _this = this; // 允许从相机和相册扫码


    wx.scanCode({
      success: res => {
        _this.setData({
          result: res.result
        });
      }
    });
    console.log(this.result);

    if (utils.isBlank(this.result)) {
      wx.navigateTo({
        url: '/pages/my/my?scene=' + this.result
      });
    }
  },
  onLoad: function () {},
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
undefined