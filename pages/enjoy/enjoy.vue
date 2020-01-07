<template>
<!--pages/enjoy/enjoy.wxml-->
<view class="enjoy">
  <view class="entry-img">
    <image src="https://www.chundengtai.com/qrcode/enjoy.png" class="bgc" mode="widthFix"></image>
  </view>
  <view class="eat">
    <!-- 未名严选介绍 -->
    <view class="introduce">
      <view class="introduce-title">-未名严选介绍-</view>
      <view class="introduce-con">
        <view class="one">未名严选是一家专注校园生活服务的社交电商平台，最初起步于瑶湖师大校园的在校大学生创业项目，经浙江春登台投资并整合其供应链、内容、技术优势发展而成。</view>
        <view class="two">未名严选通过S2B2C模式(商家/供应商-平台-团长-C端用户),聚集高校生活周边优质商家,整合近1000+优质供应链，同时建立校园“最后一公里”的物流与供应链系统,为高校大学生们提供优质的产品和服务。</view>
        <view class="three">未名严选的产品由和服务"未名商城""宿舍小店""玩赚生活"三个部分组成。学生用户可以在平台上完成在线消费、跑腿挣钱、一键开店等服务。</view>
      </view>
    </view>
    <!--未名商城介绍  -->
    <view class="introduce-shop">
      <view class="introduce-title">-未名商城介绍-</view>
      <view class="introduce-con">
        <view class="one">精选校园周边最有品质、最具性价比的吃喝玩乐学信息，打造校园一站式生活服务平台，满足大学生日常消费需求，让你花得更少,吃得更好，玩的更爽。</view>
        <view class="three">产品涵盖美食、电影、KTV、驾校、快递代取、跑腿外卖、二手转卖、兼职等。</view>
      </view>
    </view>
    <!-- 宿舍小店 -->
    <view class="introduce-su">
      <view class="introduce-title">-宿舍小店-</view>
      <view class="introduce-con">
        <view class="one">精选优质商品，共享生活圈流量，以“内容+短视频+电商模式”引导校园消费。</view>
        <view class="three">整合优质供应链，直接对接工厂、基地，完善的售后服务，保证让用户以最低的价格购买到最合适的商品，创享校园品质生活。</view>
      </view>
    </view>
    <!-- 玩赚生活 -->
    <view class="introduce-su1">
      <view class="introduce-title">-玩赚生活-</view>
      <view class="introduce-con">
        <view class="one">用户申请成为店长，分享商城商品给好友/微信群/朋友圈好友成功购物可获得佣金。</view>
        <view class="three">抓住校园社交属性，构建校园分销体系，助力大学生实现轻创业，打造自媒体个人IP，0成本互联网社交变现。</view>
      </view>
    </view>
  </view>
    <!-- tabber页面 -->
  <view class="page-bottom">
    <navigator class="p-b-btn" url="/pages/index/index" open-type="switchTab">
      <!-- <text class="yticon icon-xiatubiao--copy"></text> -->
      <image src="../../static/images/ic_menu_choice_nor.png" class="yticon"></image>
      <text class="shou">首页</text>
    </navigator>
    <navigator class="p-b-btn" url="/pages/sort/sort" open-type="switchTab">
      <image src="../../static/images/ic_menu_sort_nor.png" class="yticon"></image>
      <text class="shou">分类</text>
    </navigator>
    <navigator class="p-b-btn" url="/pages/cart/cart" open-type="switchTab">
      <image src="../../static/images/ic_menu_shoping_nor.png" class="gou"></image>
      <text class="shou">购物车</text>
    </navigator>
    <navigator class="p-b-btn" url="/pages/ucenter/index/index" open-type="switchTab">
      <image src="../../static/images/ic_menu_me_nor.png" class="yticon"></image>
      <text class="shou">我的</text>
    </navigator>
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
@import "./enjoy.css";
</style>