<template>
<view class="container">
  <view class="search">
    <navigator url="/pages/search/search" class="input">
      <image class="icon"></image>
      <text class="txt">商品搜索, 共{{goodsCount}}款好物</text>
    </navigator>
  </view>
  <view class="catalog">
    <scroll-view class="nav" scroll-y="true">
        <view :class="'item ' + ( currentCategory.id == item.id ? 'active' : '')" v-for="(item, index) in navList" :key="index" :data-id="item.id" :data-index="index" @tap="switchCate">{{item.name}}</view>
    </scroll-view>
    <scroll-view class="cate" scroll-y="true">
        <navigator url="url" class="banner">
            <image class="image" :src="currentCategory.wap_banner_url"></image>
            <view class="txt">{{currentCategory.front_name}}</view>
        </navigator>
        <view class="hd">
            <text class="line"></text>
            <text class="txt">{{currentCategory.name}}分类</text>
            <text class="line"></text>
        </view>
        <view class="bd">
            <navigator :url="'../goods/goods?id=' + item.id" :class="'item ' + ((index+1) % 3 == 0 ? 'last' : '')" v-for="(item, index) in goodList" :key="index">
                <image class="icon" :src="item.item.list_pic_url"></image>
                <text class="txt">{{item.name}}</text>
            </navigator>
        </view>
    </scroll-view>
  </view>
</view>
</template>

<script>
var util = require("../../utils/util.js");
var api = require("../../config/api.js");

export default {
  data() {
    return {
      navList: [],
      categoryList: [],
	  goodList:[],
      currentCategory: {},
      scrollLeft: 0,
      scrollTop: 0,
      scrollHeight: 0,
      goodsCount: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    this.getCatalog();
  },
  methods: {
    getCatalog: function () {
      let that = this;
      wx.showLoading({
        title: '加载中...'
      });
      util.request(api.CatalogList).then(function (res) {
        that.setData({
          navList: res.data.categoryList,
          currentCategory: res.data.currentCategory
        });
        wx.hideLoading();
      });
      util.request(api.GoodsCount).then(function (res) {
        that.setData({
          goodsCount: res.data.goodsCount
        });
      });
    },
    getCurrentCategory: function (id) {
      let that = this;
      util.request(api.CatalogCurrent, {
        id: id
      }).then(function (res) {
		that.goodList=res.data.goodsList;
        that.currentCategory=res.data.currentCategory;
      });
    },
    getList: function () {
      var that = this;
      util.request(api.ApiRootUrl + 'api/catalog/' + that.currentCategory.cat_id).then(function (res) {
        that.setData({
          categoryList: res.data
        });
      });
    },
    switchCate: function (event) {
      var that = this;
      var currentTarget = event.currentTarget;

      if (this.currentCategory.id == event.currentTarget.dataset.id) {
        return false;
      }

      this.getCurrentCategory(event.currentTarget.dataset.id);
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
@import "./catalog.css";
</style>