<template>
	<view>
		<view class="container lr15">
			<view class="row p-t-10 p-b-10 bg-white m-b-10" v-for="(item, index) in collectList" :key="index" :data-index="index">
				<view class="col-xs-12 item-cart-box style2">
				<view class='layout sub85 clearfix'>
					<view class='col-main'>
						<view class='wrap' >
							<view class='title'>{{item.name || ''}}</view>
							<view class="spec">{{item.goods_brief || ''}}</view>
							<view class='price m-t-10'>
								<text>￥</text>
								<text class="em fs-15">{{item.retail_price || '0.00'}}</text>
							</view>
							<image src="/static/images/del.png" class="pa b0 r0 m-r-20 m-b-5" style="width:30rpx;height:30rpx;" @tap.native.stop="openGoods" :data-con="item"></image>
						</view>
					</view>
					<view class='col-sub'>
						<image mode="aspectFill" :src='item.list_pic_url||item.primary_pic_url' class="img bg-f5" :url="'/pages/goods/goods?id=' + item.good_id"></image>
					</view>
				</view>
				</view>
			</view>
			<view class="empty-view" style="margin-top: 30%" v-if="collectList.length <= 0">
					<image mode="aspectFit" class="icon" src="/static/images/allorder.png"></image>
					<text class="text">无收藏商品数据</text>
			</view>	
		</view>
	</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");

export default {
  data() {
    return {
      typeId: 0,
      collectList: [],
      touch_start: "",
      touch_end: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {
    this.getCollectList();
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    getCollectList() {
      let that = this;
      util.request(api.CollectList, {
        typeId: that.typeId
      }).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            collectList: res.data
          });
        }
      });
    },

    openGoods(e) {
      let that = this;
	  console.log(e.currentTarget.dataset.con);
      //let goodsId = that.collectList[event.currentTarget.dataset.index].good_id; //触摸时间距离页面打开的毫秒数  
       let goodsId = e.currentTarget.dataset.con.good_id;
      var touchTime = that.touch_end - that.touch_start; //如果按下时间大于350为长按  
	  util.request(api.CollectAddOrDelete, {
	    typeId: that.typeId,
	    valueId: goodsId
	  }, 'POST').then(function (res) {
	    if (res.errno === 0) {
	      wx.showToast({
	        title: '取消成功',
	        icon: 'success',
	        duration: 2000
	      });
	      that.getCollectList();
	    }
	  });
    },

    //按下事件开始  
    touchStart: function (e) {
      let that = this;
      that.setData({
        touch_start: e.timeStamp
      });
    },
    //按下事件结束  
    touchEnd: function (e) {
      let that = this;
      that.setData({
        touch_end: e.timeStamp
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
@import "../../../static/css/main.css";
</style>