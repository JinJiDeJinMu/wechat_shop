<template>
<view>
<view class="add-address">
    <view class="add-form">
        <view class="form-item">
            <input class="input" @input="bindinputName" placeholder="姓名" :value="address.userName" auto-focus></input>
        </view>
        <view class="form-item">
            <input class="input" @input="bindinputMobile" :value="address.telNumber" maxlength="15" type="number" placeholder="手机号码"></input>
        </view>
        <view class="form-item">
            <input class="input" :value="address.full_region" disabled="true" @tap="chooseRegion" placeholder="省份、城市、区县"></input>
        </view>
        <view class="form-item">
            <input class="input" @input="bindinputAddress" :value="address.detailInfo" placeholder="详细地址, 如街道、楼盘号等"></input>
        </view>
        <view class="form-default">
            <text @tap="bindIsDefault" :class="'default-input ' + (address.is_default == 1 ? 'selected' : '')">设为默认地址</text>
        </view>
    </view>

    <view class="btns">
        <button class="cannel" @tap="cancelAddress">取消</button>
        <button class="save" @tap="saveAddress">保存</button>
    </view>

    <view class="region-select" v-if="openSelectRegion">
      <view class="hd">
        <view class="region-selected">
          <view :class="'item ' + (item.id == 0 ? 'disabled' : '') + ' ' + ((regionType -1) === index ? 'selected' : '')" @tap="selectRegionType" :data-region-type-index="index" v-for="(item, index) in selectRegionList" :key="index">{{item.name}}</view>
        </view>
        <view :class="'done ' + (selectRegionDone ? '' : 'disabled')" @tap="doneSelectRegion">确定</view>
      </view>
      <view class="bd">
        <scroll-view scroll-y="true" class="region-list">
          <view :class="'item ' + (item.selected ? 'selected' : '')" @tap="selectRegion" :data-region-index="index" v-for="(item, index) in regionList" :key="index">{{item.name}}</view>
        </scroll-view>
      </view>
    </view>
</view>
<view class="bg-mask" @tap="cancelSelectRegion" v-if="openSelectRegion"></view>
</view>
</template>

<script>
var util = require("../../../utils/util.js");
var api = require("../../../config/api.js");

export default {
  data() {
    return {
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
      selectRegionDone: false
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);

    if (options.id != '' && options.id != 0) {
      this.setData({
        addressId: options.id
      });
      this.getAddressDetail();
    }

    this.getRegionList(1);
  },
  onReady: function () {},
  onShow: function () {// 页面显示
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
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

    getAddressDetail() {
      let that = this;
      util.request(api.AddressDetail, {
        id: that.addressId
      }).then(function (res) {
        console.log(res.data);

        if (res.errno === 0) {
          if (res.data) {
            that.setData({
              address: res.data
            });
          }
        }
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

    cancelAddress() {
      wx.navigateBack({
        url: '/pages/shopping/address/address'
      });
    },

    saveAddress() {
      console.log(this.address);
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
          wx.navigateBack({
            url: '/pages/shopping/address/address'
          });
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
@import "./addressAdd.css";
</style>