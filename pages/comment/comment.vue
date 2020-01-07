<template>
<view class="comments">
    <view class="h">
        <view :class="'item ' + ( showType == 0 ? 'active' : '')" @tap="switchTab">
            <view class="txt">全部({{allCount}})</view>
        </view>
        <view :class="'item ' + ( showType == 0 ? '' : 'active')" @tap="switchTab">
            <view class="txt">有图({{hasPicCount}})</view>
        </view>
    </view>
  <view class="b">
    <view class="item" v-for="(item, index) in comments" :key="index">
      <view class="info">
        <view class="user">
          <image :src="item.user_info.avatar"></image>
          <text>{{item.user_info.nickname}}</text>
        </view>
        <view class="time">{{item.add_time}}</view>
      </view>
      <view class="comment">{{item.content}}</view>
      <view class="imgs" v-if="item.pic_list.length > 0">
        <image class="img" v-for="(pitem, index2) in item.pic_list" :key="index2" :src="pitem.pic_url"></image>
      </view>
    </view>
  </view>
  <view class="empty-view" v-if="comments.length <= 0">
      <image class="icon" src="../../static/images/allorder.png"></image>
      <text class="text">无评论信息</text>
    </view>
</view>
</template>

<script>
var util = require("../../utils/util.js");
var api = require("../../config/api.js");

export default {
  data() {
    return {
      comments: [],
      allCommentList: [],
      picCommentList: [],
      typeId: 0,
      valueId: 0,
      showType: 0,
      allCount: 0,
      hasPicCount: 0,
      allPage: 1,
      picPage: 1,
      size: 20
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      typeId: options.typeId,
      valueId: options.valueId
    });
    this.getCommentCount();
    this.getCommentList();
  },
  onReady: function () {// 页面渲染完成
  },
  onShow: function () {// 页面显示
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  onReachBottom: function () {
    console.log('onPullDownRefresh');

    if (this.showType == 0) {
      if (this.allCount / this.size < this.allPage) {
        return false;
      }

      this.setData({
        'allPage': this.allPage + 1
      });
    } else {
      if (this.hasPicCount / this.size < this.picPage) {
        return false;
      }

      this.setData({
        'picPage': this.picPage + 1
      });
    }

    this.getCommentList();
  },
  methods: {
    getCommentCount: function () {
      let that = this;
      util.request(api.CommentCount, {
        valueId: that.valueId,
        typeId: that.typeId
      }).then(function (res) {
        console.log(res);

        if (res.errno === 0) {
          that.setData({
            allCount: res.data.allCount,
            hasPicCount: res.data.hasPicCount
          });
        }
      });
    },
    getCommentList: function () {
      let that = this;
      util.request(api.CommentList, {
        valueId: that.valueId,
        typeId: that.typeId,
        size: that.size,
        page: that.showType == 0 ? that.allPage : that.picPage,
        showType: that.showType
      }).then(function (res) {
        if (res.errno === 0) {
          if (that.showType == 0) {
            that.setData({
              allCommentList: that.allCommentList.concat(res.data.data),
              allPage: res.data.currentPage,
              comments: res.data.data
            });
          } else {
            that.setData({
              picCommentList: that.picCommentList.concat(res.data.data),
              picPage: res.data.currentPage,
              comments: res.data.data
            });
          }
        }
      });
    },
    switchTab: function () {
      this.setData({
        showType: this.showType == 1 ? 0 : 1
      });
      this.getCommentList();
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
@import "./comment.css";
</style>