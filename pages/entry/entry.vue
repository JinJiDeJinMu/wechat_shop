<template>
<!--pages/entry/entry.wxml-->
<view class="entry">
  <view class="entry-img">
    <image src="https://www.chundengtai.com/qrcode/bgc.png" class="bgc" mode="widthFix"></image>
  </view>
  <view class="en">
    <!-- 我们的优势 -->
    <view class="entry-con">
      <view class="entry-nei">
        <view class="entry-wo">我们的优势</view>
        <view class="con">
          <view class="con-left">
            <image src="../../static/images/yuan1.png"></image>
          </view>
          <view class="con-right">
            <view class="con-yi">01免费流量</view>
            <view class="haha">
              <view>
                <image src="../../static/images/start.jpg" class="start"></image>
              </view>
              <view class="con-mian">免费向南昌市30余所高校 40万大学生推荐你</view>
            </view>
          </view>
        </view>
        <!-- 第二条数据 -->
        <view class="con-two">
          <view class="contwo-left">
            <view class="contwo-yi">02内容优势</view>
            <view class="contwo-haha">
              <view>
                <image src="../../static/images/start.jpg" class="start"></image>
              </view>
              <view class="contwo-mian">专业内容制作团队，加强 与消费者互动消费
              </view>
            </view>

          </view>
          <view class="contwo-right">
            <image src="../../static/images/yuan2.jpg"></image>
          </view>
        </view>
        <!-- 第三条数据 -->
        <view class="con">
          <view class="con-left">
            <image src="../../static/images/yuan3.jpg"></image>
          </view>
          <view class="con-right">
            <view class="con-yi">03专业运营</view>
            <view class="haha">
              <view>
                <image src="../../static/images/start.jpg" class="start"></image>
              </view>
              <view class="con-mian">专业电商运营团队，多种营销方式刺激消费
              </view>
            </view>
          </view>
        </view>
        <!-- 第四条数据 -->
        <view class="con-four">
          <view class="contwo-left">
            <view class="contwo-yi">04技术支撑</view>
            <view class="contwo-haha">
              <view>
                <image src="../../static/images/start.jpg" class="start"></image>
              </view>
              <view class="contwo-mian">成熟的技术团队为您的交易保驾护航
              </view>
            </view>
          </view>
          <view class="contwo-right">
            <image src="../../static/images/yuan4.jpg"></image>
          </view>
        </view>
      </view>
    </view>
    <!--入驻条件  -->
    <view class="condition">
      <view class="condition-nei">
        <view class="condition-ru">入驻条件</view>
        <view class="condition-pin">
          <view>
            <image src="../../static/images/fang.png" class="pin-img"></image>
          </view>
          <view class="pin1">品牌形象的一致性，讲究“门当户对</view>
        </view>
        <view class="condition-pin2">
          <view>
            <image src="../../static/images/fang.png" class="pin-img"></image>
          </view>
          <view class="pin1">互惠互利原则，合作共赢</view>
        </view>
        <view class="condition-pin3">
          <view>
            <image src="../../static/images/fang.png" class="pin-img"></image>
          </view>
          <view class="pin1">诚实守信，遵循契约精神</view>
        </view>
      </view>
    </view>
    <!-- 商家入驻信息 -->
    <view class="entry-information">
      <view class="info-shang">商家入驻申请</view>
      <view class="infor-ma">麻烦您简单提供如下信息，我们会尽快和您联系。</view>
      <view class="xian"></view>
      <!-- 信息填写 -->
      <view>
        <view class="infor-tian">
          <view class="tian">
            <view class="tian-name">
              <text>姓名：</text>
              <text>*</text>
              <input data-key="name" type="text" class="input-name" @input="inputname"></input>
            </view>
          </view>
        </view>
        <!-- 电话-->
        <view class="infor-tian">
          <view class="tian">
            <view class="tian-name">
              <text>联系电话：</text>
              <text>*</text>
              <view>
                <view>
                  <image src="../../static/images/phone.png" class="phone-img"></image>
                  <view class="h-xian"></view>
                </view>
                <input type="number" data-key="phone" class="input-name1" maxlength="11" @input="inputname"></input>
              </view>
            </view>
          </view>
        </view>
        <!-- 店铺类型 -->
        <view class="infor-tian">
          <view class="tian">
            <view class="tian-name">
              <text>店铺类型：</text>
              <text>*</text>
              <input type="text" data-key="shoptype" class="input-name" @input="inputname"></input>
            </view>
          </view>
        </view>
        <!-- 店铺名称 -->
        <view class="infor-tian">
          <view class="tian">
            <view class="tian-name">
              <text>店铺名称：</text>
              <text>*</text>
              <input type="text" data-key="shopname" class="input-name" @input="inputname"></input>
            </view>
          </view>
        </view>
        <!-- 店铺地址 -->
        <view class="infor-tian">
          <view class="tian">
            <view class="tian-name">
              <text>店铺地址：</text>
              <text>*</text>
              <textarea class="input-di" data-key="address" name="content" @input="inputname"></textarea>
            </view>
          </view>
        </view>
      </view>
      <view class="confirm" @tap="submit">确认提交</view>
    </view>
  </view>
<!-- tabber页面 -->
  <view class="page-bottom">
    <navigator class="p-b-btn" url="/pages/index/index" open-type="switchTab">
      <!-- <text class="yticon icon-xiatubiao--copy"></text> -->
      <image src="../../static/images/ic_menu_choice_nor.png" class="yticon"></image>
      <text class="shou">首页</text>
    </navigator>
    <navigator class="p-b-btn" url="/pages/sort/sort" open-type="switchTab">
      <image src="../../static/images/ic_menu_sort_nor.png" class="yticon"></image>
      <text class="shou">分类</text>
    </navigator>
    <navigator class="p-b-btn" url="/pages/cart/cart" open-type="switchTab">
      <image src="../../static/images/ic_menu_shoping_nor.png" class="gou"></image>
      <text class="shou">购物车</text>
    </navigator>
    <navigator class="p-b-btn" url="/pages/ucenter/index/index" open-type="switchTab">
      <image src="../../static/images/ic_menu_me_nor.png" class="yticon"></image>
      <text class="shou">我的</text>
    </navigator>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      name: "",
      phone: "",
      shoptype: "",
      //店铺类型
      shopname: "",
      //店铺名称
      address: "" //店铺地址

    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
    // 姓名
    inputname(e) {
      var that = this;

      if (e.detail.value != "") {
        var x = e.currentTarget.dataset.key;

        if (x == "name") {
          that.setData({
            name: e.detail.value
          });
        } else if (x == "phone") {
          that.setData({
            phone: e.detail.value
          }); // }
        } else if (x == "shoptype") {
          that.setData({
            shoptype: e.detail.value
          });
        } else if (x == "shopname") {
          that.setData({
            shopname: e.detail.value
          });
        } else if (x == "address") {
          that.setData({
            address: e.detail.value
          });
        }
      } // console.log(this.data.name);

    },

    // 提交
    submit(e) {
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      this.setData({
        name: this.name,
        phone: this.phone,
        shoptype: this.shoptype,
        shopname: this.shopname,
        address: this.address
      });

      if (this.name == "") {
        wx.showModal({
          title: '提示',
          content: '姓名不能为空',
          showCancel: false
        });
      } else if (!myreg.test(this.phone)) {
        wx.showModal({
          title: '提示',
          content: '请输入正确的手机号',
          showCancel: false
        });
      } else if (this.shoptype == "") {
        wx.showModal({
          title: '提示',
          content: '店铺类型不能为空',
          showCancel: false
        });
      } else if (this.shopname == "") {
        wx.showModal({
          title: '提示',
          content: '店铺名称不能为空',
          showCancel: false
        });
      } else if (this.address == "") {
        wx.showModal({
          title: '提示',
          content: '店铺地址不能为空',
          showCancel: false
        });
      }

      let obj = {
        shopOwner: this.name,
        tel: this.phone,
        shopType: this.shoptype,
        shopName: this.shopname,
        shopAddress: this.address
      };
      console.log(obj);
      wx.request({
        url: 'http://school.chundengtai.com/api/v2/cdtMerchant/save',
        data: JSON.stringify(obj),
        method: 'post',
        dataType: 'json',
        header: {
          //'token': wx.getStorageSync('token'),
          'content-type': 'application/json' // 默认值

        },
        responseType: 'text',
        success: res => {
          console.log(res.data);
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
@import "./entry.css";
</style>