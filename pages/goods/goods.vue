<template>
<view>
<scroll-view class="container" :style="'height: ' + winHeight + 'rpx'" scroll-y="true">
  <view v-if="!openAttr">
    <view class="swiBox">
      <swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000" v-if="gallery.length==0">
        <swiper-item>
          <image mode="aspectFit" class="descimg" :src="goods.primary_pic_url||goods.list_pic_url" background-size="cover"></image>
        </swiper-item>
      </swiper>
   <swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000" v-if="gallery.length>0">
   <swiper-item v-for="(item, index) in gallery" :key="index">
   <image mode="aspectFit" class="descimg" :src="item.img_url" background-size="cover"></image>
   </swiper-item>
   </swiper>
    <view class="flotbox" v-if="type==2">
      <count-down-list ntype="1" :endTime="goods.end_time" @downEnd="aa"></count-down-list>
      </view>
    </view>
    <view class="djs" v-if="time">
      <text class="xs">限时抢购</text>
      <text class="js">{{time}}</text>
    </view>
    <view class="goods-info">
      <view class="c">
        <view class="tx price">
          <text class="pri dzprice">￥{{goods.retail_price}}</text>
		  <text class="pri yjprice">原价：￥{{type==1?goods.retail_price ||'0.00':goods.market_price || '0.00'}}</text>
          <view class="tuu"></view>
          <text class="xihuan">{{browse||0}}人喜欢 </text>
          <button open-type="share" class="icon_fx"></button>
        </view>
        <view class="tx tsbox">
          <text class="name">{{goods.name || ''}}</text>
        </view>
		<view class="tx tsbox" v-if="goods.deliveryPlace.length >0">
		  <text class="name">发货地：{{goods.deliveryPlace}}</text>
		</view>
        <text class="tx desc" v-if="goods.goods_brief">{{goods.goods_brief}}</text>
        <view class="brand" v-if="brand.name">
          <navigator :url="'../brandDetail/brandDetail?id=' + brand.id">
            <text>{{brand.name}}</text>
          </navigator>
        </view>
      </view>
    </view>
     <view class="section-nav section-attr" @tap="switchAttrPop">
      <view class="t">请选择规格数量</view>
      <image mode="aspectFit" class="i" src="../../static/images/address_right.png" background-size="cover"></image>
    </view>
    <view class="title" style="height: 120rpx;">
      <view class="haibao" style="float: left;" @tap="generateHaiBao">生成海报</view>
	  <view class="haibao" style="float: left;" @tap="telephoneCall" v-if="businessmsg.tel">客服{{kefucall}}</view>
	  <button class="qiang" style="float: left;" open-type="share">邀请好友一起抢</button>
    </view>
	<poster id="poster" hide-loading="false" preload="false" :config="posterConfig" @success="onPosterSuccess" @fail="onPosterFail">
	</poster>
    <view class="mmain">
 <!--   <view class="kefu">
        <view class="kefu1">
          <view class="kefus">
            <view class="haoyou">
              <view class="yuan" wx:for="{{fenxiang}}" wx:key="index">
                <image mode="aspectFit" src="{{item.avatar}}"></image>
              </view>
            </view>
            <button class="qiang" open-type="share">邀请好友一起抢</button>
          </view>
          <view class="kefux">
            <view class="kefu11"></view>
            <view class="kefu12">
              <view class="kefu122">客服</view>
              <view class="kefu123">哦is如果陪我玩破刃</view>
            </view>
            <view class="jia" bindtap="kefu">添加</view>
          </view>
        </view>
      </view> -->
      <navigator :url="'./comment/comment?id=' + idd" class="input">
        <view class="comment">
          <view class="comtit">
            <view>宝贝评价（{{count}}）</view>
            <view class="cha">查看全部</view>
            <view class="jiantou">></view>
          </view>
          <view class="name">
            <view class="commentsss">
              <view class="tx">
                <image mode="aspectFit" class="desctx" :src="tx.avatar"></image>
				<i-cell-group>
				  <i-cell>
				    <i-rate :value="item.starLevel"></i-rate>
				  </i-cell>
				</i-cell-group>
              </view>
              <view class="name1">{{tx.nickname}}</view>
              <view class="timee">{{createTime}}</view>
            </view>
          </view>
          <view class="neirong">{{ content}}</view>
        </view>
      </navigator>
	  
      <!-- <view class="msg" v-if="businessmsg.shopName">
        <view class="newst">商家信息
          <view class="xian"></view>
        </view>
        <view class="ts">{{businessmsg.shopName}}</view>
        <view class="ts1">营业时间：{{businessmsg.openTime}}</view>
        <view class="ts2">商家电话：{{businessmsg.tel}}
          <view class="bnt" @tap="telephoneCall">拨打</view>
        </view>
        <view class="ts3">
          <view class="bntt">{{businessmsg.shopAddress||''}}</view>
          <view class="bnt" @tap="daohangRoad" v-if="businessmsg.shopAddress">导航</view>
        </view>
      </view> -->
    </view>
	
    <view class="groupBox" v-if="type==1&newBuyLis.length>0">
      <swiper style="height:360rpx" class="ptlist" autoplay="true" vertical="true" interval="3000" duration="1000">
        <swiper-item v-for="(item, index) in newBuyLis" :key="index">
          <view class="swili">
            <view class="proli" v-for="(iitem, index2) in item" :key="index2">
            <view class="left">
            <image mode="aspectFit" :src="iitem.groupBuyingDetailedList[0].userImg"></image>
            <label>{{iitem.groupBuyingDetailedList[0].userName}}</label>
            </view>
            <view class="right">
            <view class="info">
            <label>还差{{iitem.successNum-iitem.groupNum}}人拼团</label>
            <count-down-list :endTime="iitem.endTime" @downEnd="backfun"></count-down-list>
            </view>
            <view class="gopt">
              <button :data-items="iitem" @tap="openPartFun">去拼团</button>
            </view>
            </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
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
              <image mode="aspectFit" :src="comment.data.avatar"></image>
              <text>{{comment.data.nickname}}</text>
			  <i-cell-group>
			    <i-cell>
			      <i-rate :value="starLevel"></i-rate>
			    </i-cell>
			  </i-cell-group>
            </view>
            <view class="time">{{comment.data.add_time}}</view>
          </view>
          <view class="content">
            {{comment.data.content}}
          </view>
          <view class="imgs" v-if="comment.data.pic_list.length > 0">
            <image mode="aspectFit" class="img" v-for="(item, index) in comment.data.pic_list" :key="index" :src="item.pic_url"></image>
          </view>
        </view>
      </view>
    </view>
	
    <view class="goods-attr">
      <view class="l">
        <view class="item" v-for="(item, index) in attribute" :key="index">
          <text class="left">{{item.name}}</text>
          <text class="right">{{item.value}}</text>
        </view>
      </view>
    </view>
	
    <view class="detail" v-if="article_goodsDetail">
	<u-parse :content="article_goodsDetail" @preview="preview" @navigate="navigate" ></u-parse>
	</view>
	
    <view class="common-problem" v-if="issueList.length>0">
      <view class="h">
        <view class="line"></view>
        <text class="title">常见问题</text>
      </view>
      <view class="b">
        <view class="item" v-for="(item, index) in issueList" :key="index">
          <view class="question-box">
            <text class="spot"></text>
            <text class="question">{{item.question}}</text>
          </view>
          <view class="answer">
            {{item.answer}}
          </view>
        </view>
      </view>
    </view>

    <view class="related-goods" v-if="relatedGoods.length > 0">
      <view class="h">
        <view class="line"></view>
        <text class="title">为您推荐</text>
      </view>
      <view class="b">
      <view class="item" v-for="(item, index) in relatedGoods" :key="index">
      <navigator :url="'/pages/goods/goods?id=' + item.id">
      <image mode="aspectFit" class="img" :src="item.list_pic_url||item.primary_pic_url" background-size="cover"></image>
      <text class="name">{{item.name}}</text>
      <view class="pricen">
      <text class="pri dzpricen">￥{{item.retail_price}}</text>
      <text class="pri yjpricen" v-if="item.market_price">￥{{item.market_price}}</text>
      </view>
      </navigator>
      </view>
      </view>
    </view>
  </view>

  <view v-if="openAttr" class="attr-pop">
    <view class="img-info">
      <image mode="aspectFit" class="img" :src="(proImg?proImg:(goods.list_pic_url||goods.primary_pic_url))"></image>
      <view class="info">
        <view class="c">
          <view class="p">价格：￥{{checkedSpecPrice?checkedSpecPrice:goods.retail_price}}</view>
          <view class="a" v-if="productList.length>0">已选择：{{checkedSpecText}}</view>
        </view>
      </view>
    </view>
    <view class="spec-con">
      <view class="spec-item" v-for="(item, index) in specificationList" :key="index">
        <view class="name">{{item.name}}</view>
        <view class="values">
         <view :class="'value ' + (vitem.checked ? 'selected' : '') + ' ' + (vitem.state ? 'attr_value_disabled' : '')" @tap="clickSkuValue" v-for="(vitem, index2) in item.valueList" :key="index2" :data-value-id="vitem.id" :data-picurl="vitem.pic_url" :data-state="true" :data-name-id="vitem.specification_id">{{vitem.value}}</view>
		</view>
      </view>
      <view class="number-item">
        <view class="name">数量</view>
        <view class="selnum">
          <view class="cut" @tap="cutNumber">-</view>
          <input :value="number" class="number" disabled="true" type="number" />
          <view class="add" @tap="addNumber">+</view>
        </view>	
      </view>
    </view>
    <view class="add-address" v-if="is_secKill==5">
      <view class="add-form">
        <view class="form-item">
          <input class="input" @input="bindinputName" placeholder="姓名" :value="address.userName" auto-focus />
        </view>
        <view class="form-item">
          <input class="input" @input="bindinputMobile" :value="address.telNumber" maxlength="15" type="number" placeholder="手机号码"></input>
        </view>
        <view class="form-item">
          <input class="input" @input="bindinputAddress" :value="address.detailInfo" placeholder="收货地址"></input>
        </view>
        <view class="form-item">
          <input class="input" @input="bindinputRemark" :value="address.remark" placeholder="备注"></input>
        </view>
		<view class="form-item">
		  <input class="input" @input="bindinputgetGoodsAddress" :value="address.getGoodsAddress" placeholder="取件地址"></input>
		</view>
		<view class="form-item">
		  <input class="input" @input="bindinputgetGoodsexpress" :value="address.getGoodsexpress" placeholder="取件快递"></input>
		</view>
        <view class="form-item">
          <input class="input" @input="bindinputexpressNo" :value="address.expressNo" placeholder="取件号"></input>
        </view>
        <view class="form-item">
          <input class="input" @input="bindinputpressTime" :value="address.pressTime" placeholder="配送时间格式2020-10-10"></input>
        </view>
      </view>
    </view>
  </view>
  
  <!-- 优惠卷
  <view class="coupon" v-if="openCoupon" @tap="colseCoupon">
    <scroll-view class="couponBox" scroll-y="true">
      <view class="tit">领取优惠卷</view>
      <view class="couponInfo">
        <view class="conLi" v-for="(item, index) in merCoupon" :key="index" @tap.native.stop="takeCoupon">
          <view class="left">
            <text class="price">¥{{item.type_money}}</text>
            <text>订单满¥{{item.min_goods_amount}}使用</text>
            <text>使用时间：{{item.send_start_date}}～{{item.send_end_date}}</text>
          </view>
          <view class="right">
            <text :data-couponId="item.id">立即领取</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
  
  <!-- 更多团购 -->
  <view class="groupTeam" v-if="openGroup" @tap="colseGroup">
    <view class="groupInfo">
      <view class="tit">正在拼团</view>
      <scroll-view class="groupInfo_n" scroll-y="true">
        <view class="proli" v-for="(item, index) in groupBuyList" :key="index">
          <view class="left">
            <image mode="aspectFit" :src="item.groupBuyingDetailedList[0].userImg"></image>
            <label>{{item.groupBuyingDetailedList[0].userName}}</label>
          </view>
          <view class="right">
            <view class="info">
            <label>还差{{item.successNum-item.groupNum}}人拼团</label>
            <count-down-list :endTime="item.endTime" @downEnd="backfun"></count-down-list>
            </view>
            <view class="gopt">
            <button :data-items="item" @tap="openPartFun">去拼团</button>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
  <!-- 参团的人 -->
  <view class="partIn" v-if="openPart" @tap="colsePart">
    <view class="partInfo">
      <label>参与{{newGroup.groupBuyingDetailedList[0].userName}}的拼单</label>
      <view class="a">仅剩{{newGroup.successNum-newGroup.groupNum}}个名额，
        <count-down-list ntype="2" :endTime="newGroup.endTime" @downEnd="backfun"></count-down-list>
      </view>
      <view class="b">
        <view class="img" v-for="(item, index) in newGroup.groupBuyingDetailedList" :key="index">
          <label v-if="index==0">团长</label>
          <image mode="aspectFit" :src="item.userImg"></image>
        </view>
        <text class="n" v-for="(item, index) in newGroup.successNum-newGroup.groupNum" :key="index">?</text>
      </view>
      <button class="c" @tap="cimPartFun">参与拼团</button>
    </view>
  </view>
</scroll-view>
<view class="bottom-btn" v-if="cimPart">
  <view class="l l-collect homeBox" @tap="goUrl">
	  <navigator url="/pages/index/index">
    <image mode="aspectFit" class="icon" src="../../static/images/ic_menu_choice_nor.png"></image>
	 <text>首页</text>
	</navigator>
  </view>
  <view :class="'l l-collect ' + ( openAttr ? 'back' : '')" @tap="closeAttrOrCollect">
    <image mode="aspectFit" class="icon" :src="collectBackImage"></image>
  </view>
  <view class="l l-cart" v-if="type!=1&type!=2">
    <view class="box">
      <text class="cart-count">{{cartGoodsCount}}</text>
      <image mode="aspectFit" @tap="openCartPage" class="icon" src="../../static/images/ic_menu_shoping_nor.png"></image>
    </view>
  </view>
  <button :class="(type==2?'r':'c')" data-ntype="2" v-if="type==0 || type==2" :disabled="isY" @tap="buyGoods">{{type==2?'立即秒杀':'立即购买'}}</button>
  <button class="c" data-activitytype="1" :disabled="isY" v-if="type==1" @tap="buyGoods">单独购买¥{{yprice || goods.retail_price}}</button>
  <button class="r" v-if="type==0&&is_secKill!=5" @tap="addToCart">加入购物车</button>
  <button class="r" data-activitytype="2" :data-groupBuyingId="groupBuyingId" data-ntype="1" v-if="type==1" @tap="buyGoods">发起拼团¥{{checkedSpecPrice || goods.group_price}}</button>
</view>
<view class="bottom-btn" v-else>
  <button class="r" data-activitytype="2" :data-groupBuyingId="groupBuyingId" data-ntype="1" @tap="buyGoods">确定</button>
</view>
</view>
</template>

<script>

var util = require("../../utils/util.js");
var api = require("../../config/api.js");
var user = require("../../services/user.js");
var moment = require("../../utils/moment.min.js");
import Poster from '../../wxcomponents/wxa-plugin-canvas/poster/poster';
import uParse from '../../wxcomponents/u-parse/u-parse.vue';
export default {
	 components: {
	    uParse
	  },
  data() {
    return {
      is_secKill: 0,
      winHeight: "",
      id: 0,
      userId: 0,
      goods: {},
      gallery: [],
      attribute: [],
      issueList: [],
      comment: [],
	  starLevel:'',
      brand: {},
	  article_goodsDetail:'',
      specificationList: [],
      productList: [],
      relatedGoods: [],
      groupBuyLis: [],
      newBuyLis: [],
      newGroup: {},
      cartGoodsCount: 0,
      userHasCollect: 0,
      number: 1,
      checkedSpecText: '请选择规格数量',
      checkedSpecPrice: 0,
      yprice: 0,
      proId: 0,
      proImg: '',
      openAttr: false,
      openCoupon: false,
      openGroup: false,
      openPart: false,
      cimPart: true,
      selectSkuName: '',
      noCollectImage: "/static/images/icon_collect.png",
      hasCollectImage: "/static/images/icon_collect_checked.png",
      collectBackImage: "/static/images/icon_collect.png",
      nowtime: 0,
      type: 0,
      ntype: '',
      groupprice: 0,
      groupNum: 0,
      groupBuyingId: '',
      idd: "",
      timer: {},
      time: '',
      businessmsg: {},
      fenxiang: [],
      tx: [],
      content: '',
      browse: 0,
      start_time: '',
      end_time: '',
      kefucall: '',
      commentTime: '',
      commit: [],
      address: {
        id: 0,
        province_id: 0,
        city_id: 0,
        district_id: 0,
        address: '',
        full_region: '',
        userName: '',
        telNumber: '',
        is_default: 0,
        expressNo: '',
        pressTime: '',
        remark: '',
        selectSkuName: '',
        goodsId: 0,
        number: 1,
        productId: 0,
        getGoodsexpress: '',
        getGoodsAddress: ''
      },
      addressId: 0,
      openSelectRegion: false,
      count: 0,
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
      isDisabled: false,
      posterConfig: "",
      show: false,
      createTime: "",
      userInfo: "",
      merCoupon: "",
      groupBuyList: ""
    };
  },
  props: {},
  onShareAppMessage: function () {
    this.addShareGoods();
    const share_obj = {
      title: this.goods.name,
      imageUrl: this.goods.list_pic_url,
      path: 'pages/goods/goods?id=' + this.id + '&userId=' + wx.getStorageSync('uId')
    };
    return share_obj;
  },
  onLoad: function (options) {
    console.log(options); // 页面初始化 options为页面跳转所带来的参数

    if (options.id) {
      this.setData({
        idd: options.id
      });
    } else {
      wx.redirectTo({
        url: 'pages/index/index'
      });
    }
	/* var that = this;
    that.getGoodsComment(); */
    
    let that = this;
	
    if (options.id) {
      that.setData({
        id: options.id
      });
    }

    if (options.type) {
      that.setData({
        type: options.type
      });
    }

    if (options.userId) {
      wx.setStorageSync('userId', options.userId);
      let referrerString = options.userId + '_goodsid' + options.id;
      wx.removeStorageSync('referrerId');
      wx.setStorageSync('referrerId', referrerString);
    }

    if (options.q) {
      const q = decodeURIComponent(options.q);
      that.setData({
        id: util.getQueryString(q, 'id')
      });
      wx.setStorageSync('userId', util.getQueryString(q, 'userId'));
      console.log('这里需要登录========='); //that.newLogin()
    } //  高度自适应


    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
            clientWidth = res.windowWidth,
            rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        that.setData({
          winHeight: calc
        });
      }
    });
	Poster.create(false);
	that.getGoodsInfo();
	that.getGoodsComment();
  },
  onShow: function () {
    this.cartGoodsCountFun();
  },
  onReady: function () {// 页面渲染完成
  },
  onHide: function () {
    // 页面隐藏
    clearInterval(this.timer);
  },
  onUnload: function () {
    // 页面关闭
    clearInterval(this.timer);
  },
  methods: {
	   preview(src, e) {
	        // do something
	      },
	      navigate(href, e) {
	        // do something
	      },
    bindinputexpressNo(event) {
      let address = this.address;
      address.expressNo = event.detail.value;
      this.setData({
        address: address
      });
    },

    bindinputgetGoodsAddress(event) {
      let address = this.address;
      address.getGoodsAddress = event.detail.value;
      this.setData({
        address: address
      });
    },

    bindinputgetGoodsexpress(event) {
      let address = this.address;
      address.getGoodsexpress = event.detail.value;
      this.setData({
        address: address
      });
    },

    bindinputpressTime(event) {
      let address = this.address;
      address.pressTime = event.detail.value;
      this.setData({
        address: address
      });
    },

    bindinputRemark(event) {
      let address = this.address;
      address.remark = event.detail.value;
      this.setData({
        address: address
      });
    },

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

    daohangRoad() {
      let that = this;

      if (that.businessmsg.shopAddress) {
        wx.getLocation({
          type: 'gcj02',
          //返回可以用于wx.openLocation的经纬度
          success: function (res) {
            var latitude = res.latitude;
            var longitude = res.longitude;
            wx.openLocation({
              latitude: latitude,
              longitude: longitude,
              name: that.businessmsg.shopAddress,
              scale: 28
            });
          }
        });
      }
    },

    generateHaiBao() {
      let that = this;
      let params = {};
      wx.showToast({
        title: '海报图片生成中',
        icon: 'loading',
        duration: 1000
      });
      util.request(api.getQRCode, {
        params: 'goodsid' + that.goods.id,
        page: 'pages/index/index'
      }).then(function (res) {
        if (res.errno === 0) {
          let userInfo = wx.getStorageSync('userInfo');
          let nickName = userInfo.userInfo.nickName || '未名严选';
          let imgUrl = userInfo.userInfo.avatarUrl; 

          params = {
            width: 750,
            height: 1334,
            backgroundColor: '#fff',
            debug: false,
            pixelRatio: 1,
            blocks: [{
              width: 690,
              height: 780,
              x: 30,
              y: 183,
              borderWidth: 2,
              borderColor: '#f0c2a0',
              borderRadius: 20
            }, {
              width: 634,
              height: 74,
              x: 59,
              y: 770,
              backgroundColor: '#fff',
              opacity: 0.5,
              zIndex: 100
            }],
            texts: [{
              x: 113,
              y: 61,
              baseLine: 'middle',
              text: nickName,
              fontSize: 32,
              color: '#8d8d8d'
            }, {
              x: 30,
              y: 113,
              baseLine: 'top',
              text: that.goods.name,
              fontSize: 38,
              color: '#080808'
            }, {
              x: 92,
              y: 810,
              fontSize: 38,
              baseLine: 'middle',
              text: '发现一个好物，推荐给你呀',
              width: 570,
              lineNum: 1,
              color: '#8d8d8d',
              zIndex: 200
            }, {
              x: 59,
              y: 895,
              baseLine: 'middle',
              text: [{
                text: '校园生活',
                fontSize: 28,
                color: '#ec1731'
              }, {
                text: '¥' + that.goods.retail_price,
                fontSize: 36,
                color: '#ec1731',
                marginLeft: 30
              }]
            }, {
              x: 522,
              y: 895,
              baseLine: 'middle',
              text: that.goods.browse + '人喜欢',
              fontSize: 28,
              color: '#929292'
            }, {
              x: 59,
              y: 945,
              baseLine: 'middle',
              text: [{
                text: '商家发货&售后',
                fontSize: 28,
                color: '#929292'
              }, {
                text: '七天退货',
                fontSize: 28,
                color: '#929292',
                marginLeft: 50
              }, {
                text: '运费险',
                fontSize: 28,
                color: '#929292',
                marginLeft: 50
              }]
            }, {
              x: 360,
              y: 1065,
              baseLine: 'top',
              text: '长按保存识别小程序码',
              fontSize: 38,
              color: '#080808'
            }, {
              x: 360,
              y: 1123,
              baseLine: 'top',
              text: '校园生态-精致生活服务',
              fontSize: 28,
              color: '#929292'
            }],
            images: [{
              width: 62,
              height: 62,
              x: 30,
              y: 30,
              borderRadius: 62,
              url: imgUrl
            }, {
              width: 634,
              height: 634,
              x: 59,
              y: 210,
              url: that.goods.primary_pic_url || that.goods.list_pic_url
            }, {
              width: 220,
              height: 220,
              x: 92,
              y: 1020,
              url: 'https://www.chundengtai.com/qrcode/' + res.data
            }]
          };
          that.setData({
            posterConfig: params
          }, () => {
            Poster.create(true); // 入参：true为抹掉重新生成
          });
        }
      });
    },

    onPosterSuccess(e) {
      const {
        detail
      } = e;
      wx.previewImage({
        current: detail,
        urls: [detail]
      });
      util.checkPermission('writePhotosAlbum', () => {
        wx.saveImageToPhotosAlbum({
          filePath: detail,

          success(res) {
            util.showModal('保存至相册', '图片成功保存至本地相册', false);
          }

        });
      }, '保存图片需要权限，请提供保存到相册的权限。');
    },

    onPosterFail(err) {
      console.error(err);
    },

    onClose() {
      this.setData({
        show: false
      });
    },

    telephoneCall() {
      if (this.businessmsg.tel) {
        let tel = this.businessmsg.mobile || this.businessmsg.tel;
        wx.makePhoneCall({
          phoneNumber: tel,
          success: res => {
            wx.setClipboardData({
              data: tel,

              success(res) {
                wx.getClipboardData({
                  success(res) {}

                });
              }

            });
          },
          fail: err => {}
        });
      }
    },

    makeTick() {
      var startTime = this.start_time; //取出活动开始时间

      var endTime = this.end_time; //取出活动结束时间

      var nowTime = new Date().valueOf(); //获取当前时间

      let date = '',
          timing = null;

      if (startTime > nowTime) {
        //开始时间大于当前时间活动没开始
        date = new Date(startTime);
        timing = 'wait';
      } else if (endTime < nowTime) {
        //当前时间大于活动结束时间
        //活动已结束
        return;
      } else {
        //当前时间大于等于活动开始时间小于等于活动结束时间活动正在进行
        // return;//如果需要活动正在进行中时候距离活动结束的倒计时，删除return 如果不需要活动结束的倒计时打开return
        date = new Date(endTime);
        timing = 'on';
      }

      let count = (date.valueOf() - new Date().valueOf()) / 1000;
      if (count <= 0) return;
      let timer = setInterval(() => {
        count--;

        if (count <= 0) {
          clearInterval(this.timer);
          this.setData({
            time: ''
          });
        }

        let s = Math.floor(count % 60);
        let m = Math.floor(count / 60 % 60);
        let h = Math.floor(count / 3600 % 24);
        let d = Math.floor(count / (3600 * 24));
        if (h < 10) h = '0' + h;
        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;
        let str = '';

        switch (timing) {
          case 'wait':
            str = `距离活动开始倒计时${d}天 ${h}时${m}分${s}秒`;
            break;

          case 'on':
            str = `距离活动结束倒计时${d}天 ${h}时${m}分${s}秒`;
            break;
        }

        this.setData({
          time: str
        });
      }, 1000);
      this.setData({
        timer: timer
      });
    },

    backfun: function (e) {
      if (e.success) {
        this.getGroupBuyList();
      }
    },
 
    colseCoupon: function () {
      this.setData({
        openCoupon: false
      });
    },
    openGroup1: function () {
      this.setData({
        openGroup: true
      });
      this.getCouponList();
    },
    colseGroup: function () {
      this.setData({
        openGroup: false
      });
    },
    cimPartFun: function () {
      if (this.openAttr == false) {
        //打开规格选择窗口
        this.setData({
          openAttr: !this.openAttr,
          collectBackImage: "/static/images/detail_back.png"
        });
      }

      this.setData({
        cimPart: false
      });
    },
    openPartFun: function (e) {
      var model = e.target.dataset.items;
      this.setData({
        newGroup: model,
        groupBuyingId: model.groupBuyingDetailedList[0].groupBuyingId,
        openPart: true
      });
    },
    colsePart: function () {
      this.setData({
        openPart: false
      });
    },
    getCouponList: function () {
      let that = this;
      util.request(api.CouponListByMer, {
        merchantId: that.goods.merchantId
      }, "POST").then(function (res) {
        if (res.errno === 0) {
          that.setData({
            merCoupon: res.data
          });
        }
      });
    },
    getGroupBuyList: function () {
      let that = this;
      util.request(api.GroupBuyList, {
        goodsId: that.id
      }, "POST").then(function (res) {
        if (res.errno === 0) {
          var items = res.data.groupBuyingEntityList;
          var arr = [];
          var num = Math.ceil(items.length / 2);

          for (var j = 0; j < num; j++) {
            var str = [];

            for (var i = 0; i < items.length; i++) {
              if (str.length < 2) {
                if (items[i + j * 2]) {
                  str.push(items[i + j * 2]);
                }
              }
            }

            arr.push(str);
          }

          that.setData({
            groupBuyList: res.data.groupBuyingEntityList,
            groupNum: res.data.groupNum,
            newBuyLis: arr
          });
        }
      });
    },
    addShareGoods: function () {
      let that = this;
      const param = {};
      param.goodsId = that.goods.id;
      param.name = that.goods.name;
      param.goodsBrief = that.goods.goods_brief || '';
      param.retailPrice = that.goods.retail_price;
      param.marketPrice = that.goods.market_price;
      param.primaryPicUrl = that.goods.primary_pic_url;
      util.request(api.InsShareGoods, param, "POST", 'application/x-www-form-urlencoded').then(function (res) {
        if (res.errno === 0) {
          console.log("------chenggong");
        }
      });
    },
    takeCoupon: function (e) {
      let that = this;
      util.request(api.TakeMerCoupon, {
        id: e.target.dataset.couponid
      }, "POST").then(function (res) {
        if (res.errno === 0) {
          wx.showToast({
            title: '领取成功',
            icon: 'none',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: res.errmsg,
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    getGoodsInfo: function () {
      let that = this;
      util.request(api.GoodsDetail, {
        id: that.id
      }).then(function (res) {
		  console.log(res.data);
        if (res.errno === 0) {
          that.setData({
            is_secKill: res.data.info.is_secKill,
            goods: res.data.info,
            browse: res.data.info.browse,
            gallery: res.data.gallery,
            attribute: res.data.attribute,
            //businessmsg: res.data.merchantInfo,
            specificationList: res.data.specificationList,
            productList: res.data.productList,
            userHasCollect: res.data.userHasCollect
          }); //设置默认值

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

          setTimeout(() => {
            that.article_goodsDetail = res.data.info.goods_desc;
          }, 500);
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
	getGoodsComment: function () {
		util.request(api.CommentList, {
		  goodId: that.idd
		}, "GET").then(function (res) {
		  console.log(res);
		  console.log(res.data.list);
		
		  if (res.data) {
		    that.setData({
		      commit: res.data.list
		    }); 
		
		    if (res.data.list[0] != null) {
		      that.setData({
		        content: res.data.list[0].content,
		        count: res.data.list.length,
				starLevel: res.data.list[0].starLevel,
		        tx: res.data.list[0].userInfo,
		        createTime:res.data.list[0].createTime,
		        userInfo: res.data.list[0].userInfo
		      });
		    }
		  } else {
		    that.setData({
		      content: '该商品暂无评论！'
		    });
		  }
		});
	},
    clickSkuValue: function (event) {
      let that = this;
      let specNameId = event.currentTarget.dataset.nameId;
      let specValueId = event.currentTarget.dataset.valueId + "";
      let state = event.currentTarget.dataset.state;
      const proImg = event.currentTarget.dataset.picurl; // 禁用则结束
     /* if (state) {
        return;
      } //判断是否可以点击
      //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环 */


      let _specificationList = this.specificationList;

      for (let i = 0; i < _specificationList.length; i++) {
        if (_specificationList[i].specification_id == specNameId) {
          for (let j = 0; j < _specificationList[i].valueList.length; j++) {
            if (_specificationList[i].valueList[j].id == specValueId) {
              //如果已经选中，则反选
              if (_specificationList[i].valueList[j].checked) {
                _specificationList[i].valueList[j].checked = false; // }

                if (_specificationList.length > 1) {
                  that.unSelectValue();
                }
              } else {
                _specificationList[i].valueList[j].checked = true;
				/* console.log(that.specNameId);
				console.log(_specificationList[i].valueList[j].value);
                that.setData(that.specNameId, _specificationList[i].valueList[j].value); */

                if (_specificationList.length > 1) {
                  that.selectValue(specValueId, specNameId);
                }
              }
            } else {
              _specificationList[i].valueList[j].checked = false;
            }
          }
        }
      }

      this.setData({
        'proImg': proImg,
        'specificationList': _specificationList
      }); //重新计算spec改变后的信息

      this.changeSpecInfo(); // 新加

      var key = that.getCheckedSpecKey();

      var array = key.split('_')
      console.log('key='+key);
      for (var i = 0; i < that.productList.length; i++) {
		  var result = that.productList[i].goods_specification_ids;
		  var array_temp = result.split("_")
        if (that.productList[i].goods_specification_ids == key) {
          that.setData({
            checkedSpecPrice: that.type == '1' ? that.productList[i].group_price : that.productList[i].retail_price,
            yprice: that.productList[i].retail_price,
            proId: that.productList[i].id
          });
        }
      }
    },
    //选中
    selectValue: function (id, specNameId) {
      let that = this;
      var newAttrIds = [];

      for (var i = 0; i < that.productList.length; i++) {
        var selArr = [];

        if (that.productList[i].goods_specification_ids.indexOf('_') > -1) {
          selArr = that.productList[i].goods_specification_ids.split('_');

          if (selArr.indexOf(id) > -1) {
            for (var j = 0; j < selArr.length; j++) {
              if (selArr[j] != id) {
                if (newAttrIds.indexOf(selArr[j]) <= -1) {
                  newAttrIds.push(selArr[j]);
                }
              }
            }
          }
        }
      }
      for (var z = 0; z < that.specificationList.length; z++) {
        for (var y = 0; y < that.specificationList[z].valueList.length; y++) {
          if (that.specificationList[z].specification_id != specNameId) {
            var nid = that.specificationList[z].valueList[y].id + "";

            if (newAttrIds.indexOf(nid) > -1) {
              that.specificationList[z].valueList[y].state = false;
            } else {
              that.specificationList[z].valueList[y].state = true;
            }
          }
        }
      }

      that.setData({
        'specificationList': that.specificationList
      });
    },
    //取消选择
    unSelectValue: function () {
      let that = this;
      var n = 0;

      for (var z = 0; z < that.specificationList.length; z++) {
        for (var y = 0; y < that.specificationList[z].valueList.length; y++) {
          if (that.specificationList[z].valueList[y].checked) {
            n += 1;
            that.selectValue(that.specificationList[z].valueList[y].id + "", that.specificationList[z].valueList[y].specification_id + "");
            break;
          }
        }
      }

      if (n == 0) {
        for (var m = 0; m < that.specificationList.length; m++) {
          for (var n = 0; n < that.specificationList[m].valueList.length; n++) {
            that.specificationList[m].valueList[n].state = false;
          }
        }

        that.setData({
          'specificationList': that.specificationList
        });
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
    //根据已选的值，计算其它值的状态
    setSpecValueStatus: function () {},
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
	  console.log('check='+checkedValue);
	  checkedValue = checkedValue.sort(function(a, b){return a - b}); 
	  console.log('checknew='+checkedValue);
	 
      return checkedValue.join('_');
    },
    changeSpecInfo: function () {
      let that = this;
      let checkedNameValue = that.getCheckedSpecValue();
      let checkedValue = checkedNameValue.filter(function (v) {
        if (v.valueId != 0) {
          return true;
        } else {
          return false;
        }
      }).map(function (v) {
        return v.valueText;
      });
	let checkedValueId = checkedNameValue.filter(function(v) {
	  if (v.valueId != 0) {
		return true;
	  } else {
		return false;
	  }
	}).map(function(v) {
	  return v.valueId;
	});
      if (checkedValue.length > 0) {
		this.spec_temp = checkedValueId.join('_')
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
      //console.log('---------00--------00----:', this.data.productList)
      return this.productList.filter(function (v) {
        if (v.goods_specification_ids = key) {
          return true;
        } else {
          return false;
        }
      });
    }, 
    cartGoodsCountFun: function () {
      let that = this;
      let token = wx.getStorageSync('token');

      if (token) {
        util.request(api.CartGoodsCount).then(function (res) {
          if (res.errno === 0) {
            that.setData({
              cartGoodsCount: res.data.cartTotal.goodsCount
            });
          }
        });
      } else {
        that.setData({
          cartGoodsCount: 0
        });
      }
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

    /**
     * 直接购买
     */
    buyGoods: function (e) {
      var that = this;
      var ntype = e.target.dataset.ntype || '';
      var activityType = e.target.dataset.activitytype || '';
      var groupBuyingId = e.target.dataset.groupbuyingid || '';
      that.setData({
        groupBuyingId: groupBuyingId
      });

      if (that.openAttr == false) {
        //打开规格选择窗口
        that.setData({
          openAttr: !that.openAttr,
          collectBackImage: "/static/images/detail_back.png"
        });
      } else {
        wx.showLoading({
          title: '提交中'
        });
        wx.setStorageSync('isYJ', that.isYJ); //提示选择完整规格

        if (!that.isCheckedAllSpec()) {
          wx.showToast({
            title: '请选择完整规格'
          });
          return false;
        } //根据选中的规格，判断是否有对应的sku信息
		
       //去掉规格中不包含的选项
        console.log('that.getCheckedSpecKey()='+that.getCheckedSpecKey())
		var key = that.getCheckedSpecKey();
		var str=[];
		for(let i =0;i<that.productList.length;i++){
			str.push(that.productList[i].goods_specification_ids)
		}
		if(str.indexOf(key)  < 0){
			wx.showToast({
				title: '库存不足'
			});
			return false;
		}
        //let checkedProduct = that.getCheckedProductItem(that.getCheckedSpecKey());
		//console.log('checkdproduct'+checkedProduct);
       

       /* if (that.getCheckedSpecKey() != "") {
			 if (!checkedProduct || checkedProduct.length <= 0) {
			   //找不到对应的product信息，提示没有库存
			   wx.showToast({
				 title: '库存不足'
			   });
			   return false;
			 }
		   } else {
			 if (that.goods.goods_number < that.number) {
			   wx.showToast({
				 title: '库存不足'
			   });
			   return false;
			 }
		   }
 */
        if (that.productList.length != 0) {
          that.productList;
        }

        let params = {};

        if (that.is_secKill == 5) {
          let address = that.address;

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

          if (address.detailInfo == '') {
            util.showErrorToast('请输入详细地址');
            return false;
          }

          if (address.expressNo == '') {
            util.showErrorToast('请输入快递单号');
            return false;
          }

          if (address.pressTime == '') {
            util.showErrorToast('请输入取快递时间');
            return false;
          }

          if (that.checkedSpecText) {
            address.selectSkuName = '快递代取';
          }

          address.goodsId = that.goods.id;
          address.number = that.number;
          address.productId = that.proId;
          that.setData(that.address, address);
          params = address;
        } else {
          let selectSkuName = '';

          if (that.checkedSpecText) {
            selectSkuName = that.checkedSpecText;
          }

          params = {
            selectSkuName: selectSkuName,
            goodsId: that.goods.id,
            number: that.number,
            productId: that.proId !=0? that.proId:that.productList[0].id
          };
        } // 直接购买商品

      /* if(that.proId <=0){
		  wx.showToast({
		  	 title: '库存不足'
		  });
		  return false;
	  } */
      console.log('parma'+params.productId);
        util.request(api.BuyAdd, params, "POST").then(function (res) {
          wx.hideLoading();
          let _res = res;

          if (_res.errno == 0) {
            that.setData({
              openAttr: !that.openAttr
            });
            wx.navigateTo({
              url: '/pages/shopping/checkout/checkout?isBuy=true&type=' + ntype + '&groupBuyingId=' + groupBuyingId + '&activityType=' + activityType
            });
          } else {
			 that.unSelectValue(); 
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }
        });
      }
    },

    /**
     * 添加到购物车
     */
    addToCart: function () {
      var that = this;

      if (that.openAttr == false) {
        //打开规格选择窗口
        that.setData({
          openAttr: !this.openAttr,
          collectBackImage: "/static/images/detail_back.png"
        });
      } else {
        wx.showLoading({
          title: '提交中'
        });
        wx.setStorageSync('isYJ', that.isYJ); //提示选择完整规格

        if (!this.isCheckedAllSpec()) {
          wx.showToast({
            title: '请选择完整规格'
          });
          return false;
        } //根据选中的规格，判断是否有对应的sku信息


        let checkedProduct = that.getCheckedProductItem(that.getCheckedSpecKey());

        if (that.getCheckedSpecKey() != "") {
          if (!checkedProduct || checkedProduct.length <= 0) {
            //找不到对应的product信息，提示没有库存
            wx.showToast({
              title: '库存不足'
            });
            return false;
          }
        } else {
          if (that.goods.goods_number < that.number) {
            wx.showToast({
              title: '库存不足'
            });
            return false;
          }
        } //添加到购物车


        util.request(api.CartAdd, {
          goodsId: that.goods.id,
          number: that.number,
          productId: that.proId ? that.proId : that.productList[0].id
        }, "POST").then(function (res) {
          wx.hideLoading();
          let _res = res;

          if (_res.errno == 0) {
            wx.showToast({
              title: '添加成功'
            });
            that.setData({
              openAttr: !that.openAttr,
              cartGoodsCount: _res.data.cartTotal.goodsCount
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
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }
        });
      }
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
	
    newLogin: function () {
      let that = this; //重新登陆

      const token = wx.getStorageSync('token');

      if (!token) {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function (res) {
                  //用户按了允许授权按钮
                  user.loginByWeixin(res).then(res => {
                    let userInfo = wx.getStorageSync('userInfo');
                    getApp().globalData.userInfo = userInfo.userInfo;
                    getApp().globalData.token = res.data.openid;
                    that.cartGoodsCountFun();
                  }).catch(err => {
                    console.log(err);
                  });
                }
              });
            } else {
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
                            that.cartGoodsCountFun();
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
          }

        });
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
@import "./goods.css";
@import url("../../wxcomponents/u-parse/u-parse.css");
</style>