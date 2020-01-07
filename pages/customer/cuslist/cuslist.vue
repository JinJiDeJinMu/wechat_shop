<template>
<!--pages/customer/cuslist/cuslist.wxml-->
<view class="container"> 
<view class="search-header">
    <view class="input-box">
      <image class="icon" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png"></image>
      <input name="input" class="keywrod" :value="q.uname" confirm-type="search" @input="inputChange" @confirm="onKeywordConfirm" placeholder="手机号或客户名"></input>
      <image class="del" v-if="q.uname" @tap="clearKeyword" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png"></image>
    </view>
    <view class="btnBox">
      <button :class="'commoncol ' + (q.upkeepState==2?'selcolor':'wselcolor')" @tap="selWhId1">已维护</button>
        <button :class="'commoncol ' + (q.upkeepState==1?'selcolor':'wselcolor')" @tap="selWhId">未维护</button>
    </view>
    <view class="selValue">
      <text class="commoncol wselcolor">客户数量：<text class="num">{{customerCount}}</text></text>
      <text class="commoncol wselcolor">已维护数量：<text class="num">{{customerYcount}}</text></text>
      <text class="commoncol wselcolor">未维护数量：<text class="num">{{customerWcount}}</text></text>
    </view> 
  </view>
  <view class="cus-list">
    <view class="cusBox" v-for="(item, index) in orderList" :key="index" style="background: url(http://pic2.51shop.ink/111111.png); background-size:cover;"> 
      <view class="common">
        <view class="cusli">
           <view class="li">客户名：{{item.uname?item.uname:''}}</view>
           <view class="li">电话：{{item.mobile?item.mobile:''}}</view>  
        </view>
        <view class="cusli">
           <view class="li">生日：{{item.birthday?item.birthday:''}}</view> 
           <view class="li">性别：{{item.gender==1?'男':'女'}}</view>        
        </view> 
      </view> 
      <view class="cusdb">
        <view class="cusli_n">
            <view class="li">地址：{{item.addressVo.full_region?item.addressVo.full_region:''}}{{item.addressVo.detailInfo?item.addressVo.detailInfo:''}}</view>
            <navigator style="display: inline-block;" :url="'/pages/customer/add/add?id=' + item.id + '&v=1'">
               <view class="li" style="color:#bdb045">编辑</view>
            </navigator>        
        </view> 
      </view>
      <image class="icon_ywh" src="../../../static/images/cus_ywh.png" v-if="item.upkeepState==2"></image>
    </view>
  </view>
  <view v-if="orderList.length>5" class="loadmore">
      <block v-if="nomore">
        <text>{{nomoreText}}</text>
      </block>
      <block v-else>
        <text class="iconfont icon-loading loading" space="nbsp"></text>
        <text> {{loadmoreText}}</text>
      </block>
    </view>
    <view class="addsty">
       <navigator url="/pages/customer/add/add?v=1">新增客户</navigator>
    </view>
  <view class="empty-view" v-if="orderList.length <= 0">
      <image class="icon" src="../../../static/images/allorder.png"></image>
      <text class="text">无客户信息</text>
    </view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");

export default {
  data() {
    return {
      orderList: [],
      array: ['请选择类型', '客户', '准客户'],
      index: 0,
      page: 1,
      size: 6,
      loadmoreText: '正在加载更多数据',
      nomoreText: '全部加载完成',
      nomore: false,
      totalPages: 1,
      q: {
        uname: '',
        customerState: 0,
        upkeepState: 0
      },
      customerCount: 0,
      customerYcount: 0,
      customerWcount: 0
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {},
  onReachBottom: function () {
    console.log("下一页");
    this.getOrderList();
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    var self = this;
    self.setData({
      orderList: [],
      page: 1,
      totalPages: 1
    });
    self.getOrderList();
  },

  onReady: function () {// 页面渲染完成
  },
  onShow: function () {
    this.setData({
      orderList: [],
      page: 1
    });
    wx.showLoading({
      title: '加载中...',
      success: function () {}
    });
    this.getOrderList();
    this.getCount();
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    selKhId: function () {
      let q = this.q;
      q.customerState = 1;
      q.upkeepState = 0;
      this.setData({
        q: q
      });
      this.onKeywordConfirm();
    },
    selWhId: function () {
      let q = this.q;
      q.upkeepState = 1;
      q.customerState = 0;
      this.setData({
        q: q
      });
      this.onKeywordConfirm();
    },
    selWhId1: function () {
      let q = this.q;
      q.upkeepState = 2;
      q.customerState = 0;
      this.setData({
        q: q
      });
      this.onKeywordConfirm();
    },

    inputChange(event) {
      let q = this.q;
      q.uname = event.detail.value;
      this.setData({
        q: q
      });
    },

    clearKeyword() {
      let q = this.q;
      q.uname = '';
      this.setData({
        q: q
      });
    },

    bindPickerChange(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value);
      this.setData({
        index: e.detail.value
      });
    },

    onKeywordConfirm() {
      this.setData({
        orderList: [],
        page: 1,
        totalPages: 1
      });
      this.getOrderList();
    },

    getCount() {
      const that = this;
      util.request(api.GetCount, {
        customerState: 1
      }, 'POST').then(function (res) {
        if (res.errno === 0) {
          that.setData({
            customerCount: res.data.customerCount,
            customerWcount: res.data.customerWcount,
            customerYcount: res.data.customerYcount
          });
        }
      });
    },

    getOrderList() {
      let that = this;

      if (that.totalPages <= that.page - 1) {
        that.setData({
          nomore: true
        });
        return;
      }

      util.request(api.CustomerList, {
        currentPage: that.page,
        numsPerPage: that.size,
        uname: that.q.uname,
        customerState: 1,
        upkeepState: that.q.upkeepState
      }, 'POST').then(function (res) {
        if (res.errno === 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].addressVo.detailInfo.length > 8) {
              res.data.data[i].addressVo.detailInfo = res.data.data[i].addressVo.detailInfo.substring(0, 8) + "...";
            }
          }

          that.setData({
            orderList: that.orderList.concat(res.data.data),
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
@import "./cuslist.css";
</style>