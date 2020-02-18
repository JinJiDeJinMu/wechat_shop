<template>
<!--pages/goods/publish/publish.wxml-->
<view class="baby">
  <view class="baby-header">
    <text class="baby-grade">宝贝评分</text>
    <!-- <image src="../../../static/images/u8.png" class="baby-img"></image> -->
    <i-cell title="手势touch选择星">
      <i-rate @change="onChange3" :value="starIndex3">
        {{starIndex3}}星
      </i-rate>
    </i-cell>
  </view>
  <image src="../../../static/images/u10_line.png" class="u10-img"></image>
  <view class="con">
    <textarea placeholder="宝贝满足你的期待吗？说说它的优点和美中不足的地方吧" class="con-discuss" @input="discussFun">
    </textarea>
    <view class="add">
        <view class="question-images">
          <block v-for="(item, index) in images" :key="index">
            <view class="q-image-wrap">
              <!-- 图片缩略图  -->
              <image class="q-image" :src="item" mode="aspectFill" :data-idx="index" @tap="handleImagePreview"></image>
              <!-- 移除图片的按钮  -->
                 <view class="q-image-remover" :data-idx="index" @tap="removeImage">删除</view> 
            </view>
          </block>
        </view>
      <view>
        <image src="../../../static/images/u15.png" class="add-img" @tap="addimg"></image>
      </view>
    </view>
    <button class="submit" @tap="submit">提交</button>
  </view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
const api = require("../../../config/api.js");

export default {
  data() {
    return {
      starIndex3: 0,
      // 评论
      discuss: "",
      con: [],
      //上传图片
      images: [],
      imageList: [],
      userId: "",
      orderNo: "",
      goodId: "",
      content: "",
      starLevel: "",
      del: false
    };
  },
  components: {
    //iRate
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      userId: options.user_id,
      orderNo: options.order_no,
      goodId: options.good_id
    });
  },

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
    onChange3(e) {
      const index = e.detail.index;
      this.setData({
        starIndex3: index
      });
    },

    // 评论
    discussFun(e) {
      this.setData({
        discuss: e.detail.value
      });
    },

    // 上传图片
    addimg(e) {
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        //可选择原图或压缩后的图片
        sourceType: ['album', 'camera'],
        //可选择性开放访问相册、相机
        success: res => {
          const images = that.images.concat(res.tempFilePaths); // 限制最多只能留下3张照片

          that.images = images.length <= 3 ? images : images.slice(0, 3);
          that.setData({
            images: images
          });
          wx.uploadFile({
            url: api.Comment,
            filePath: that.images[0],
            name: 'files',
            header: {
              'content-type': 'multipart/form-data',
              'X-Nideshop-Token': wx.getStorageSync('token')
            },
            formData: {},
            success: res => {
              that.imageList.push(res.data);
              ;
            }
          });
        }
      });
    },

    //删除图片
    removeImage(e) {
      const idx = e.target.dataset.idx;
      this.setData({
        images: this.images
      });
      this.images.splice(idx, 1);
    },

    handleImagePreview(e) {
      const idx = e.target.dataset.idx;
      const images = this.images;
      wx.previewImage({
        current: images[idx],
        //当前预览的图片
        urls: images //所有要预览的图片

      });
    },
	
    // 提交
    submit(e) {
         util.request(api.CommentText, {
           userId: this.userId,
           orderNo: this.orderNo,
           goodId: this.goodId,
           content: this.discuss,
           starLevel: this.starIndex3,
           imageList: this.imageList
         }, "GET").then(res => {
           if (res.code === 200) {
             wx.showToast({
               title: '评论成功'
             });
         
             if (res.message == "OK") {
               wx.navigateTo({
                 url: '/pages/ucenter/order/order?id=403'
               });
             }
           }
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
@import "./publish.css";
</style>