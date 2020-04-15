<template>
	<view>
		<view class="container">
			<!-- <view class="row bg-white tc">
				<view class="col-xs-12 fs-15 f-shallow m-t-20 m-b-10">
				当前余额
				</view>
				<view class="col-xs-12 f-main m-b-15">
					¥ <text class="fs-36">0.00</text>
				</view>
			</view> -->
			<view class="row global-form-box bg-white p-t-5 p-b-5  fs-15">
				<view class="col-xs-2 name">
					金额
				</view>
				<view class="col-xs-9">
					<!-- <input type="number" class="input-text pc-100" placeholder="请输入充值金额" style="background:#f8f8f8;" v-model.number="money" />	 -->
				<picker @change="bindPickerChange" :range="array" class="input-text pc-100">	
						<label class="input-text pc-100" style="">{{array[index]}}</label>		
					</picker>
				
				</view> 
			</view>
			<!-- <view class="row global-form-box bg-white p-t-5 p-b-5  fs-15 m-t-10">
				<view class="col-xs-2 name">
					备注
				</view>
				<view class="col-xs-9">
					<input type="text" class="input-text pc-100" placeholder="请输入备注" />
				</view>
			</view> -->
			
		</view>
		<view class="lr15 pf b0 l0 r0">
			<view class="row m-b-20">
				<view class="col-xs-12 m-b-10">
					<button class="btn btn-main fs-18 pc-100" style="padding:10px 20px;" @click="saveCashApply">去充值</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require("../../../services/pay.js");
export default {
	data() {
		return {
			index:0,
			array: [0,50, 100, 200, 500, 1000,2000,5000],
			money: 0
		};
	},

	components: {},
	props: {},
	onLoad: function(options) {
		
		
	},
	methods: {
		onChange(event) {
			let that=this;
			const { picker, value, index } = event.detail;
			console.log(value);
			that.subshowPrice=value*100;
			const item = this.items;
			item.score =value;
			that.items=item
		},
		resetInfo: function() {
			const item = this.items;
			item.name = '';
			this.setData({
				items: item
			});
		},

		bindinputName(event) {
			let items = this.items;
			items.name = event.detail || event;
			console.log(event.detail);
			this.setData({
				items: items
			});
		},

		bindinputAmount(e) {
			let items = this.items;
			items.amount = e.detail.value;
			this.setData({
				items: items
			});
		},
       bindPickerChange: function(e) {		
        this.index = e.target.value	
		var result = this.array[this.index]
        this.setData({
			money :result
		})	

},

		saveCashApply() {
			console.log('money='+this.money);
			if(this.money <=0 ){
				wx.showToast({
				  title: '请重新选择充值金额',
				})
				return false;
			}
			let that = this;
			console.log("money="+that.money);
			console.log("socre="+that.money);
			util.request(
				api.Socre,
				{
					money: that.money,
					score: that.money
				},
				'GET'
			).then(function(res) {
				console.log(res)
				if(res.code === 200){
				const scoreflowId = res.data.id;
				pay.payScore(parseInt(scoreflowId)).then(res => {
				  wx.redirectTo({
				    url: '/pages/payScoreResult/payScoreResult?status=1&scoreflowId=' + scoreflowId
				  });
				}).catch(res => {
				  wx.redirectTo({
				    url: '/pages/payScoreResult/payScoreResult?status=0&scoreflowId=' + scoreflowId
				  });
				});
				}
			});
		},
		setData: function(obj, callback) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function(key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function(key2, index) {
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
