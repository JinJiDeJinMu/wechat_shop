<template>
<view class="container">
  <view class="no-cart" v-if="cartGoods.length <= 0">
    <view class="c">
      <view class="title-box">
        购物车空空如也～
      </view>
      <view class="to-index-btn" @tap="toIndexPage">
        去逛逛
      </view>
    </view>
  </view>
  <view class="cart-view" v-if="cartGoods.length > 0">
    <view class="list">
      <view class="group-item">
        <view class="goods">
          <view :class="'item ' + (isEditCart ? 'edit' : '')" v-for="(item, index) in cartGoods" :key="index">
            <view :class="'checkbox ' + (item.checked ? 'checked' : '')" @tap="checkedItem" :data-item-index="index"></view>
            <view class="cart-goods">
              <image mode="aspectFit" class="img" :src="item.list_pic_url"></image>
              <view class="info">
                <view class="t">
                  <view class="name">{{item.goods_name}}</view>
                  <view class="num">x{{item.number}}</view>
                </view>
                <view class="attr">{{ isEditCart ? '已选择:' : ''}}{{item.goods_specifition_name_value||''}}</view>
                <view class="b">
                  <text class="price">￥{{item.retail_price}}</text>
                  <view class="selnum">
                    <view class="cut" @tap="cutNumber" :data-item-index="index">-</view>
                    <input :value="item.number" class="number" disabled="true" type="number"></input>
                    <view class="add" @tap="addNumber" :data-item-index="index">+</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="cart-bottom">
      <view :class="'checkbox ' + (checkedAllStatus ? 'checked' : '')" @tap="checkedAll">全选({{cartTotal.checkedGoodsCount}})</view>
      <view class="total">{{!isEditCart ? '￥'+cartTotal.checkedGoodsAmount : ''}}</view>
      <view class="delete" @tap="editCart">{{!isEditCart ? '编辑' : '完成'}}</view>
      <view class="checkout" @tap="deleteCart" v-if="isEditCart">删除所选</view>
      <view class="checkout" @tap="checkoutOrder" v-if="!isEditCart">下单</view>
    </view>
  </view>
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
      editCartList: []
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {},

  onShow() {
    this.getCartList();
  },

  methods: {
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
            cartTotal: res.data.cartTotal
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
@import "./cart.css";
</style>