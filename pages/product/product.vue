<template>
<view>
<scroll-view class="container" :style="'height: ' + winHeight + 'rpx'" scroll-y="true" :scroll-top="scrollTop" @scroll="scrollDa">
  <view v-if="!openAttr"> 
    <swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
      <swiper-item v-for="(item, index) in gallery" :key="index">
        <image :src="item.img_url" background-size="cover"></image>
      </swiper-item>
    </swiper> 
    <view class="f_home" @tap="goUrl"><image class="icon_home" src="../../static/images/icon_home.png"></image></view>
    <view class="goods-info">
      <view class="c">
        <view class="tx price">
           <text class="pri dzprice">￥{{goods.retail_price || '0.00'}}</text>
           <text class="pri yjprice" v-if="goods.market_price">原价：￥{{goods.market_price}}</text>
        </view>
        <text class="tx name">{{goods.name || ''}}</text>
        <text class="tx desc">{{goods.goods_brief || ''}}</text> 
        <view class="brand" v-if="brand.name">
          <navigator :url="'../brandDetail/brandDetail?id=' + brand.brandId">
            <text>{{brand.name || ''}}</text>
          </navigator>
        </view>
      </view>
    </view>
    <view class="section-nav section-attr">
      <view class="l" @tap="callphone"> 
       <text class="icon">💁‍</text>
        <text>客服</text>
      </view> 
       <button class="r" @tap="goBuy">立即购买</button>
    </view>
    <view class="comments" v-if="comment.count > 0">
      <view class="h">
        <navigator :url="'../comment/comment?valueId=' + goods.id + '&typeId=0'">
          <text class="t">评价({{comment.count > 999 ? '999+' : comment.count}})</text>
          <text class="i">查看全部</text>
        </navigator>
      </view>
      <view class="b">
        <view class="item">
          <view class="info">
            <view class="user">
              <image :src="comment.data.avatar"></image>
              <text>{{comment.data.nickname}}</text>
            </view>
            <view class="time">{{comment.data.add_time}}</view>
          </view>
          <view class="content">
            {{comment.data.content}}
          </view>
          <view class="imgs" v-if="comment.data.pic_list.length > 0">
            <image class="img" v-for="(item, index) in comment.data.pic_list" :key="index" :src="item.pic_url"></image>
          </view> 
        </view>
      </view>
    </view>
    <view class="goods-attr">
      <view class="t">商品详情</view>
      <view class="l">
        <view class="item" v-for="(item, index) in attribute" :key="index">
          <text class="left">{{item.name}}</text>
          <text class="right">{{item.value}}</text>
        </view>
      </view>
    </view>

    <view class="detail">
      
      <u-parse :content="article_goodsDetail"></u-parse>
    </view>
  </view>
  <!-- 商品规格 -->
  <view class="attr-pop"> 
    <view class="spec-con">
      <view class="spec-item" v-for="(item, index) in specificationList" :key="index">
        <view class="name">{{item.name}}<text class="hdx">*</text></view>
        <view class="values">
          <view :class="'value ' + (vitem.checked ? 'selected' : '')" @tap="clickSkuValue" v-for="(vitem, index2) in item.valueList" :key="index2" :data-value-id="vitem.id" :data-name-id="vitem.specification_id">{{vitem.value}}</view>
        </view>
      </view>
      <view class="number-item" id="every">
          <view class="name">数量<text class="hdx">*</text></view>
          <view class="selnum">
            <view class="cut" @tap="cutNumber">-</view>
            <input :value="number" class="number" disabled="true" type="number"></input>
            <view class="add" @tap="addNumber">+</view>
          </view>
      </view>
    </view>
  </view>
  <!-- 邮寄地址 -->
  <view class="add-address">
    <!-- <view class="ntit">邮寄地址</view> -->
    <view class="add-form">
        <view class="form-item">
            <label><text class="hdx">*</text>姓名</label>
            <input class="input" @input="bindinputName" placeholder="姓名" :value="address.userName"></input>
        </view>
        <view class="form-item">
            <label><text class="hdx">*</text>联系方式</label>
            <input class="input" @input="bindinputMobile" :value="address.telNumber" maxlength="15" type="number" placeholder="联系方式"></input>
        </view>
        <view class="form-item">
            <label><text class="hdx">*</text>送至</label>
            <input class="input" :value="address.full_region" disabled="true" @tap="chooseRegion" placeholder="省份、城市、区县"></input>
            <image class="seladress" src="../../static/images/xsmune.png" @tap="alertView"></image>
        </view>
        <view class="form-item">
            <label></label>
            <input class="input" @input="bindinputAddress" :value="address.detailInfo" placeholder="详细地址, 如街道、楼盘号等"></input>
        </view> 
    </view> 
    <view class="region-select" v-if="openSelectRegion">
      <view class="hd">
        <view class="region-selected">
          <view :class="'item ' + (item.id == 0 ? 'disabled' : '') + ' ' + ((regionType -1) === index ? 'selected' : '')" @tap="selectRegionType" :data-region-type-index="index" v-for="(item, index) in selectRegionList" :key="index">{{item.name}}</view>
        </view>
        <view :class="'done ' + (selectRegionDone ? '' : 'disabled')" @tap="doneSelectRegion">确定</view>
      </view>
      <scroll-view scroll-y class="bd">
        <view class="region-list">
          <view :class="'item ' + (item.selected ? 'selected' : '')" @tap="selectRegion" :data-region-index="index" v-for="(item, index) in regionList" :key="index">{{item.name}}</view>
        </view>
      </scroll-view>
    </view>
</view>
<view class="proMoney"><label>商品金额</label><text>￥{{checkedSpecPrice*number?checkedSpecPrice*number:goods.retail_price*number}}</text></view>
<view class="proMoney"><label>运费</label><text>￥{{goods.extra_price || 0}}</text></view>
<view class="proMoney"><label>总计</label><text>￥{{checkedSpecPrice*number?checkedSpecPrice*number:goods.retail_price*number+goods.extra_price}}</text></view>
<view class="bottom-btn">
  <button class="r" @tap="buyGoods">立即提交订单</button>
</view>
<view class="comney">由霞光智睿（上海）提供技术服务</view> 
</scroll-view>
 <view class="section-nav posBtn" v-if="isbol">
      <view class="l" @tap="callphone"> 
       <text class="icon">💁‍</text>
        <!-- <image class="icon" src="../../static/images/ic_menu_choice_nor.png"></image> -->
        <text>客服</text>
      </view> 
       <button class="r" @tap="goBuy" style="margin-right:0;width:630rpx;">立即购买</button>
</view>
<!-- ----------地址列表------------ -->
<view class="adBox" v-if="adShow">
    <view class="address-list">
        <view class="addrTit">
            <text>地址列表</text><image class="addex" src="../../static/images/clear_input.png" @tap="closeView"></image>
        </view>
        <scroll-view class="scolView" scroll-y="true" v-if="addressList.length > 0">
          <view class="item" v-for="(item, index) in addressList" :key="index" @tap="seldata" :data-addressId="item.id">
              <view class="l">
                  <view class="name">{{item.userName}}</view>
                  <view class="default" v-if="item.is_default">默认</view>
              </view>
              <view class="c">
                  <view class="mobile">{{item.telNumber}}</view>
                  <view class="address">{{item.full_region+item.detailInfo}}</view>
              </view>
              <view class="r">
                  <image @tap.native.stop="deleteAddress" :data-address-id="item.id" class="del" src="../../static/images/del-address.png"></image>
              </view>
          </view>
        </scroll-view>
        <view class="empty-view" v-if="addressList.length <= 0">
      <image class="icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/noAddress-26d570cefa.png"></image>
      <text class="text">收货地址在哪里</text>
    </view>
    </view>
</view>
</view>
</template>

<script>

var util = require("../../utils/util.js");
var api = require("../../config/api.js");
var user = require("../../services/user.js");
var pay = require("../../services/pay.js");

export default {
  data() {
    return {
      scrollTop: 0,
      winHeight: "",
      clientHeight: "",
      marginTop: '',
      id: 0,
      userId: 0,
      goods: {},
      gallery: [],
      attribute: [],
      issueList: [],
      comment: [],
      brand: {},
      specificationList: [],
      productList: [],
      relatedGoods: [],
      cartGoodsCount: 0,
      userHasCollect: 0,
      number: 1,
      checkedSpecText: '请选择规格数量',
      checkedSpecPrice: 0,
      proId: 0,
      openAttr: false,
      noCollectImage: "/static/images/icon_collect.png",
      hasCollectImage: "/static/images/icon_collect_checked.png",
      collectBackImage: "/static/images/icon_collect.png",
      // ---------*****添加地址***---------
      address: {
        id: 0,
        province_id: 0,
        city_id: 0,
        district_id: 0,
        address: '',
        full_region: '',
        userName: '',
        telNumber: '',
        is_default: 0
      },
      addressId: 0,
      openSelectRegion: false,
      selectRegionList: [{
        id: 0,
        name: '省份',
        parent_id: 1,
        type: 1
      }, {
        id: 0,
        name: '城市',
        parent_id: 1,
        type: 2
      }, {
        id: 0,
        name: '区县',
        parent_id: 1,
        type: 3
      }],
      regionType: 1,
      regionList: [],
      selectRegionDone: false,
      isbol: false,
      addressList: [],
      addressId: 0,
      adShow: false,
      userInfo: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    if (options.id) {
      that.setData({
        id: options.id
      });
      that.getGoodsInfo();
      console.log('options.id', this.id);
    }

    if (options.userId) {
      wx.setStorageSync('userId', options.userId);
    }

    if (options.q) {
      const q = decodeURIComponent(options.q);
      that.setData({
        id: util.getQueryString(q, 'id')
      });
      wx.setStorageSync('userId', util.getQueryString(q, 'userId'));
    } //  高度自适应


    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
            clientWidth = res.windowWidth,
            rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc,
          clientHeight: clientHeight
        });
      }
    });
  },
  onReady: function () {// 页面渲染完成
  },
  onShow: function () {
    let token = wx.getStorageSync('token');

    if (!token) {
      wx.redirectTo({
        url: '../customer/zcuslist/zcuslist?id=' + this.id
      });
      return false;
    }

    this.getAddressList();
    this.getRegionList(1);
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    alertView() {
      this.setData({
        adShow: true
      });
    },

    closeView() {
      this.setData({
        adShow: false
      });
    },

    seldata(e) {
      this.setData({
        addressId: e.currentTarget.dataset.addressid,
        adShow: false
      });
      this.getAddressDetail();
    },

    deleteAddress(event) {
      let that = this;
      wx.showModal({
        title: '',
        content: '确定要删除地址？',
        success: function (res) {
          if (res.confirm) {
            let addressId = event.target.dataset.addressId;
            util.request(api.AddressDelete, {
              id: addressId
            }, 'POST').then(function (res) {
              if (res.errno === 0) {
                that.getAddressList();
              }
            });
            console.log('用户点击确定');
          }
        }
      });
      return false;
    },

    getAddressDetail() {
      let that = this;
      util.request(api.AddressDetail, {
        id: that.addressId
      }).then(function (res) {
        if (res.errno === 0) {
          if (res.data) {
            that.setData({
              address: res.data
            });
          }
        }
      });
    },

    getAddressList() {
      let that = this;
      util.request(api.AddressList).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            addressList: res.data
          });
        }
      });
    },

    getGoodsInfo: function () {
      let that = this;
      util.request(api.GoodsDetail, {
        id: that.id
      }).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            goods: res.data.info,
            gallery: res.data.gallery,
            attribute: res.data.attribute,
            issueList: res.data.issue,
            comment: res.data.comment,
            brand: res.data.brand,
            specificationList: res.data.specificationList,
            productList: res.data.productList,
            userHasCollect: res.data.userHasCollect
          });
          wx.setStorageSync('merchantId', res.data.info.merchantId); //设置默认值

          that.setDefSpecInfo(that.specificationList);

          if (res.data.userHasCollect == 1) {
            that.setData({
              'collectBackImage': that.hasCollectImage
            });
          } else {
            that.setData({
              'collectBackImage': that.noCollectImage
            });
          }

          //WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that, 5)
          setTimeout(() => {
            that.article_goodsDetail = res.data.info.goods_desc;
          }, 200);
          that.getGoodsRelated();
        }
      });
    },
    getGoodsRelated: function () {
      let that = this;
      util.request(api.GoodsRelated, {
        id: that.id
      }).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            relatedGoods: res.data.goodsList
          });
        }
      });
    },
    clickSkuValue: function (event) {
      let that = this;
      let specNameId = event.currentTarget.dataset.nameId;
      let specValueId = event.currentTarget.dataset.valueId; //判断是否可以点击
      //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环

      let _specificationList = this.specificationList;

      for (let i = 0; i < _specificationList.length; i++) {
        if (_specificationList[i].specification_id == specNameId) {
          for (let j = 0; j < _specificationList[i].valueList.length; j++) {
            if (_specificationList[i].valueList[j].id == specValueId) {
              //如果已经选中，则反选
              if (_specificationList[i].valueList[j].checked) {
                _specificationList[i].valueList[j].checked = false;
              } else {
                _specificationList[i].valueList[j].checked = true;
              }
            } else {
              _specificationList[i].valueList[j].checked = false;
            }
          }
        }
      }

      this.setData({
        'specificationList': _specificationList
      }); //重新计算spec改变后的信息

      this.changeSpecInfo(); //重新计算哪些值不可以点击
      // 新加

      var key = that.getCheckedSpecKey();

      for (var i = 0; i < that.productList.length; i++) {
        if (that.productList[i].goods_specification_ids == key) {
          that.setData({
            checkedSpecPrice: that.productList[i].retail_price,
            proId: that.productList[i].id
          });
        }
      }
    },
    //获取选中的规格信息
    getCheckedSpecValue: function () {
      let checkedValues = [];
      let _specificationList = this.specificationList;

      for (let i = 0; i < _specificationList.length; i++) {
        let _checkedObj = {
          nameId: _specificationList[i].specification_id,
          valueId: 0,
          valueText: ''
        };

        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].checked) {
            _checkedObj.valueId = _specificationList[i].valueList[j].id;
            _checkedObj.valueText = _specificationList[i].valueList[j].value;
          }
        }

        checkedValues.push(_checkedObj);
      }

      return checkedValues;
    },
    //判断规格是否选择完整
    isCheckedAllSpec: function () {
      return !this.getCheckedSpecValue().some(function (v) {
        if (v.valueId == 0) {
          return true;
        }
      });
    },
    getCheckedSpecKey: function () {
      let checkedValue = this.getCheckedSpecValue().map(function (v) {
        return v.valueId;
      });
      return checkedValue.join('_');
    },
    changeSpecInfo: function () {
      let checkedNameValue = this.getCheckedSpecValue(); //设置选择的信息

      let checkedValue = checkedNameValue.filter(function (v) {
        if (v.valueId != 0) {
          return true;
        } else {
          return false;
        }
      }).map(function (v) {
        return v.valueText;
      });

      if (checkedValue.length > 0) {
        this.setData({
          'checkedSpecText': checkedValue.join('　')
        });
      } else {
        this.setData({
          'checkedSpecText': '请选择规格数量'
        });
      }
    },
    getCheckedProductItem: function (key) {
      return this.productList.filter(function (v) {
        if (v.goods_specification_ids.indexOf(key)) {
          return true;
        } else {
          return false;
        }
      });
    },
    cartGoodsCount: function () {
      let that = this;
      util.request(api.CartGoodsCount).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            cartGoodsCount: res.data.cartTotal.goodsCount
          });
        }
      });
    },
    switchAttrPop: function () {
      if (this.openAttr == false) {
        this.setData({
          openAttr: !this.openAttr,
          collectBackImage: "/static/images/detail_back.png"
        });
      }
    },
    goUrl: function () {
      wx.switchTab({
        url: '/pages/index/index'
      });
    },
    closeAttrOrCollect: function () {
      let that = this;

      if (this.openAttr) {
        this.setData({
          openAttr: false
        });

        if (that.userHasCollect == 1) {
          that.setData({
            'collectBackImage': that.hasCollectImage
          });
        } else {
          that.setData({
            'collectBackImage': that.noCollectImage
          });
        }
      } else {
        //添加或是取消收藏
        util.request(api.CollectAddOrDelete, {
          typeId: 0,
          valueId: this.id
        }, "POST").then(function (res) {
          let _res = res;

          if (_res.errno == 0) {
            if (_res.data.type == 'add') {
              that.setData({
                'collectBackImage': that.hasCollectImage
              });
            } else {
              that.setData({
                'collectBackImage': that.noCollectImage
              });
            }
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }
        });
      }
    },
    openCartPage: function () {
      wx.switchTab({
        url: '/pages/cart/cart'
      });
    },
    scrollDa: function (e) {
      //创建节点选择器
      var query = wx.createSelectorQuery(); //选择id

      var that = this;
      query.select('#every').boundingClientRect(function (rect) {
        that.setData({
          marginTop: rect.top
        });
      }).exec();

      if (e.detail.scrollTop >= 528 & that.clientHeight <= that.marginTop) {
        that.setData({
          isbol: true
        });
      } else {
        that.setData({
          isbol: false
        });
      }
    },
    callphone: function () {
      wx.makePhoneCall({
        phoneNumber: '13174100428'
      });
    },
    goBuy: function () {
      var that = this;
      that.setData({
        scrollTop: 8000,
        marginTop: 123
      });
    },

    /**
     * 直接购买
     */
    buyGoods: function () {
      var that = this;
      wx.showLoading({
        title: '提交中'
      });
      wx.setStorageSync('isYJ', this.isYJ); //提示选择完整规格

      if (!this.isCheckedAllSpec()) {
        wx.showToast({
          title: '请选择完整规格'
        });
        return false;
      } //根据选中的规格，判断是否有对应的sku信息


      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());

      if (this.getCheckedSpecKey() != "") {
        if (!checkedProduct || checkedProduct.length <= 0) {
          //找不到对应的product信息，提示没有库存
          wx.showToast({
            title: '库存不足'
          });
          return false;
        }
      } else {
        if (that.goods.goods_number < this.number) {
          wx.showToast({
            title: '库存不足'
          });
          return false;
        }
      } // 直接购买商品


      util.request(api.BuyAdd, {
        goodsId: that.goods.id,
        number: that.number,
        productId: that.proId ? that.proId : that.productList[0].id,
        customers: that.idsList
      }, "POST").then(function (res) {
        wx.hideLoading();
        let _res = res;

        if (_res.errno == 0) {
          that.saveAddress();
        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.errmsg,
            mask: true
          });
        }
      });
    },
    cutNumber: function () {
      this.setData({
        number: this.number - 1 > 1 ? this.number - 1 : 1
      });
    },
    addNumber: function () {
      this.setData({
        number: this.number + 1
      });
    },
    setDefSpecInfo: function (specificationList) {
      //未考虑规格联动情况
      let that = this;
      if (!specificationList) return;

      for (let i = 0; i < specificationList.length; i++) {
        let specification = specificationList[i];
        let specNameId = specification.specification_id; //规格只有一个时自动选择规格

        if (specification.valueList && specification.valueList.length == 1) {
          let specValueId = specification.valueList[0].id;
          that.clickSkuValue({
            currentTarget: {
              dataset: {
                "nameId": specNameId,
                "valueId": specValueId
              }
            }
          });
        }
      }

      specificationList.map(function (item) {});
    },

    bindGetUserInfo(e) {
      let token = wx.getStorageSync('token');

      if (token) {
        this.buyGoods();
        return false;
      }

      if (e.detail.userInfo) {
        //用户按了允许授权按钮
        user.loginByWeixin(e.detail).then(res => {
          let userInfo = wx.getStorageSync('userInfo');
          this.setData({
            userInfo: userInfo.userInfo
          });
          getApp().globalData.userInfo = userInfo.userInfo;
          getApp().globalData.token = res.data.openid;
          this.buyGoods();
        }).catch(err => {
          console.log(err);
        });
      } else {
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告通知',
          content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: res => {
                  if (res.authSetting["scope.userInfo"]) {
                    ////如果用户重新同意了授权登录
                    user.loginByWeixin(e.detail).then(res => {
                      let userInfo = wx.getStorageSync('userInfo');
                      this.setData({
                        userInfo: userInfo.userInfo
                      });
                      getApp().globalData.userInfo = userInfo.userInfo;
                      getApp().globalData.token = res.data.openid;
                    }).catch(err => {
                      console.log(err);
                    });
                  }
                }
              });
            }
          }
        });
      }
    },

    // -----------------******地址******--------------
    bindinputMobile(event) {
      let address = this.address;
      address.telNumber = event.detail.value;
      this.setData({
        address: address
      });
    },

    bindinputName(event) {
      let address = this.address;
      address.userName = event.detail.value;
      this.setData({
        address: address
      });
    },

    bindinputAddress(event) {
      let address = this.address;
      address.detailInfo = event.detail.value;
      this.setData({
        address: address
      });
    },

    bindIsDefault() {
      let address = this.address;
      address.is_default = !address.is_default;
      this.setData({
        address: address
      });
    },

    setRegionDoneStatus() {
      let that = this;
      let doneStatus = that.selectRegionList.every(item => {
        return item.id != 0;
      });
      that.setData({
        selectRegionDone: doneStatus
      });
    },

    chooseRegion() {
      let that = this;
      this.setData({
        openSelectRegion: !this.openSelectRegion
      }); //设置区域选择数据

      let address = this.address;

      if (address.province_id > 0 && address.city_id > 0 && address.district_id > 0) {
        let selectRegionList = this.selectRegionList;
        selectRegionList[0].id = address.province_id;
        selectRegionList[0].name = address.province_name;
        selectRegionList[0].parent_id = 1;
        selectRegionList[1].id = address.city_id;
        selectRegionList[1].name = address.city_name;
        selectRegionList[1].parent_id = address.province_id;
        selectRegionList[2].id = address.district_id;
        selectRegionList[2].name = address.district_name;
        selectRegionList[2].parent_id = address.city_id;
        this.setData({
          selectRegionList: selectRegionList,
          regionType: 3
        });
        this.getRegionList(address.city_id);
      } else {
        this.setData({
          selectRegionList: [{
            id: 0,
            name: '省份',
            parent_id: 1,
            type: 1
          }, {
            id: 0,
            name: '城市',
            parent_id: 1,
            type: 2
          }, {
            id: 0,
            name: '区县',
            parent_id: 1,
            type: 3
          }],
          regionType: 1
        });
        this.getRegionList(1);
      }

      this.setRegionDoneStatus();
    },

    selectRegionType(event) {
      let that = this;
      let regionTypeIndex = event.target.dataset.regionTypeIndex;
      let selectRegionList = that.selectRegionList; //判断是否可点击

      if (regionTypeIndex + 1 == this.regionType || regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex - 1].id <= 0) {
        return false;
      }

      this.setData({
        regionType: regionTypeIndex + 1
      });
      let selectRegionItem = selectRegionList[regionTypeIndex];
      this.getRegionList(selectRegionItem.parent_id);
      this.setRegionDoneStatus();
    },

    selectRegion(event) {
      let that = this;
      let regionIndex = event.target.dataset.regionIndex;
      let regionItem = this.regionList[regionIndex];
      let regionType = regionItem.type;
      let selectRegionList = this.selectRegionList;
      selectRegionList[regionType - 1] = regionItem;

      if (regionType != 3) {
        this.setData({
          selectRegionList: selectRegionList,
          regionType: regionType + 1
        });
        this.getRegionList(regionItem.id);
      } else {
        this.setData({
          selectRegionList: selectRegionList
        });
      } //重置下级区域为空


      selectRegionList.map((item, index) => {
        if (index > regionType - 1) {
          item.id = 0;
          item.name = index == 1 ? '城市' : '区县';
          item.parent_id = 0;
        }

        return item;
      });
      this.setData({
        selectRegionList: selectRegionList
      });
      that.setData({
        regionList: that.regionList.map(item => {
          //标记已选择的
          if (that.regionType == item.type && that.selectRegionList[that.regionType - 1].id == item.id) {
            item.selected = true;
          } else {
            item.selected = false;
          }

          return item;
        })
      });
      this.setRegionDoneStatus();
    },

    doneSelectRegion() {
      if (this.selectRegionDone === false) {
        return false;
      }

      let address = this.address;
      let selectRegionList = this.selectRegionList;
      address.province_id = selectRegionList[0].id;
      address.city_id = selectRegionList[1].id;
      address.district_id = selectRegionList[2].id;
      address.province_name = selectRegionList[0].name;
      address.city_name = selectRegionList[1].name;
      address.district_name = selectRegionList[2].name;
      address.full_region = selectRegionList.map(item => {
        return item.name;
      }).join('');
      this.setData({
        address: address,
        openSelectRegion: false
      });
    },

    cancelSelectRegion() {
      this.setData({
        openSelectRegion: false,
        regionType: this.regionDoneStatus ? 3 : 1
      });
    },

    getRegionList(regionId) {
      let that = this;
      let regionType = that.regionType;
      util.request(api.RegionList, {
        parentId: regionId
      }).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            regionList: res.data.map(item => {
              //标记已选择的
              if (regionType == item.type && that.selectRegionList[regionType - 1].id == item.id) {
                item.selected = true;
              } else {
                item.selected = false;
              }

              return item;
            })
          });
        }
      });
    },

    saveAddress() {
      let address = this.address;

      if (address.userName == '') {
        util.showErrorToast('请输入姓名');
        return false;
      }

      if (address.telNumber == '') {
        util.showErrorToast('请输入手机号码');
        return false;
      }

      if (!util.validatePhone(address.telNumber)) {
        util.showErrorToast('请输入正确手机号码');
        return false;
      }

      if (address.district_id == 0) {
        util.showErrorToast('请输入省市区');
        return false;
      }

      if (address.detailInfo == '') {
        util.showErrorToast('请输入详细地址');
        return false;
      }

      let that = this;
      util.request(api.AddressSave, {
        id: address.id,
        userName: address.userName,
        telNumber: address.telNumber,
        province_id: address.province_id,
        city_id: address.city_id,
        district_id: address.district_id,
        is_default: address.is_default,
        provinceName: address.province_name,
        cityName: address.city_name,
        countyName: address.district_name,
        detailInfo: address.detailInfo
      }, 'POST').then(function (res) {
        if (res.errno === 0) {
          that.submitOrder(res.data.id);
        }
      });
    },

    submitOrder: function (addressId) {
      wx.showLoading({
        title: '提交中'
      });
      console.log("--=========:", wx.getStorageSync('userId'));
      util.request(api.OrderSubmit, {
        addressId: addressId,
        promoterId: wx.getStorageSync('userId') || 0,
        couponId: null,
        type: "buy"
      }, 'POST').then(res => {
        wx.hideLoading();

        if (res.errno === 0) {
          const orderId = res.data.orderInfo.id;
          pay.payOrder(parseInt(orderId)).then(res => {
            wx.navigateTo({
              url: '/pages/payResult/payResult?status=1&orderId=' + orderId
            });
          }).catch(res => {
            wx.navigateTo({
              url: '/pages/payResult/payResult?status=0&orderId=' + orderId
            });
          });
        } else {
          util.showErrorToast('下单失败');
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
@import "./product.css";
</style>