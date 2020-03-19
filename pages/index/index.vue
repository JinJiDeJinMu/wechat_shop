<template>
	<view>
	<!-- <selectmap :prop-array="selectList" @myget="getDate"></selectmap> -->
	<view class='index-search-box'>
	    <view class="input-box">
		<navigator url="/pages/search/search" class="input search-bar">
	      <image src="/static/img/search.png"></image>
	      <input :placeholder="'商品搜索，共'+goodsCount+'款好物'" placeholder-class="f-shallow"></input>
		  </navigator>
	    </view>
	</view>
	<view class='container m-t-10 bg-white'>
	    <view class="row">
	        <view class="col-xs-12">
	<swiper class="index-swiper-box" indicator-active-color="#f81314" indicator-color='#abbcc1' circular="true" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
		          <block v-for="(item, index) in banner" :key="index">
				  <swiper-item>
				    <view class="haimg">
				      <image :src="item.image_url" background-size="cover" @tap.native.stop="bindimg" :data-con="item"></image>
				    </view>
				  </swiper-item>
				  </block>  
				</swiper>
	        </view>
	    </view>
	   <view class="row">
	      <view class="col-xs-12 p-l-5 p-r-5">
	        <view class="index-cate-box">
			  <view class="item" v-for="(item, index) in fenlei" :key="index">
			    <navigator :url="'../category/category?id=' + item.id">
			      <image class="img" mode="aspectFit" :src="item.bannerUrl"></image>
			      <view>{{item.name}}</view>
			    </navigator>
			  </view>
	        </view>
	      </view>
	    </view>
	    <view class="row">
	      <view class="col-xs-12">
	        <view class="index-msg-box">
	          <image src="/static/img/laba.png"></image>
	          <swiper class="list" vertical="true" autoplay="true" circular="true">
	            <swiper-item v-for="(item, index) in [1,2,3]" :key="index"> {{gonggao.conent}} </swiper-item>
	          </swiper>
	        </view>
	      </view>
	    </view>
	</view>

	<view v-for="(item, index) in categoryGoodsList" :key="index">
	<view v-if="item.showStyle==1&&item.goodsList.length>0">
	<view class='container m-t-10 bg-white'>
	  <view class="row">
	    <view class="col-xs-12">
	      <view class="index-title-box">
	        <view class="left">
	          <image src="/static/img/title-line.png"></image>
	          <text>{{item.name}}</text>
	        </view>
	        <navigator class="right" url="/pages/search/search">
	          <text>更多</text>
	          <image src="/static/img/angle-right.png"></image>		
	        </navigator>
	      </view>
	    </view>
	  </view>
	<view class="row">
	<view v-for="(model, index2) in item.goodsList" :key="index2">
	  <navigator :url="'../goods/goods?id=' + model.id" class="item-list-box col-xs-4">
	      <view class="square-image">
	          <image :src="model.list_pic_url||model.primary_pic_url"></image>
	      </view>
	      <view class="title">{{model.name}}
		  <text class="text1">{{model.browse}}喜欢</text>
		  </view>
		   <view class="title" v-if="model.goods_brief.length >0">{{model.goods_brief}}</view>
	      <view class="price">
	        <text class="text1">￥{{model.retail_price}}</text>
			
	      </view>
	  </navigator>
	</view>
	</view>
	</view>
	</view>
	</view>

<view class="container index-item-box oh">
    <view class="row m-t-20 m-b-20">
        <view class="col-xs-12 tc">
          <text class="f-grey m-r-20">//</text> 
          <text class="f-black">新品</text> 
          <text class="f-grey m-l-20" @tap="moremore">//</text> 
        </view>
    </view>
    <view class="row">
	  <view v-for="(item, index) in zuixin" :key="index">
      <navigator :url="'../goods/goods?id=' + item.id" class="col-xs-6" >
        <view class="item-list-box style2 bg-white">
          <view class="square-image">
              <image src mode="widthFix" :src="item.list_pic_url||item.primary_pic_url"></image>
          </view>
          <view class="title">{{item.name}}</view>
          <view class="price">
            <text class="i text1">¥</text><text class="text1">{{item.retail_price}} </text>
          </view>
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
	var QQMapWX = require("../../wxcomponents/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js");
	var qqmapsdk; 
	const app = getApp().globalData;
	import indexTypeData from "../../wxcomponents/index-type-data/index-type-data";
	import selectmap from "../../wxcomponents/select/select";
	export default {
	  data() {
	    return {
	      categoryGoodsList: [],
	      banner: [],
	      goodsCount: 0,
	      fenlei: [],
	      zuixin: [],
	      ppicc: 0.0,
	      gonggao: [],
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
	    qqmapsdk = new QQMapWX({
	      key: api.TcentConfigMapKey
	    });
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
	        school: wx.getStorageSync('filterCity')
	      }).then(function (res) {
	        that.setData({
	          categoryGoodsList: res.data.productList
	        });
	        that.setData({
	          fenlei: res.data.categoryList
	        });
	        that.setData({
	          banner: res.data.banner
	        });
	      });
	      util.request(api.IndexUrlgonggao).then(function (res) {
	        that.setData({
	          gonggao: res.data.purchasePeopleList[0]
	        });
	        that.setData({
	          url: res.data.purchasePeopleList[0].url
	        });
	      });
	      util.request(api.IndexUrlzuixin, {
	        school: wx.getStorageSync('filterCity')
	      }).then(function (res) {
	        that.setData({
	          zuixin: res.data
	        });
	      });
	      util.request(api.GoodsCount).then(function (res) {
	        that.setData({
	          goodsCount: res.data.goodsCount
	        });
	      });
	    },
	    //轮播图跳转
	    bindimg(e) {
			 var type = e.currentTarget.dataset.con.type;
			 if (type == 0) {
				/* wx.navigateTo({//活动
				  url: '/pages/entry/entry'
				}); */
			  } else if (type == 1) {//爆品展示
				wx.navigateTo({
				  url: '/pages/campuspartner/campuspartner?id='+e.currentTarget.dataset.con.id
				});
			  } else if (type == 2) {//图文介绍
				wx.navigateTo({
				  url: '/pages/enjoy/enjoy?id='+e.currentTarget.dataset.con.id
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
@import "./index.css";
</style>
