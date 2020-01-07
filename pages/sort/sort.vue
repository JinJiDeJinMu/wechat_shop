<template>
<!--pages/sort/sort.wxml-->
<view class="sort">
  <view class="sort-main">
    <!-- 左边菜单数据 -->
    <scroll-view scroll-y="true" class="leftmenu">
      <block v-for="(item, index) in categoryList" :key="index">
        <view :class="'menu-item ' + (curNav==item.categoryId?'active':'') + ' '" :data-index="index" :data-id="item.categoryId" @tap="onMenuTab">
          {{item.name}}
        </view>
      </block>
    </scroll-view>
    <!-- 右边菜单数据 -->
    <scroll-view scroll-y="true" class="rightcontent" :scroll-into-view="prodId">
      <view class="cont-item">
        <view v-if="categoryList[curIndex].ishaveChild">
          <block v-for="(v, index) in categoryList[curIndex].foodslist" :key="index">
            <view class="show-item" @tap="toProdPage" :data-prodid="item.prodId">
              <view class="more-prod-pic">
                <image :src="v.image_url" class="more-pic" mode="widthFix"></image>
              </view>
              <view class="prod-text-right">
                <view class="prod-text more">{{v.name}}</view>
                <view class="cate-prod-info">{{v.description}}</view>
                <view class="prod-price more">
                  <text class="symbol">￥</text>
                  <text class="big-num">{{v.price}}</text>
                </view>
              </view>
            </view>
          </block>
        </view>
      </view>
    </scroll-view>
  </view>
</view>
</template>

<script>
// pages/sort/sort.js
var util = require("../../utils/util.js");
var api = require("../../config/api.js");

export default {
  data() {
    return {
      categoryImg: "http://img95.699pic.com/photo/50065/2412.jpg_wh300.jpg",
      categoryList: [{
        categoryId: 0,
        name: "水果",
        ishaveChild: true,
        foodslist: [{
          prodId: 100,
          name: "宫保鸡丁",
          description: "现实是残酷的，在这个世界我怎样才能弥补这个空洞？我谁也不是，也不想成为谁。",
          month_sales: 868,
          satisfy_rate: 6,
          price: 20,
          image_url: "http://img95.699pic.com/photo/50065/2412.jpg_wh300.jpg"
        }, {
          prodId: 101,
          name: "苹果",
          description: "现实是残酷的，在这个世界我怎样才能弥补这个空洞？你说啥",
          month_sales: 868,
          satisfy_rate: 6,
          price: 20,
          image_url: "http://img95.699pic.com/photo/50074/9957.jpg_wh300.jpg"
        }, {
          prodId: 102,
          name: "香蕉",
          description: "瞅啥呢,瞅你咋地",
          month_sales: 868,
          satisfy_rate: 6,
          price: 20,
          image_url: "http://img95.699pic.com/photo/50053/2363.jpg_wh300.jpg"
        }]
      }, {
        categoryId: 1,
        name: "衣服",
        ishaveChild: true,
        foodslist: [{
          prodId: 200,
          name: "大衣",
          description: "现实是残酷的，在这个世界我怎样才能弥补这个空洞？我谁也不是，也不想成为谁。",
          month_sales: 868,
          satisfy_rate: 6,
          price: 20,
          image_url: "http://img95.699pic.com/photo/50045/7707.jpg_wh300.jpg"
        }, {
          prodId: 201,
          name: "裤子",
          description: "现实是残酷的，在这个世界我怎样才能弥补这个空洞？你说啥",
          month_sales: 868,
          satisfy_rate: 6,
          price: 20,
          image_url: "http://img95.699pic.com/photo/50035/2929.jpg_wh300.jpg"
        }, {
          prodId: 202,
          name: "写着",
          description: "瞅啥呢,瞅你咋地",
          month_sales: 868,
          satisfy_rate: 6,
          price: 20,
          image_url: "http://img95.699pic.com/photo/50059/3579.jpg_wh300.jpg"
        }]
      }, {
        categoryId: 2,
        name: "零食",
        ishaveChild: true,
        foodslist: [{
          prodId: 300,
          name: "苏宁易购",
          description: "现实是残酷的，在这个世界我怎样才能弥补这个空洞？我谁也不是，也不想成为谁。",
          month_sales: 868,
          satisfy_rate: 6,
          price: 20,
          image_url: "http://img95.699pic.com/photo/50072/4714.jpg_wh300.jpg"
        }, {
          prodId: 301,
          name: "松鼠",
          description: "三只松鼠",
          month_sales: 868,
          satisfy_rate: 6,
          price: 20,
          image_url: "http://img95.699pic.com/photo/50072/3111.jpg_wh300.jpg"
        }, {
          prodId: 302,
          name: "天猫",
          description: "瞅啥呢,瞅你咋地",
          month_sales: 868,
          satisfy_rate: 6,
          price: 20,
          image_url: "http://img95.699pic.com/photo/50067/6092.jpg_wh300.jpg"
        }]
      }],
      curNav: 1,
      curIndex: 0
    };
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
    onMenuTab(e) {
      console.log(e);
      var id = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index; // 把点击到的某一项，设为当前index  

      this.setData({
        curNav: id,
        curIndex: index
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
@import "./sort.css";
</style>