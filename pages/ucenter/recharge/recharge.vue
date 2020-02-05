<template>
	<view class="add-address">
		<view class="add-form">
				<van-picker :columns="columns" default-index="1" @change="onChange" />
		</view>
		<view class="btns">
			<button class="cannel" @tap="resetInfo">重选</button>
			<van-submit-bar
			  :price="subshowPrice"
			  tip="请选择充值金额"
			  button-text="充值"
			  @submit="saveCashApply"
			/>
		</view>
	</view>
</template>

<script>
import Toast from '../../../wxcomponents/vant-weapp/toast/toast';	
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
export default {
	data() {
		return {
			columns: [50, 100, 200, 500, 1000,2000,5000],
			subshowPrice:10000,
			items: {
				name: '',
				score: 100,
				amount: ''
			},
			unsetMoney: 0
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

		saveCashApply() {
			console.log('--------1--------');
			let that = this;
			util.request(
				api.distriapply,
				{
					realName: that.items.name,
					tel: ''
				},
				'POST',
				'application/x-www-form-urlencoded'
			).then(function(res) {
				if (res.errno === 0) {
					wx.showToast({
						title: '提交成功,请等待审核'
					});
				} else {
					util.showErrorToast(res.errmsg);
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
@import './recharge.css';
</style>
