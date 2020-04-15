<template>
<view calss="container">
		<view class="row sort-nav-box bg-white">
					<view class="col-xs-3 item" v-for="(item, index) in filter_list" :key="index" @click="filter(item.field,filter_sort=='desc'?'asc':'desc')" v-if="key.length>0">
						<view class="txt" v-bind:class="filter_field==item.field?'ac':''">{{item.title}}</view>
						<image :src="'../../static/images/sort-'+filter_sort+'.png'" style="height:20rpx;width:20rpx;" v-if="filter_field==item.field && filter_sort" class="m-l-5"></image>
					</view>
				</view>
				<view class="row">
					<navigator :url="'../goods/goods?id=' + item.id" class="item-list-box style2 col-xs-6" v-for="(item, index) in key" :key="index" v-if="key.length>0">
						<view class="main">
							<view class="img">
								<image wx:if="item.list_pic_url||item.primary_pic_url" :src="item.list_pic_url||item.primary_pic_url" mode="aspectFill" class="bg-f5" style="height:345rpx;"></image>
							</view>
							<view class="title">{{item.name}}</view>
							<view class="flex-between p-r-10">
								<view class="price">
									¥<text class="text1">{{item.retail_price}}</text>
								</view>
								<image src="../../static/images/cart-btn.png" style="width:50rpx;height:50rpx;"></image>
							</view>
						</view>
					</navigator>
				</view>
				<view class="empty-view" style="margin-top: 30%" v-if="key.length <= 0">
						<image mode="aspectFit" class="icon" src="../../static/images/allorder.png"></image>
						<text class="text">无商品数据</text>
				</view>
		</view>
</template>

<script>
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

export default {
  data() {
    return {
     filter_field:'ordid',
     filter_sort:'desc',
     filter_list: [
     	{
     		"field": "ordid",
     		"title": "综合"
     	},
     	{
     		"field": "price",
     		"title": "价格"
     	},
     	{
     		"field": "sales",
     		"title": "销量"
     	}/* ,
     	{
     		"field": "is_new",
     		"title": "上新"
     	} */
     ],
     key: [],
     word: '',
	 id:0,
	 attrid:0,
	 newId:0,
	 page: 1,
	 size: 10,
	 totalPages: 1,
	 nomore:false
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  /* wx.showToast({
	  title: '加载中...',
	  mask: false,
	  icon: 'loading',
	  duration: 200
	  }), */
	  console.log(options);
	  var that = this;
	  var id = options.id;
	  var attrid = options.attrid;
	  var newId = options.newId;
	  if(id > 0){
		  that.setData({
		  		  id:options.id
		  });
		  that.getGoodsList();
	  }else if(attrid >0){
		  that.setData({
		  		  attrid:options.attrid
		  });
		  that.getGoodsList();
	  }else if(newId ==1){
		  that.setData({
		  		  newId:options.newId
		  });
		  that.getNewGoodsList();
	  }else {
		 that.setData({
		 		  word:options.keyword
		 });
		 that.getData(); 
	  }  
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
  onReachBottom: function () {
	  let that = this;
	if(that.newId==1){
		that.getNewGoodsList();
	}else if(that.keyword !="" || that .keyword !=null){
		 this.getData();
	}
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    getData() {
   	var that = this;
	if (that.totalPages <= that.page-1) {
	  that.setData({
	    nomore: true
	  });
	  return;
	}
   	util.request(api.SearchGoods,{
		keyword:that.word,
		page: that.page,
		size: that.size
	},'GET')
   	.then(function(res) {
   		if(res.code === 200){
   			if(res.data){
   				that.setData({
   					key: that.key.concat(res.data.list),
					page: that.page+1,
					totalPages: res.data.pages
   				});
   			}	
   		}
   	})
   },
   getGoodsList: function () {
     var that = this; 
     util.request(api.GoodsList, {
       categoryId: that.id,
	   attriId:that.attrid
     }).then(function (res) {
       console.log(res);
	   if(res.errno === 0){
	   	if(res.data){
	   		that.setData({
	   			 key: res.data.goodsList
	   		});
	   	}	
	   }
 
     });
   },
   //查询所有新品列表
   getNewGoodsList: function(){
	   var that = this;
	   if (that.totalPages <= that.page-1) {
	     that.setData({
	       nomore: true
	     });
	     return;
	   }
	   util.request(api.NewGoodsList,{
		   pageIndex: that.page,
		   pagesize: that.size
	   }).then(function (res) {
	     console.log(res);
	     if(res.code === 200){	    
	     		that.setData({
	     			 key: that.key.concat(res.data.list),
					 page: that.page+1,
					 totalPages: res.data.pages
	     		});	   		
	     }
	    
	   });
   },
	filter: function(field,sort) {
				var _this = this;
				_this.filter_key = field+'_'+sort;
				_this.filter_field = field;
				_this.filter_sort = sort;
				console.log(_this.filter_key);
				console.log(_this.filter_field);
				console.log(_this.filter_sort);
				if(_this.key.length>0){
					let goodskey = _this.key.sort(function (p1,p2) {
						var result = _this.filter_key;
						if(result == 'price_desc'){
							return p2.retail_price - p1.retail_price
						}else if(result == 'price_asc'){
							return p1.retail_price - p2.retail_price
						}else if(result == 'sales_desc'){
							return p2.browse - p1.browse
						}else if(result == 'sales_asc'){
							return p1.browse -p2.browse
						}else if(result == 'ordid_desc'){
							return Date.parse(p2.add_time) - Date.parse(p1.add_time)
						}else if(result == 'ordid_asc'){
							return Date.parse(p1.add_time) - Date.parse(p2.add_time)
						}
					})
					
				}
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