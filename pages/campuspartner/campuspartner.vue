<template>
<!--pages/campuspartner/campuspartner.wxml-->
<view class="campuspartner">
	<view class="empty-view" style="margin-top: 30%" v-if="goods.length <= 0">
		<image mode="aspectFit" class="icon" src="../../static/images/allorder.png"></image>
		<text class="text">无商品数据</text>
	</view>
  </view>
</template>

<script>
    const util = require("../../utils/util.js");
	const api = require("../../config/api.js");
export default {
  data() {
    return {
      goods:[]
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  console.log(options)
	  var that = this;
	  util.request(api.BannerContent,{bannerId:options.id}).then(function (res) {
	  	console.log(res.data.goods_show)
	  	if(res.code == 200){
	  		if(res.data.goods_show){
	  			
	  		}
	  	}
	   
	  });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    partner(e) {
      var that = this;

      if (e.detail.value != "") {
        var x = e.currentTarget.dataset.key;

        if (x == "name") {
          that.setData({
            name: e.detail.value
          });
        } else if (x == "sex") {
          that.setData({
            sex: e.detail.value
          }); // 性别验证：

          if (!/^['男'|'女']$/.test(that.sex)) {
            wx.showToast({
              title: '性别只能是男或者女',
              duration: 2000,
              icon: 'none'
            });
          }
        } else if (x == "phone") {
          that.setData({
            phone: e.detail.value
          });
        } else if (x == "student") {
          that.setData({
            student: e.detail.value
          });
        } else if (x == "grade") {
          that.setData({
            grade: e.detail.value
          });
        } else if (x == "introduce") {
          that.setData({
            introduce: e.detail.value
          });
        }
      }
    },

    // 提交
    confirm(e) {
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      this.setData({
        name: this.name,
        sex: this.sex,
        phone: this.phone,
        student: this.student,
        grade: this.grade,
        introduce: this.introduce
      });

      if (this.name == "") {
        wx.showModal({
          title: '提示',
          content: '姓名不能为空',
          showCancel: false
        });
      } else if (this.sex == "") {
        wx.showModal({
          title: '提示',
          content: '请输入性别',
          showCancel: false
        });
      } else if (!myreg.test(this.phone)) {
        wx.showModal({
          title: '提示',
          content: '请输入正确的手机号',
          showCancel: false
        });
      } else if (this.student == "") {
        wx.showModal({
          title: '提示',
          content: '请输入您所在的学校',
          showCancel: false
        });
      } else if (this.grade == "") {
        wx.showModal({
          title: '提示',
          content: '请输入您所在的年级',
          showCancel: false
        });
      } else if (this.introduce == "") {
        wx.showModal({
          title: '提示',
          content: '亲，请简单介绍一下自己',
          showCancel: false
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
@import "./campuspartner.css";
</style>