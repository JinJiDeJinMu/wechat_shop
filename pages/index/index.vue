<template>
<view>
<view class="container">
  <view class="indexheader">
  <view class="con">
    <selectmap :prop-array="selectList" @myget="getDate"></selectmap>
    <view class="search">
      <navigator url="/pages/search/search" class="input search-bar">
        <image mode="aspectFit" class="icon"></image>
        <text class="txt">商品搜索, 共{{goodsCount}}款好物</text>
      </navigator>
    </view>
  </view>
  <view class="ding">
    <swiper class="banner" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
      <swiper-item class="banner-item" v-for="(item, index) in banner" :key="index">
        <view class="haimg">
          <image :src="item.image_url" background-size="cover" @tap.native.stop="bindimg" :data-con="item"></image>
        </view>
      </swiper-item>
    </swiper>
  </view>
  </view>
  <view class="duozhong">
    <view :class="'dz1 ' + (fenlei.length <= 5 ? 'sigle-dz1' : '')" v-for="(item, index) in fenlei" :key="index">
      <navigator :url="'../category/category?id=' + item.id">
        <image class="dz11" mode="aspectFit" :src="item.bannerUrl"></image>
        <view class="dz12">{{item.name}}</view>
      </navigator>
    </view>
  </view>
  <!-- 消息滚动 -->
  <view class="zoumadeng" @tap="baidu">
    <image mode="aspectFit" class="img" src="../../static/imgimgimg/laba.png"></image>
    <view class="marquee_container" style="--marqueeWidth--:-12em">
      <view class="marquee_text">
        {{gonggao.conent}}
      </view>
    </view>
  </view>
  <!-- 分类自带产品list -->
  <view class="goods-list-box" v-for="(item, index) in categoryGoodsList" :key="index">
    <view v-if="item.showStyle==1&&item.goodsList.length>0">
      <view class="tit">
        <view class="tit-box">
          <view class="tit1">{{item.name}}</view>
          <view class="tit2"></view>
        </view>
        <navigator class="more-button" :url="'../category/category?id=' + item.id">
          <view class="tit3">更多></view>
        </navigator>
        <view class="bottom-line"></view>
      </view>
      <scroll-view class="scroll-view_H" scroll-x>
        <view id="green" class="scroll-view-item_H  bc_green" v-for="(model, index2) in item.goodsList" :key="index2">
          <navigator :url="'../goods/goods?id=' + model.id">
            <image mode="aspectFit" class="ab" :src="model.list_pic_url||model.primary_pic_url"></image>
            <view class="aa">{{model.name}}</view>
            <view class="aaa">
              <view class="aaa1">￥{{model.retail_price}}</view>
              <view class="aaa2" v-if="model.market_price">￥{{model.market_price}}</view>
            </view>
          </navigator>
        </view>
      </scroll-view>
    </view>
    <view v-if="item.showStyle==0&&item.goodsList.length>0">
      <view class="tit">
        <view class="tit1">{{item.name}}</view>
        <view class="tit2"></view>
        <navigator :url="'../goods/goods?id=' + model.id">
          <view class="tit3" @tap="moremore">更多></view>
        </navigator>
      </view>
      <view v-for="(model, index2) in item.goodsList" :key="index2">
        <navigator :url="'../goods/goods?id=' + model.id">
          <view class="active">
            <view class="tu">
              <image mode="aspectFit" :src="model.list_pic_url"></image>
            </view>
            <view class="desc">
              {{model.promotion_desc||'没有编辑描述内容'}}
            </view>
            <view class="pic">
              <view class="pic1">￥{{model.retail_price}}</view>
              <view class="pic2" v-if="model.market_price">￥{{model.market_price}}</view>
              <navigator :url="'../goods/goods?id=' + model.id">
                <view class="pic3">立即购买</view>
              </navigator>
            </view>
          </view>
        </navigator>
      </view>
    </view>
  </view>
</view>
<view class="zuixin">
  <view class="tit">
    <view class="tit-box">
      <view class="tit1">新品</view>
    </view>
    <navigator class="more-button" :url="'../goods/goods?id=' + model.id">
      <view class="tit3" @tap="moremore"></view>
    </navigator>
  </view>
  <view class="goods1" v-for="(item, index) in zuixin" :key="index">
    <navigator :url="'../goods/goods?id=' + item.id">
      <image mode="aspectFit" :src="item.list_pic_url||item.primary_pic_url" class="goods11"></image>
      <view class="goods12">{{item.name}}</view>
      <view class="goods13">
        <view class="goods131">￥{{item.retail_price}}</view>
        <view class="goods132" v-if="item.market_price">{{model.market_price}}</view>
      </view>
    </navigator>
  </view>
</view>
</view>
</template>

<script>
const util = require("../../utils/util.js");
const api = require("../../config/api.js");
const user = require("../../services/user.js");
var QQMapWX = require("../../wxcomponents/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js");
var qqmapsdk; //获取应用实例
//获取应用实例
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
    // 增加下拉刷新数据的功能
    var self = this;
    self.getIndexData();
  },

  onLoad: function (options) {
    let self = this; // console.log(options);

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
    wx.getLocation({
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
            // console.log(res)
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
        // console.log(err)
        wx.hideLoading();
        wx.showToast({
          title: '定位失败',
          icon: 'none',
          duration: 1500
        });
      }

    });
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
          banner: res.data.activity
        }); // console.log(that.data.banner)
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
      if (e.currentTarget.dataset.con.id == 10) {
        wx.navigateTo({
          url: '/pages/entry/entry'
        });
      } else if (e.currentTarget.dataset.con.id == 9) {
        wx.navigateTo({
          url: '/pages/campuspartner/campuspartner'
        });
      } else if (e.currentTarget.dataset.con.id == 8) {
        wx.navigateTo({
          url: '/pages/enjoy/enjoy'
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
          // console.log(res);
          for (var i = 0; i < res.data.length; i++) {
            _this.selectArray.push({
              // 获取返回结果，放到sug数组中
              name: res.data[i].title,
              // id: res.data[i].id,
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
          }); // console.log(_this.data.selectList)

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