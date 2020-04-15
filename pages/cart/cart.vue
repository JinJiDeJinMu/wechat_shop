<template>
	<view >
		<view class="flex-between p-t-15 p-b-15 p-l-10 p-r-10">
			<view class="flex-align-start">
				<image src="/static/images/c_1.png" style="width:26rpx;height:26rpx;"></image>
				<view class="fs-12 f-grey m-l-5">未名严选，让您的购物体验简单省心</view>
			</view>
			<view @click="onEdit">{{!isedit?'编辑':'完成'}}</view>
		</view>
		<view class="bg-f5 container cart-list-box oh">
			<view v-for="(item, index) in cartGoods" :key="index" class="row content bg-white m-b-10 p-t-10 p-b-10">
				<view class="col-xs-1 flex-align-center">
					<image :src="'/static/images/cart-check'+(item.checked==1?'-ac':'')+'.png'" class="fr" @tap="checkedItem" :data-item-index="index" style="width:40rpx;height:40rpx;"></image>
				</view>
				<view class="col-xs-11 item-cart-box style2 p-l-0 p-r-10">
					<view class='layout sub85 clearfix'>
						<view class='col-main'>
							<view class='wrap'>
								<view class='title'>{{item.goods_name}}</view>
								<view class="spec">{{item.goods_specifition_name_value}}</view>
								<view class='flex-between'>
									<view class="price m-t-3">
										<text class="fs-12">￥</text>
										<text class="em">{{item.retail_price}}</text>
									</view>
									<view class="input-num-box min">
										<text class="minus" @tap="cutNumber" :data-item-index="index">-</text>
										<input class="number" disabled="true" name="nums" :value="item.number" type="number"/>
										<text class="plus ac" @tap="addNumber" :data-item-index="index">+</text>
									</view>
								</view>
							</view>
						</view>
						<view class='col-sub'>
							<image :src='item.list_pic_url' lazy-load="true" class="img bg-f5" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view style='height: 120rpx;'></view>
		<view class="checkout-footer">
			<view class="content">
				<view class="col-xs-3 box box1" style="justify-content:left;width:30%" @tap="checkedAll">
					<image :src="'/static/images/cart-check'+(checkedAllStatus?'-ac':'')+'.png'" style="width:40rpx;height:40rpx;"/>
					<view  class="fl fs-15 m-l-10" >
						全选({{cartTotal.checkedGoodsCount}})
					</view>
				</view>
				<view class="col-xs-6 box box1" style="width:40%" v-if="!isedit">
					<view class="tr pc-100">
						<view class="fs-15">合计：<text class="f-red">{{!isEditCart ? '￥'+cartTotal.checkedGoodsAmount : ''}}</text></text></view>
						<view class="fs-12 f-shallow m-t-5">不含运费</view>
					</view>
				</view>
				<view class="col-xs-3 box1" v-if="isedit" style="width:10%"></view>
				<view class="col-xs-3 box box2" v-if="!isedit" style="width:30%">
					<view class="btn btn-main" @click="checkoutOrder">去结算(<text>{{cartTotal.checkedGoodsCount}}</text>)</view>
				</view>
				<view class="col-xs-3 box box2" v-if="isedit" style="width:30%">
					<view class="btn btn-default">加入收藏夹</view>
				</view>
				<view class="col-xs-3 box box2" v-if="isedit" style="width:30%">
					<view class="btn btn-cmain" @click="doShowCancel">删除</view>
				</view>

			</view>
		</view>

		<!-- 弹窗 -->
		<view class="bg-black-o6 pf b0 l0 r0 t0 z9" v-if="isshowcancel" @click='doHideCancel'></view>
		<view class='modal-pop-box' v-if="isshowcancel">
			<image @click='doHideCancel' class='close' src='/static/images/pop-close-2.png'></image>
			<view class='content'>
				<view class="title">是否确定取消预订</view>
			</view>
			<view class="footer-box two">
				<view class="box box1 pc-50" @click='doHideCancel'>取消</view>
				<view class="box box2 pc-50" @click='deleteCart'>确认</view>
			</view>
		</view>
		<!-- 弹窗 -->

	</view>
</template>

<script>
var util = require("../../utils/util.js");
var api = require("../../config/api.js");

export default {
  data() {
    return {
      cartGoods: [],
      cartTotal: {
        "goodsCount": 0,
        "goodsAmount": 0.00,
        "checkedGoodsCount": 0,
        "checkedGoodsAmount": 0.00
      },
      isEditCart: false,
      checkedAllStatus: true,
      editCartList: [],
	  isedit: false,
	  isshowcancel:false,
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {},

  onShow() {
    this.getCartList();
  },

  methods: {
        onEdit(){
			this.isedit = !this.isedit;
			},
		doShowCancel(){
				this.isshowcancel = true;
			},
		doHideCancel(){
				this.isshowcancel = false;
			},
		onCheckOut(){
				uni.navigateTo({
					url:'/pages/checkout/checkout'
				})
			},
    getCartList: function () {
      let that = this;
      util.request(api.CartList).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    },
    isCheckedAll: function () {
      //判断购物车商品已全选
      return this.cartGoods.every(function (element, index, array) {
        if (element.checked == true) {
          return true;
        } else {
          return false;
        }
      });
    },
    checkedItem: function (event) {
      let itemIndex = event.target.dataset.itemIndex;
      let that = this;

      if (!this.isEditCart) {
        util.request(api.CartChecked, {
          productIds: that.cartGoods[itemIndex].product_id,
          isChecked: that.cartGoods[itemIndex].checked ? 0 : 1
        }, 'POST').then(function (res) {
          if (res.errno === 0) {
            that.setData({
              cartGoods: res.data.cartList,
              cartTotal: res.data.cartTotal
            });
          }

          that.setData({
            checkedAllStatus: that.isCheckedAll()
          });
        });
      } else {
        //编辑状态
        let tmpCartData = this.cartGoods.map(function (element, index, array) {
          if (index == itemIndex) {
            element.checked = !element.checked;
          }

          return element;
        });
        that.setData({
          cartGoods: tmpCartData,
          checkedAllStatus: that.isCheckedAll(),
          'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
        });
      }
    },
    getCheckedGoodsCount: function () {
      let checkedGoodsCount = 0;
      this.cartGoods.forEach(function (v) {
        if (v.checked === true) {
          checkedGoodsCount += v.number;
        }
      });
      return checkedGoodsCount;
    },
    checkedAll: function () {
      let that = this;

      if (!this.isEditCart) {
        var productIds = this.cartGoods.map(function (v) {
          return v.product_id;
        });
        util.request(api.CartChecked, {
          productIds: productIds.join(','),
          isChecked: that.isCheckedAll() ? 0 : 1
        }, 'POST').then(function (res) {
          if (res.errno === 0) {
            that.setData({
              cartGoods: res.data.cartList,
              cartTotal: res.data.cartTotal
            });
          }

          that.setData({
            checkedAllStatus: that.isCheckedAll()
          });
        });
      } else {
        //编辑状态
        let checkedAllStatus = that.isCheckedAll();
        let tmpCartData = this.cartGoods.map(function (v) {
          v.checked = !checkedAllStatus;
          return v;
        });
        that.setData({
          cartGoods: tmpCartData,
          checkedAllStatus: that.isCheckedAll(),
          'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
        });
      }
    },
    editCart: function () {
      var that = this;

      if (this.isEditCart) {
        this.getCartList();
        this.setData({
          isEditCart: !this.isEditCart
        });
      } else {
        //编辑状态
        let tmpCartList = this.cartGoods.map(function (v) {
          v.checked = false;
          return v;
        });
        this.setData({
          editCartList: this.cartGoods,
          cartGoods: tmpCartList,
          isEditCart: !this.isEditCart,
          checkedAllStatus: that.isCheckedAll(),
          'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
        });
      }
    },
    toIndexPage: function () {
      wx.switchTab({
        url: "/pages/index/index"
      });
    },
    updateCart: function (productId, goodsId, number, id) {
      let that = this;
      util.request(api.CartUpdate, {
        productId: productId,
        goodsId: goodsId,
        number: number,
        id: id
      }, 'POST').then(function (res) {
        if (res.errno === 0) {
          console.log(res.data);
          that.setData({});
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    },
    cutNumber: function (event) {
      let itemIndex = event.target.dataset.itemIndex;
      let cartItem = this.cartGoods[itemIndex];
	  console.log('___+++='+cartItem);
      let number = cartItem.number - 1 > 1 ? cartItem.number - 1 : 1;
      cartItem.number = number;
      this.setData({
        cartGoods: this.cartGoods
      });
      this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
    },
    addNumber: function (event) {
      let itemIndex = event.target.dataset.itemIndex;
      let cartItem = this.cartGoods[itemIndex];
	  console.log('___+++='+cartItem);
      let number = cartItem.number + 1;
      cartItem.number = number;
      this.setData({
        cartGoods: this.cartGoods
      });
      this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
    },
    checkoutOrder: function () {
      //获取已选择的商品
      let that = this;
      var checkedGoods = this.cartGoods.filter(function (element, index, array) {
        if (element.checked == true) {
          return true;
        } else {
          return false;
        }
      });

      console.log('购物车===='+checkedGoods);
	  //校验库存
	  /* for(let i=0;i<checkedGoods.length;i++){
		  console.log(checkedGoods[i]);
		  util.request(api.CartProductChecked, {
		    productId: checkedGoods[i].product_id
		  }).then(function (res) {
		    if (res.errno === 0) {
		      console.log(res.data);
		  	
		  		if(res.data.goods_number >checkedGoods[i].number){
		  			return true;
		  		}
		    }else{
				wx.showToast({
				  title: '库存不够'
				});
				return false;
			}
		  });
	  }; */
	  
      if (checkedGoods.length <= 0) {
        return false;
      }

      wx.navigateTo({
        url: '../shopping/checkout/checkout'
      });
    },
	
    deleteCart: function () {
      //获取已选择的商品
      let that = this;
      let productIds = this.cartGoods.filter(function (element, index, array) {
        if (element.checked == true) {
          return true;
        } else {
          return false;
        }
      });

      if (productIds.length <= 0) {
        return false;
      }

      productIds = productIds.map(function (element, index, array) {
        if (element.checked == true) {
          return element.product_id;
        }
      });
      util.request(api.CartDelete, {
        productIds: productIds.join(',')
      }, 'POST').then(function (res) {
        if (res.errno === 0) {
          // console.log(res.data);
          let cartList = res.data.cartList.map(v => {
            console.log(v);
            v.checked = false;
            return v;
          });
          that.setData({
            cartGoods: cartList,
            cartTotal: res.data.cartTotal,
			isshowcancel: false
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
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
@import "../../static/css/main.css";
page{background:#f5f5f5;}
</style>