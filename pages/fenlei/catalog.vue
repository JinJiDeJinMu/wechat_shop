<template>
	<view class="page-box">
		<view class="pd10 b-b-1">
			<navigator url="/pages/search/search" class="index-search-link bg-f7">
				<view class="text-box">
					搜索的商品，共{{goodsCount}}款好物
				</view>
				<image src="/static/images/search.png" class="search-ico"></image>
			</navigator>
		</view>
		<view class="page-content">
			<scroll-view scroll-y="true" style="background:#fafafa;width:170rpx;">
				<view class="cate-menu-box">					
					<view  v-for="(item, index) in navList" :key="index" >
						<text :class="'a' + ( currentId == item.id ? 'c' : '')" :data-id="item.id" :data-index="index" @tap="switchCate">{{item.name}}</text>
					</view>				
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="bg-f7" style="width:580rpx;" >
				<view class="pd10">
					<!-- <image src="" class="banner" mode="aspectFill"></image> -->
					<view class="cate-list-box">
						<navigator url="" class="item-box" v-for="(item, index) in categoryList" :key="index">
							<view class="title">{{item.name}}</view>
							<view class="content">
								<navigator :url="'../entry/entry?id=' + model.id" class="item" v-for="(model, idx) in item.subCategoryList" :key="idx">
									<view><image :src="model.banner_url"></image></view>
									<view>{{model.name}}</view>
								</navigator>
							</view>
						</navigator>
						<!-- <view v-if="currentId !=0" class="item-box" v-for="(item, index) in categoryList" :key="index">
							<view class="title">{{item.name}}</view>
							<view class="content">
								<navigator url="/pages/list/list" class="item" v-for="(model, idx) in item.subCategoryList" :key="idx">
									<view><image :src="model.banner.url"></image></view>
									<view>{{model.name}}</view>
								</navigator>
							</view>
						</view> -->
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
      curIndex: "",
	  currentId:0
    };
  },
  components: {},
  props: {},
  onLoad: function (options) {
    this.getCatalog();
	this.getcount();
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
		   categoryList: []
		 });
		if(res.data){
			if(res.data.goods.length >=2){
				for(var i =1;i <res.data.goods.length;i++){
					that.categoryList.push(res.data.goods[i])
				}
			}else{
					that.setData({				
					  categoryList: res.data.goods
					});
			}
			that.setData({
			  navList: res.data.goods,
			});
			console.log('----'+that.navList[1].id);
			wx.hideLoading();
		}	
      });   
    },
	getcount: function() {
		var that = this;
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
          categoryList: res.data.currentCategory 
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
      this.curNav=id;
      this.curIndex=index;
    },
    switchCate: function (event) {
      var that = this;
      var currentTarget = event.currentTarget;
	  var index = event.currentTarget.dataset.index;
	  var id = event.currentTarget.dataset.id;
	  console.log(event.currentTarget.dataset.id)
      console.log(event.currentTarget.dataset.index);
	  if(index == 0){	  
		  that.getCatalog();
	  }else{ 
		 that.getCurrentCategory(id);
	  }
	  that.setData({
		  currentId: event.currentTarget.dataset.id
	  })
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
@import "../../static/css/main.css";
</style>