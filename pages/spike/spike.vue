<template>
<view class="content">
		<view class="goods" v-if="spikeList.length>0">
			<view class="goodinfo" v-for="(item, index) in spikeList" :key="index">
				<view class="cont">
					<view class="proimg">
						<image :src="item.list_pic_url"></image>
					</view>
					<view class="proinfo">
						<view class="m tit">{{item.name}}</view>
						<view class="m des"></view>
						<view class="m priinfo">
							<label>秒杀价</label>
							<text class="price">¥{{item.retail_price}}</text>
							<text class="line">原价：¥{{item.market_price}}</text>
						</view>
						<view class="m opt">
							<button class="qg" :data-id="item.id" @tap="goDetail">秒杀</button>
						</view>
					</view>
				</view>
			</view>
			<view v-if="spikeList.length>10" class="loadmore">
      <block v-if="nomore">
        <text>{{nomoreText}}</text>
      </block>
      <block v-else>
        <text class="iconfont icon-loading loading" space="nbsp"></text>
        <text> {{loadmoreText}}</text>
      </block>
    </view>
		</view>
		<view class="empty-view" v-if="spikeList.length <= 0">
      <image class="icon" src="../../static/images/allorder.png"></image>
      <text class="text">无订单数据</text>
    </view>
	</view>
</template>

<script>
// pages/spike/spike.js
var util = require("../../utils/util.js");
var api = require("../../config/api.js");

export default {
  data() {
    return {
      spikeList: [],
      page: 1,
      size: 10,
      loadmoreText: '正在加载更多数据',
      nomoreText: '全部加载完成',
      nomore: false,
      totalPages: 1
    };
  },

  components: {},
  props: {},
  onShareAppMessage: function () {
    return {
      title: '秒杀更优惠',
      desc: '秒杀更优惠',
      path: 'pages/spike/spike'
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getSpikeList();
  },

  onPullDownRefresh() {
    // 增加下拉刷新数据的功能
    wx.showNavigationBarLoading();
    var self = this;
    self.setData({
      spikeList: [],
      page: 1,
      totalPages: 1
    });
    self.getSpikeList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getSpikeList();
  },

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
    goDetail(e) {
      console.log("====:", e.target.dataset.id);
      var id = e.target.dataset.id;
      wx.navigateTo({
        url: '../goods/goods?id=' + id + '&type=2'
      });
    },

    getSpikeList() {
      let that = this;

      if (that.totalPages <= that.page - 1) {
        that.setData({
          nomore: true
        });
        return;
      }

      util.request(api.KillList, {
        page: that.page,
        size: that.size
      }).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            spikeList: that.spikeList.concat(res.data.data),
            page: res.data.currentPage + 1,
            totalPages: res.data.totalPages
          });
          wx.hideLoading();
        }

        wx.hideNavigationBarLoading(); //完成停止加载

        wx.stopPullDownRefresh(); //停止下拉刷新
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
@import "./spike.css";
</style>