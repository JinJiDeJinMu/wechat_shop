<template>
<!--pages/campuspartner/campuspartner.wxml-->
<view class="campuspartner">
  <view class="entry-img">
    <image src="https://www.chundengtai.com/qrcode/computer.png" class="bgc" mode="widthFix"></image>
  </view>
  <view class="campuspartner-con">
    <view class="con-wo">
      <view class="my">我们期待这样一个你</view>
      <view class="con-student">
        <view class="student">在校大学生，限南昌地区，专业不限</view>
      </view>
      <view class="con-you">
        <view class="you">有广泛的校园资源，有独立项目运营经营者优先。</view>
      </view>
      <!-- 沟通 -->
      <view class="con-gou">
        <view class="haha">
          <text class="gou-tong">沟通能力一流：</text>
          <text class="tong">敢于主动交流，善于倾听沟通，有较强的协调开拓能力。</text>
        </view>
        <view class="haha">
          <text class="gou-tong">创新与执行力兼具：</text>
          <text class="tong">天生的行动派，有理想，会创新，自我驱动能力一流，责任心强。</text>
        </view>
        <view class="haha">
          <text class="gou-tong">敢于学习，乐于挑战：</text>
          <text class="tong">能够主动接受工作中的各项挑战，富有团队合作精神。</text>
        </view>
      </view>
      <view class="you-ni">你将得到的待遇</view>
      <view class="con-gou">
        <view class="haha">
          <text class="gou-tong" style="color: #4bba34">月入800-2000：</text>
          <text class="tong">底薪800+提成，工资无上限，工作时间不固定，可自行安排，完成每月任务即可。</text>
        </view>
      </view>
      <!-- 分割线 -->
      <view class="xian"></view>
      <!-- 校园合伙人申请 -->
      <view class="apply">
        <view class="apply-stu">校园合伙人申请</view>
        <view class="apply-phone">每个学校合伙人人数有限，有意向的请尽快联系我们。</view>
        <view>
          <view class="infor-tian">
            <view class="tian">
              <view class="tian-name">
                <text>姓名：</text>
                <text>*</text>
                <input type="text" data-key="name" class="input-name" @input="partner"></input>
              </view>
            </view>
          </view>
          <!-- 性别 -->
          <view class="infor-tian">
            <view class="tian">
              <view class="tian-name">
                <text>性别：</text>
                <text>*</text>
                <input type="text" data-key="sex" class="input-name" @input="partner"></input>
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
                  <input type="number" data-key="phone" class="input-name1" @input="partner"></input>
                </view>
              </view>
            </view>
          </view>
          <!-- 您所在的学校 -->
          <view class="infor-tian">
            <view class="tian">
              <view class="tian-name">
                <text>您所在的学校：</text>
                <text>*</text>
                <input type="text" data-key="student" class="input-name" @input="partner"></input>
              </view>
            </view>
          </view>
          <!-- 您所在的年级 -->
          <view class="infor-tian">
            <view class="tian">
              <view class="tian-name">
                <text>您所在的年级：</text>
                <text>*</text>
                <input type="text" data-key="grade" class="input-name" @input="partner"></input>
              </view>
            </view>
          </view>
          <!-- 简单的自我介绍 -->
          <view class="infor-tian">
            <view class="tian">
              <view class="tian-name">
                <text>简单的自我介绍：</text>
                <text>*</text>
                <textarea class="input-di" data-key="introduce" name="content" @input="partner"></textarea>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 确认提交 -->
      <view class="confirm" @tap="confirm">确认提交</view>
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
      sex: "",
      phone: "",
      student: "",
      grade: "",
      introduce: ""
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
    partner(e) {
      var that = this;

      if (e.detail.value != "") {
        var x = e.currentTarget.dataset.key;

        if (x == "name") {
          that.setData({
            name: e.detail.value
          });
        } else if (x == "sex") {
          that.setData({
            sex: e.detail.value
          }); // 性别验证：

          if (!/^['男'|'女']$/.test(that.sex)) {
            wx.showToast({
              title: '性别只能是男或者女',
              duration: 2000,
              icon: 'none'
            });
          }
        } else if (x == "phone") {
          that.setData({
            phone: e.detail.value
          });
        } else if (x == "student") {
          that.setData({
            student: e.detail.value
          });
        } else if (x == "grade") {
          that.setData({
            grade: e.detail.value
          });
        } else if (x == "introduce") {
          that.setData({
            introduce: e.detail.value
          });
        }
      }
    },

    // 提交
    confirm(e) {
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      this.setData({
        name: this.name,
        sex: this.sex,
        phone: this.phone,
        student: this.student,
        grade: this.grade,
        introduce: this.introduce
      });

      if (this.name == "") {
        wx.showModal({
          title: '提示',
          content: '姓名不能为空',
          showCancel: false
        });
      } else if (this.sex == "") {
        wx.showModal({
          title: '提示',
          content: '请输入性别',
          showCancel: false
        });
      } else if (!myreg.test(this.phone)) {
        wx.showModal({
          title: '提示',
          content: '请输入正确的手机号',
          showCancel: false
        });
      } else if (this.student == "") {
        wx.showModal({
          title: '提示',
          content: '请输入您所在的学校',
          showCancel: false
        });
      } else if (this.grade == "") {
        wx.showModal({
          title: '提示',
          content: '请输入您所在的年级',
          showCancel: false
        });
      } else if (this.introduce == "") {
        wx.showModal({
          title: '提示',
          content: '亲，请简单介绍一下自己',
          showCancel: false
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
@import "./campuspartner.css";
</style>