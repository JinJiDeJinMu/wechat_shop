<template>
<view class="container">
	<scroll-view scroll-y="true" :scroll-top="scrollTop" :style="'height:' + scrollHeight + ';'">
	<view class="zuixin">
	  <view class="goods1" v-for="(item, index) in goodsList" :key="index">
	    <navigator :url="'../goods/goods?id=' + item.id">
	      <image mode="aspectFit" :src="item.list_pic_url||item.primary_pic_url" class="goods11"></image>
	      <view class="goods12">{{item.name}}</view>
	      <view class="goods13">
	        <view class="goods131">￥{{item.retail_price}}</view>
	        <view class="goods132" v-if="model.market_price">￥{{item.market_price}}</view>
	      </view>
	    </navigator>
	  </view>
	  </view>
    <view v-if="goodsList.length>4" class="loadmore">
        <block v-if="nomore">
          <text class="more">{{nomoreText}}</text>
        </block>
        <block v-else>
          <text class="iconfont icon-loading loading" space="nbsp"></text>
          <text> {{loadmoreText}}</text>
        </block>
     </view>
    </scroll-view>
  </view>
</template>

<script>
var util = require("../../utils/util.js");
var api = require("../../config/api.js");

export default {
  data() {
    return {
      navList: [],
      goodsList: [],
      id: 0,
      currentCategory: {},
      scrollLeft: 0,
      scrollTop: 0,
      scrollHeight: 0,
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
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options.id);
    wx.showLoading({
      title: '加载中'
    });
    var that = this;

    if (options.id) {
      that.setData({
        id: parseInt(options.id)
      });
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
        wx.hideLoading();
      }
    });
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getGoodsList();
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    getCategoryInfo: function () {
      let that = this;
      util.request(api.GoodsCategory, {
        attribute_category: this.id
      }).then(res => {
        console.log(res.data.newCategory.goodsList);

        if (res.errno == 0) {
          that.setData({
            navList: res.data.newCategory.goodsList
          });
        } else {}
      });
    },
    getGoodsList: function () {
      var that = this;

      if (that.totalPages <= that.page - 1) {
        that.setData({
          nomore: true
        });
        return;
      }

      util.request(api.GoodsList, {
        categoryId: that.id,
        page: that.page,
        size: that.size
      }).then(function (res) {
        console.log(res);
        that.setData({
          goodsList: that.goodsList.concat(res.data.goodsList),
          page: res.data.currentPage + 1,
          totalPages: res.data.totalPages
        });
      });
    },
    switchCate: function (event) {
      if (this.id == event.currentTarget.dataset.id) {
        return false;
      }

      var that = this;
      var clientX = event.detail.x;
      var currentTarget = event.currentTarget;

      if (clientX < 60) {
        that.setData({
          scrollLeft: currentTarget.offsetLeft - 60
        });
      } else if (clientX > 330) {
        that.setData({
          scrollLeft: currentTarget.offsetLeft
        });
      }

      this.setData({
        id: event.currentTarget.dataset.id,
        page: 1,
        totalPages: 1,
        goodsList: [],
        nomore: false
      });
      this.getCategoryInfo();
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
@import "./category.css";
</style>