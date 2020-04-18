<template>
	<view>
		<view class="container pr">
			<view class="row">
				<view class="col-xs-12 m-t-10">
					<navigator url="/pages/search/search" class="index-search-link">
						<view class="text-box">
							搜索的商品，共{{goodsCount}}款好物
						</view>
						<image src="/static/images/search.png" class="search-ico"></image>
					</navigator>
				</view>
				<view class="col-xs-12 m-t-10">
					<view class="index-swiper-box" >
						<swiper autoplay="true" circular="true" @change="onSwiperChange">
							<swiper-item v-for="(item, index) in list1" :key="index">
								 <image :src="item.image_url" background-size="cover" @tap.native.stop="bindimg" :data-con="item" ></image>
							</swiper-item>
						</swiper>
						<view class="nav-tag">
							<view class="item" v-bind:class="swiperIndex == index?'ac':''" v-for="(item, index) in list1.length" :key="index" ></view>
						</view>
					</view>
				</view>
				<view class="col-xs-12 m-t-15">
					<view class="index-cate-box">
						<view class="item" v-for="(item, index) in fenlei" :key="index">			
							<navigator :url="'../entry/entry?attrid=' + item.id">							 
							  <image :src="item.bannerUrl" class="img bg-f5"></image>
							  <view>{{item.name}}</view>
							</navigator>
						</view>
					</view>
				</view>
				<view class="col-xs-12 bg-f7 p-t-15 p-b-5">
					<navigator :url="'../goods/goods?id=' + item.id" v-for="(item, index) in list2" :key="index" class="lh-0 m-b-10">
						<image :src="item.image_url" class="pc-100" mode="widthFix" @tap.native.stop="bindimg" :data-con="item"></image>
						<!-- <image src="/static/images/1.png" class="pc-100" mode="widthFix"></image> -->
					</navigator>
				</view>
				
				<!-- 分类-->
				<view class="col-xs-12 banner-item-box">
					<view v-for="(model, index) in categoryGoodsList" :key="index">
					<view v-if="model.showStyle==1&&model.goodsList.length>0">
					<view class="col-xs-12 no-pd">
						<view class="list-title-box flex-between">
							<view class="fs-15 f-black name">{{model.name}}</view>
							<navigator url="/pages/fenlei/catalog" class="flex-between" open-type="switchTab">
								<text class="fs-12 f-shallow m-r-5">查看全部</text>
								<image src="/static/images/right-green.png" style="width:27rpx;height:27rpx;"></image>
							</navigator>
						</view>
					</view>
					<navigator :url="'../goods/goods?id=' + item.id" class="item" v-for="(item, index) in model.goodsList" :key="index">
						<view class="img">
							<image class="bg-f5" mode="aspectFill" :src="item.list_pic_url||item.primary_pic_url"></image>
						</view>
						<view class="title">{{item.name}}</view>
						<view class="desc">{{item.goods_brief}}</view>
						<view class="flex-between">
							<view class="flex-align-start">
								<view class="price">
									<text>¥</text>{{item.retail_price}}
								</view>
								<view class="tag">特卖活动</view>
							</view>
							<image src="/static/images/buy-btn.png" class="buy-ico"></image>
						</view>
					</navigator>
				</view>
			</view>
		</view>
					
				<!--新品-->
				 <view class="col-xs-12 no-pd">
					<view class="list-title-box flex-between">
						<view class="fs-15 f-black name">新品</view>
						<navigator url="../entry/entry?newId=1" class="flex-between">
							<text class="fs-12 f-shallow m-r-5">查看全部</text>
							<image src="/static/images/right-green.png" style="width:27rpx;height:27rpx;"></image>
						</navigator>
					</view>
				</view>
				
				<view class="col-xs-12 banner-item-box">
					
					<navigator :url="'../goods/goods?id=' + item.id" class="item" v-for="(item, index) in rexiao" :key="index">
						<view class="img">
							<image class="bg-f5" mode="aspectFill" :src="item.list_pic_url||item.primary_pic_url"></image>
						</view>
						<view class="title">{{item.name}}</view>
						<view class="desc">{{item.goods_brief}}</view>
						<view class="flex-between">
							<view class="flex-align-start">
								<view class="price">
									<text>¥</text>{{item.retail_price}}
								</view>
								<!-- <view class="tag">热销</view> -->
							</view>
							<image src="/static/images/buy-btn.png" class="buy-ico"></image>
						</view>
					</navigator>
					
				<navigator :url="'../goods/goods?id=' + item.id" class="item" v-for="(item, index) in zuixin" :key="index">
					<view class="img">
						<image class="bg-f5" mode="aspectFill" :src="item.list_pic_url||item.primary_pic_url"></image>
					</view>
					<view class="title">{{item.name}}</view>
					<view class="desc">{{item.goods_brief}}</view>
					<view class="flex-between">
						<view class="flex-align-start">
							<view class="price">
								<text>¥</text>{{item.retail_price}}
							</view>
							<view class="tag">新品上线</view>
						</view>
						<image src="/static/images/buy-btn.png" class="buy-ico"></image>
					</view>
				</navigator>
				</view>
				
				
				<view class="col-xs-12 no-pd" v-if="relatedGoods.length>0">
					<view class="list-title-box flex-between">
						<view class="fs-15 f-black name">为你推荐</view>	
					</view>
				</view>
				
				<view class="col-xs-12 banner-item-box" v-if="relatedGoods.length>0">
				<navigator :url="'../goods/goods?id=' + item.id" class="item" v-for="(item, index) in relatedGoods" :key="index">
					<view class="img">
						<image class="bg-f5" mode="aspectFill" :src="item.list_pic_url||item.primary_pic_url"></image>
					</view>
					<view class="title">{{item.name}}</view>
					<view class="desc">{{item.goods_brief}}</view>
					<view class="flex-between">
						<view class="flex-align-start">
							<view class="price">
								<text>¥</text>{{item.retail_price}}
							</view>
							<view class="tag">为你推荐</view>
						</view>
						<image src="/static/images/buy-btn.png" class="buy-ico"></image>
					</view>
				</navigator>
				</view>
				
			</view>
		</view>
	</view>
</template>
<script>
	const util = require("../../utils/util.js");
	const api = require("../../config/api.js");
	const user = require("../../services/user.js");
	//定位
	/* var QQMapWX = require("../../wxcomponents/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js"); */
	var qqmapsdk; 
	const app = getApp().globalData;
	import indexTypeData from "../../wxcomponents/index-type-data/index-type-data";
	import selectmap from "../../wxcomponents/select/select";
	export default {
	  data() {
	    return {
	      categoryGoodsList: [],
	      banner: [],
		  list1:[],
		  list2:[],
	      goodsCount: 0,
	      fenlei: [],
	      zuixin: [],
		  rexiao:[],
	      ppicc: 0.0,
	      gonggao: [],
		  relatedGoods:[],
	      url: '',
	      selectArray: [],
	      selectList: [],
	      regionData: {},
	      currentRegion: {
	        province: '选择城市',
	        city: '选择城市',
	        district: '选择城市'
	      },
	      currentProvince: '选择城市',
	      currentCity: '选择城市',
	      currentDistrict: '选择城市',
	      suggestion: [],
	      selectedId: 0,
	      defaultKeyword: '大学',
	      latitude: "",
	      longitude: "",
	      id: "",
	      keyword: ""	
	    };
	  },
	  components: {
	    indexTypeData,
	    selectmap
	  },
	  props: {},
	  onShareAppMessage: function () {
	    return {
	      title: '未名严选',
	      desc: '春登台',
	      path: '/pages/index/index'
	    };
	  },
	
	  onPullDownRefresh() {
	    var self = this;
	    self.getIndexData();
		wx.stopPullDownRefresh();
	  },
	  onLoad: function (options) {
		  console.log(options);
	    let self = this;
	    if (options.scene) {
	      wx.setStorageSync('referrerId', options.scene);
	    }
	
	    if (options.q) {
	      const q = decodeURIComponent(options.q);
	      self.setData({
	        id: util.getQueryString(q, 'id')
	      });
	      wx.setStorageSync('userId', util.getQueryString(q, 'userId'));
	    }
	    self.getIndexData();
		//定位功能
	   /* qqmapsdk = new QQMapWX({
	      key: api.TcentConfigMapKey
	    }); */
	    /* wx.getLocation({
	      type: 'gcj02',
	      success(res) {
	        const latitude = res.latitude;
	        const longitude = res.longitude;
	        const speed = res.speed;
	        const accuracy = res.accuracy; //你地址解析
	        qqmapsdk.reverseGeocoder({
	          location: {
	            latitude: latitude,
	            longitude: longitude
	          },
	          success: function (res) {
	            self.setData({
	              regionData: res.result.address_component,
	              latitude: latitude,
	              longitude: longitude,
	              keyword: self.defaultKeyword
	            }); // 调用接口
	            self.getsuggest();
	          }
	        });
	      },
	      fail(err) {
	        wx.hideLoading();
	        wx.showToast({
	          title: '定位失败',
	          icon: 'none',
	          duration: 1500
	        });
	      }
	    }); */
		console.log("加载结束");
	  },
	  methods: {
		  onSwiperChange(e){
		  	this.swiperIndex = e.detail.current;
			
		  },
	    baidu() {
	      wx.setStorageSync('key', this.url);
	      wx.navigateTo({
	        url: '../webview/webview'
	      });
	    },
	    moremore() {
	      wx.navigateTo({
	        url: '../category/category'
	      });
	    },
	
	    getIndexData: function () {
	      let that = this;
	      var fenlei = that.fenlei;
		  var banner = that.banner;
	      var categoryGoodsList = that.categoryGoodsList;
	      var data = new Object();
	      util.request(api.IndexUrlAll, {
	        /* school: wx.getStorageSync('filterCity') */
	      }).then(function (res) {
			if(res.code ==200){
	        that.setData({
	          categoryGoodsList: res.data.productList
	        });
	        that.setData({
	          fenlei: res.data.categoryList
	        });
	        that.setData({
	          banner: res.data.banner
	        });
			that.list1=[];			
			that.list2=[];
			for(let i =0;i<that.banner.length;i++){
				let positionid= that.banner[i].ad_position_id;
				if(positionid == 1){
					that.list1.push(that.banner[i])
				}else if(positionid ==2){
					that.list2.push(that.banner[i]);
				}
			};	
			 that.getUrlgonggao();
			 that.getzuixin();
			 that.getGoodsRelated();
			 }
	      });
	     
	      util.request(api.GoodsCount).then(function (res) {
	        that.setData({
	          goodsCount: res.data.goodsCount
	        });
	      });
		
	    },
	    //轮播图跳转
	    bindimg(e) {
			 var banner = e.currentTarget.dataset.con;
			  if(banner.link){
				 wx.navigateTo({
				   url: e.currentTarget.dataset.con.link
				 }); 
			  } 
		 
	    },
	    //根据关键词搜索匹配位置
	    getsuggest: function () {
	      var _this = this; //调用关键词提示接口
	      _this.setData({
	        selectArray: []
	      });
	      qqmapsdk.getSuggestion({
	        keyword: _this.defaultKeyword,
	        location: _this.latitude + ',' + _this.longitude,
	        page_size: 20,
	        page_index: 1,
	        region: _this.regionData.city,
	        success: function (res) {
	          for (var i = 0; i < res.data.length; i++) {
	            _this.selectArray.push({
	              // 获取返回结果，放到sug数组中
	              name: res.data[i].title,
	              address: res.data[i].address,
	              province: res.data[i].province,
	              city: res.data[i].city,
	              area: res.data[i].district,
	              latitude: res.data[i].location.lat,
	              longitude: res.data[i].location.lng
	            });
	          }
	          _this.setData({
	            selectList: _this.selectArray
	          });
	        }
	      });
	    },
		//为你推荐
		getGoodsRelated: function () {
		  let that = this;
		  util.request(api.Indextuijian).then(function (res) {
		    if (res.code=== 200) {
		      that.setData({
		        relatedGoods: res.data
		      });
		    }
		  });
		},
		getzuixin: function() {
			 let that = this;
			util.request(api.IndexUrlzuixin, {
			 }).then(function (res) {
						  if(res.data.code=200){
							  that.setData({
							    zuixin: res.data.newGoods,
							    rexiao: res.data.hotGoods
							  });
						  }
			 });
		},
		getUrlgonggao: function() {
			 let that = this;
			util.request(api.IndexUrlgonggao).then(function (res) {
			  that.setData({
			    gonggao: res.data.purchasePeopleList[0]
			  });
			  that.setData({
			    url: res.data.purchasePeopleList[0].url
			  });
			});
		},
	    //大学定位
	    getDate(e) {
	      wx.removeStorageSync('filterCity');
	      wx.setStorageSync('filterCity', e.id.name);
	      console.log(e.id);
	      this.setData({
	        selectList: this.selectList
	      });
	      util.request(api.Attr, {
	        schoolLists: this.selectList
	      }, "GET").then(res => {
	        console.log(res);
	      });
	      this.getIndexData();
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
