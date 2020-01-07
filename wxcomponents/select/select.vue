<template>
<!--pages/select.wxml-->
<view class="com-selectBox">
    <view class="com-sContent" @tap="selectToggle">
        <view class="com-sTxt">{{nowText==" "?propArray[0].name:nowText}}
        </view>
        <image src="../../static/images/xia.png" class="com-sImg" :animation="animationData"></image>
    </view>
    <view class="com-sList" v-if="selectShow">
        <view v-for="(item, index) in propArray" :key="index" :data-index="item" class="com-sItem" @tap="setText">{{item.name}}</view>
    </view>
</view>
</template>

<script>
export default {
  data() {
    return {
      selectShow: false,
      //初始option不显示
      nowText: " ",
      //初始内容
      animationData: {} //右边箭头的动画

    };
  },

  components: {},
  props: {
    propArray: {
      type: Array
    }
  },
  methods: {
    //option的显示与否
    selectToggle: function () {
      var nowShow = this.selectShow; //获取当前option显示的状态
      //创建动画

      var animation = wx.createAnimation({
        timingFunction: "ease"
      });
      this.animation = animation;

      if (nowShow) {
        animation.rotate(0).step();
        this.setData({
          animationData: animation.export()
        });
      } else {
        animation.rotate(180).step();
        this.setData({
          animationData: animation.export()
        });
      }

      this.setData({
        selectShow: !nowShow
      });
    },
    //设置内容
    setText: function (e) {
      //console.log(e);
      //var nowData = this.properties.propArray; //当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties

      var nowIdx = e.target.dataset.index; //当前点击的索引
      var nowText = e.target.dataset.index.name; //当前点击的内容
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画

      this.animation.rotate(0).step();
      this.setData({
        selectShow: false,
        nowText: nowText,
        animationData: this.animation.export()
      }); //console.log(this.properties.propArray);

      var nowDate = {
        id: nowIdx,
        name: nowText,
        address: e.target.dataset.index.address,
        province: e.target.dataset.index.province,
        city: e.target.dataset.index.city,
        area: e.target.dataset.index.area,
        latitude: e.target.dataset.index.latitude,
        longitude: e.target.dataset.index.longitude
      };
      this.$emit('myget', nowDate);
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
@import "./select.css";
</style>