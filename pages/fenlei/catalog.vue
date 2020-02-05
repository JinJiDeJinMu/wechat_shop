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
			<view class="bd">
				<view class="cont-item">
				
						<block v-for="(v, index) in goodsList" :key="index">
							<navigator :url="'/pages/goods/goods?id='+v.id" >
							<view class="show-item" :data-prodid="v.id">
								
								<view class="more-prod-pic">
									<image :src="v.listPicUrl||v.primaryPicUrl" class="more-pic" mode="widthFix"></image>
								</view>
								<view class="prod-text-right">
									<view class="prod-text more">{{v.name}}</view>
									<view class="cate-prod-info">{{v.goodsBrief}}</view>
									<view class="prod-price more">
										<text class="symbol">￥</text>
										<text class="big-num">{{v.retailPrice}}</text>
									</view>
								</view>
							</view>
						</navigator>
						</block>
					
				</view>
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
      currentCategory: {},
      goodsList: [],
      scrollLeft: 0,
      scrollTop: 0,
      goodsCount: 0,
      scrollHeight: 0,
      curNav: "",
      curIndex: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    this.getCatalog();
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
	  navTo(url){
	  	console.log(url);
	  	uni.navigateTo({  
	  		url
	  	})  
	  }, 
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
        that.setData({
          currentCategory: res.data.currentCategory,
          goodsList: res.data.goodsList
        });
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

    onMenuTab(e) {
      console.log(e);
      var id = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index; // 把点击到的某一项，设为当前index  

      this.setData({
        curNav: id,
        curIndex: index
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