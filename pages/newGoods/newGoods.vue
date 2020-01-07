<template>
<view class="container">
  <view class="brand-info">
    <view class="name">
      <image class="img" :src="bannerInfo.img_url" background-size="cover"></image>
      <view class="info-box">
        <view class="info">
          <text class="txt">{{bannerInfo.name}}</text>
          <text class="line"></text>
        </view>
      </view>
    </view>
  </view>
  <view class="sort">
    <view class="sort-box">
      <view :class="'item ' + (currentSortType == 'default' ? 'active' : '')" @tap="openSortFilter" id="defaultSort">
        <text class="txt">综合</text>
      </view>
      <view :class="'item by-price ' + (currentSortType == 'price' ? 'active' : '') + ' ' + (currentSortOrder == 'asc'  ? 'asc' : 'desc')" @tap="openSortFilter" id="priceSort">
        <text class="txt">价格</text>
      </view>
      <view :class="'item ' + (currentSortType == 'category' ? 'active' : '')" @tap="openSortFilter" id="categoryFilter">
        <text class="txt">分类</text>
      </view>
    </view>
    <view class="sort-box-category" v-if="categoryFilter">
      <view :class="'item ' + (item.checked ? 'active' : '')" v-for="(item, index) in filterCategory" :key="index" :data-category-index="index" @tap="selectCategory">{{item.name}}</view>
    </view>
  </view>
  <view class="cate-item" v-if="goodsList.length > 0">
    <view class="b">
      <block v-for="(iitem, unique) in goodsList" :key="unique">
        <navigator :class="'item ' + (iindex % 2 == 0 ? 'item-b' : '' )" :url="'../goods/goods?id=' + iitem.id">
          <image class="img" :src="iitem.list_pic_url" background-size="cover"></image>
          <text class="name">{{iitem.name}}</text>
          <text class="price">￥{{iitem.retail_price}}</text>
        </navigator>
      </block>
    </view>
  </view>
  <view class="empty-view" v-if="goodsList.length <= 0">
      <image class="icon" src="../../static/images/allorder.png"></image>
      <text class="text">无商品数据</text>
    </view>
</view>
</template>

<script>
var util = require("../../utils/util.js");
var api = require("../../config/api.js");

export default {
  data() {
    return {
      bannerInfo: {
        'img_url': '',
        'name': ''
      },
      categoryFilter: false,
      filterCategory: [],
      goodsList: [],
      categoryId: 0,
      currentSortType: 'default',
      currentSortOrder: 'desc',
      page: 1,
      size: 1000
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getData();
  },
  onReady: function () {// 页面渲染完成
  },
  onShow: function () {// 页面显示
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    getData: function () {
      let that = this;
      util.request(api.GoodsHot).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            bannerInfo: res.data.bannerInfo
          });
          that.getGoodsList();
        }
      });
    },

    getGoodsList() {
      var that = this;
      util.request(api.GoodsList, {
        isNew: 1,
        page: that.page,
        size: that.size,
        order: that.currentSortOrder,
        sort: that.currentSortType,
        categoryId: that.categoryId
      }).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            goodsList: res.data.goodsList,
            filterCategory: res.data.filterCategory
          });
        }
      });
    },

    openSortFilter: function (event) {
      let currentId = event.currentTarget.id;

      if (currentId == "defaultSort") {
        this.setData({
          categoryId: ''
        });
      }

      switch (currentId) {
        case 'categoryFilter':
          this.setData({
            'categoryFilter': !this.categoryFilter,
            'currentSortType': 'category',
            'currentSortOrder': 'asc'
          });
          break;

        case 'priceSort':
          let tmpSortOrder = 'asc';

          if (this.currentSortOrder == 'asc') {
            tmpSortOrder = 'desc';
          }

          this.setData({
            'currentSortType': 'price',
            'currentSortOrder': tmpSortOrder,
            'categoryFilter': false
          });
          this.getData();
          break;

        default:
          //综合排序
          this.setData({
            'currentSortType': 'default',
            'currentSortOrder': 'desc',
            'categoryFilter': false
          });
          this.getData();
      }
    },
    selectCategory: function (event) {
      let currentIndex = event.target.dataset.categoryIndex;
      this.setData({
        'categoryFilter': false,
        'categoryId': this.filterCategory[currentIndex].id
      });
      this.getData();
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
@import "./newGoods.css";
</style>