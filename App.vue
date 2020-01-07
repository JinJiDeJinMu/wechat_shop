<script>
var util = require("./utils/util.js");
var api = require("./config/api.js");
var user = require("./services/user.js");

export default {
  onLaunch: function (options) {
    user.checkLogin().then(res => {
      this.globalData.userInfo = wx.getStorageSync('userInfo');
      this.globalData.token = wx.getStorageSync('token');
    }).catch(() => {
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('token');
    });
    let q = decodeURIComponent(options.query.q);

    if (q) {
      this.globalData.goodId = util.getQueryString(q, 'id');
      this.globalData.userId = util.getQueryString(q, 'userId');
    }
  },
  globalData: {
    userInfo: {
      nickName: 'Hi,游客',
      userName: '点击登录',
      avatarUrl: 'https://platform-wxmall.oss-cn-beijing.aliyuncs.com/upload/20180727/150547696d798c.png'
    },
    goodId: 0,
    userId: 0,
    token: '',
    userCoupon: 'NO_USE_COUPON',
    //默认不适用优惠券
    courseCouponCode: {} //购买课程的时候优惠券信息

  },
  methods: {}
};
</script>
<style>
@import url("./components/gaoyia-parse/parse.css");
@import "./app.css";
</style>