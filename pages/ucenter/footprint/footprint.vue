<!-- <template>
<view class="container">
  <view class="ts-mes"><text class="ca">长按可删除足迹!</text></view>
  <view class="footprint">
    <view class="day-item" v-for="(item, index) in footprintList" :key="index">
      <view class="day-hd">{{item[0].add_time}}</view>
      <view class="day-list">
        <view class="item" :data-footprint="iitem" @touchstart="touchStart" @touchend="touchEnd" @tap="deleteItem" v-for="(iitem, index2) in item" :key="index2">
          <image class="img" :src="iitem.list_pic_url"></image>
          <view class="info">
            <view class="name">{{iitem.name || ''}}</view>
            <view class="subtitle">{{iitem.goods_brief || ''}}</view>
            <view class="price">￥{{iitem.retail_price || '0.00'}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
   <view class="empty-view" v-if="footprintList.length <= 0">
      <image class="icon" src="../../../static/images/allorder.png"></image>
      <text class="text">没有足迹信息</text>
    </view>
</view>
</template> -->
<template>
	<view>
		<!-- <view class="container lr15 bg-white m-b-10" v-for="(item, index) in ['今天','昨天','2020-03-10']" :key="index">
			<view class="row">
				<view class="col-xs-12 b-b-1 p-t-15 p-b-15">
					{{item}}
				</view>
			</view> -->
			<view class="row p-t-10 p-b-10 b-b-1" v-for="(item, index) in footprintList" :key="index">
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
							<image src="/static/images/del.png" class="pa b0 r0 m-r-20 m-b-5" style="width:30rpx;height:30rpx;" @tap.native.stop="deleteItem" :data-con="item"></image>
						</view>
					</view>
					<view class='col-sub'>
						<image mode="aspectFill" :src='item.list_pic_url||item.primary_pic_url' class="img bg-f5" :url="'/pages/goods/goods?id=' + item.good_id"></image>
					</view>
				</view>
				</view>
			</view>
	<!-- 	</view> -->
	</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");

export default {
  data() {
    return {
      footprintList: [],
      touch_start: "",
      touch_end: ""
    };
  },

  components: {},
  props: {},

  onPullDownRefresh() {
    // 增加下拉刷新数据的功能
    var self = this;
    this.getFootprintList();
  },

  onLoad: function (options) {
    this.getFootprintList();
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    getFootprintList() {
      let that = this;
      var tmpFootPrint;
      util.request(api.FootprintList).then(function (res) {
        if (res.errno === 0) {
          // console.log(res.data);
          if (res.data.data != undefined) {
            tmpFootPrint = res.data.data[0];
			that.setData({
			  footprintList: tmpFootPrint
			});
          }    
        }
      });
    },

    deleteItem(e) {
      let that = this;
      let id = e.currentTarget.dataset.con.id;
      var touchTime = that.touch_end - that.touch_start;
      console.log(touchTime); //如果按下时间大于350为长按  

      /* if (touchTime > 350) {
        wx.showModal({
          title: '',
          content: '确定要删除足迹？',
          success: function (res) {
            console.log(footprint.id);

            if (res.confirm) {
              util.request(api.FootprintDelete, {
                footprintId: footprint.id
              }).then(function (res) {
                console.log(res);

                if (res.errno === 0) {
                  wx.showToast({
                    title: res.errmsg,
                    icon: 'success',
                    duration: 2000,
                    complete: function () {
                      that.getFootprintList(); // console.log('重新加载');
                      // console.log(that.data.footprintList);
                    }
                  });
                } else {
                  util.showErrorToast(res.errmsg);
                }
              });
              console.log('用户点击确定');
            }
          }
        });
      } else {
        wx.navigateTo({
          url: '/pages/goods/goods?id=' + footprint.goods_id
        });
      } */
	  util.request(api.FootprintDelete, {
	    footprintId: id
	  }).then(function (res) {
	    console.log(res);
	  
	    if (res.errno === 0) {
	      wx.showToast({
	        title: res.errmsg,
	        icon: 'success',
	        duration: 2000,
	        complete: function () {
	          that.getFootprintList(); // console.log('重新加载');
	          // console.log(that.data.footprintList);
	        }
	      });
	    } else {
	      util.showErrorToast(res.errmsg);
	    }
	  });
    },

    //按下事件开始  
    touchStart: function (e) {
      let that = this;
      that.setData({
        touch_start: e.timeStamp
      });
      console.log(e.timeStamp + '- touch-start');
    },
    //按下事件结束  
    touchEnd: function (e) {
      let that = this;
      that.setData({
        touch_end: e.timeStamp
      });
      console.log(e.timeStamp + '- touch-end');
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