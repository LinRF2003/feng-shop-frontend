<template>
	<view class="add-address">
		<view class="form-item">
			<view class="label">收货人姓名</view>
			<input v-model="formData.consigneeName" placeholder="请输入姓名" />
		</view>
		<view class="form-item">
			<view class="label">联系电话</view>
			<input v-model="formData.phone" placeholder="请输入手机号" />
		</view>
		<view class="form-item">
			<view class="label">所在地区</view>
			<!-- <textarea v-model="formData.address" placeholder="请输入详细地址"></textarea> -->
			<uni-data-picker :localdata="areas" placeholder="点击选择" popup-title="请选择地区" v-model="area"
				@change="bindPickerChange">
				<text class="word13" v-if="!area.length">点击选择</text>
				<text class="word13" v-else>{{ area[0] }}，{{ area[1] }}，{{ area[2] }}</text>
			</uni-data-picker>
		</view>
		<view class="form-item">
			<view class="label">详细地址:</view>
			<input v-model="formData.addressDetail" placeholder="所在镇+小区楼栋/乡村名称" />
		</view>
		<view class="form-item">
			<view class="label">设认为默认地址</view>
			<view>
				<label class="radio">
					<radio :checked="formData.isDefault === 1" @click="()=>{
						formData.isDefault = formData.isDefault ? 0 : 1
					}" />
				</label>
			</view>
		</view>
		<button @click="addAddress" class="submit-btn">保存</button>
	</view>
</template>

<script>
	import uniDataPicker from '@/uni_modules/uni-data-picker/components/uni-data-picker/keypress.js';
	const areas = require("../../utils/areas.json");
	export default {
		data() {
			return {
				area: [],
				areas: areas,
				addressId: null,
				formData: {
					consigneeName: '',
					phone: '',
					addressDetail: '',
					isDefault: 0,
				},
				isSettlement: false
			}
		},


		methods: {
			// 添加地址
			async addAddress() {
				// todo 数据校验
				// 简单判断数据
				if (this.area.length === 0 || !this.formData.consigneeName || !this.formData.phone || !this.formData
					.addressDetail) {
					uni.showToast({
						title: "数据不能为空",
						icon: "none"
					})
					return;
				}
				// 将收货地址数据提交到服务器
				let result;
				if (this.addressId) {
					result = await this.$Request({
						url: "/address/add",
						data: {
							consigneeName: this.formData.consigneeName,
							phone: this.formData.phone,
							addressDetail: this.formData.addressDetail,
							province: this.area[0],
							city: this.area[1],
							county: this.area[2],
							isDefault: this.formData.isDefault,
							addressId: this.addressId
						}
					})

				} else {
					result = await this.$Request({
						url: "/address/add",
						data: {
							consigneeName: this.formData.consigneeName,
							phone: this.formData.phone,
							addressDetail: this.formData.addressDetail,
							province: this.area[0],
							city: this.area[1],
							county: this.area[2],
							isDefault: this.formData.isDefault
						}
					})
				}


				if (result.code === 200) {
					uni.navigateBack();
				}

			},
			bindPickerChange(val) {
				console.log(val.detail.value);
				let area = val.detail.value
				this.area = [area[0].text, area[1].text, area[2].text];
			},
		},
		onLoad(options) {
			if (options.isSettlement === 'true') {
				this.isSettlement = options.isSettlement
			}
			if (options.addressInfo) {
				uni.setNavigationBarTitle({
					title: "修改收获地址"
				})
				const addressInfo = JSON.parse(options.addressInfo);
				this.area = [addressInfo.province, addressInfo.city, addressInfo.county];
				this.formData.consigneeName = addressInfo.consigneeName;
				this.formData.phone = addressInfo.phone;
				this.formData.addressDetail = addressInfo.addressDetail;
				this.formData.isDefault = addressInfo.isDefault;
				this.addressId = addressInfo.addressId;
			}
		},
		onBackPress() {
			if (this.isSettlement) {	
				uni.redirectTo({
					url: "/pages/myAddress/myAddress?isSettlement=true"
				})
			} else {
				uni.redirectTo({
					url: "/pages/myAddress/myAddress"
				})
			}
			return true;
		}
	}
</script>

<style lang="scss" scoped>
	.add-address {
		padding: 20px;
	}

	.form-item {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}

	.label {
		width: 120px;
	}

	input,
	textarea {
		flex: 1;
		height: 30px;
		padding: 5px 10px;
		border: 1px solid #ccc;
		border-radius: 16rpx;
		background: #f4f4f4;
		font-size: 14px;
	}

	.submit-btn {
		position: fixed;
		bottom: 8px;
		width: calc(100% - 40px);
		height: 40px;
		line-height: 40px;
		text-align: center;
		background-color: #409eff;
		color: #fff;
		border: none;
		border-radius: 4px;
	}
</style>