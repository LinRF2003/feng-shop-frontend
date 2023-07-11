<template>
	<view class="my-address">
		<view class="address-list" v-if="addressList.length > 0">
			<view class="item" v-for="item in addressList" :key="item.addressId">
				<view class="info" @click="changeAddress(item)">
					<view class="t">
						<view class="name">{{item.consigneeName}}</view>
						<view class="phone">{{item.phone}}</view>
						<view class="default" v-if="item.isDefault">默认</view>
					</view>
					<view class="b">{{item.province}} {{item.city}} {{item.county + item.addressDetail}}</view>
				</view>
				<view class="edit-button">
					<u-icon name="edit-pen" @click="editAddress(item)"></u-icon>
					<u-icon name="trash-fill" @click="delAddress(item.addressId)"></u-icon>
				</view>
			</view>
		</view>
		<u-empty v-else mode="list" icon="http://cdn.uviewui.com/uview/empty/car.png">
		</u-empty>
		<button @click="addAddress" class="submit-btn">+ 添加收获地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [],
				isSettlement: false
			}
		},
		methods: {
			// 获取地址列表
			async getAddress() {
				let result = await this.$Request({
					url: "/address/get"
				});
				if (result.code === 200) {
					this.addressList = result.data;
				}
			},
			addAddress() {
				uni.navigateTo({
					url: "/pages/addAddress/addAddress"
				})
			},
			// 切换地址
			changeAddress(addressInfo) {
				// todo 在需要切换地址时才可以切换
				if (this.isSettlement) {
					uni.redirectTo({
						url: `/pages/settlement/settlement?addressInfo=${JSON.stringify(addressInfo)}`
					})
				}
				console.log(addressInfo);
			},
			// 修改地址
			editAddress(addressInfo) {
				uni.redirectTo({
					url: `/pages/addAddress/addAddress?addressInfo=${JSON.stringify(addressInfo)}`
				})
			}
		},
		onBackPress() {
			if (this.isSettlement) {
				uni.redirectTo({
					url: `/pages/settlement/settlement`
				})
				return true;
			}

		},
		onLoad(options) {
			if (options.isSettlement) {
				this.isSettlement = options.isSettlement
			}
			
		},
		onShow(){
			this.getAddress();
		}
	}
</script>

<style lang="scss">
	.my-address {
		background: #f4f4f4;
		padding: 20rpx;
		min-height: 100%;
		box-sizing: border-box;

		.address-list {
			background: #fff;
			padding: 20rpx;
			border-radius: 16rpx;
			margin-bottom: 100rpx;

			.item {
				display: flex;
				align-items: center;
				min-height: 120rpx;
				justify-content: space-between;

				.info {

					.t {
						display: flex;
						align-items: flex-end;
						margin-bottom: 8rpx;

						.name {
							font-size: 30rpx;
							margin-right: 8rpx;
						}

						.phone {
							color: #333;
							font-size: 26rpx;
							margin-right: 8rpx;
						}

						.default {
							color: red;
							font-size: 26rpx;
						}
					}

					.b {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
		}

		.submit-btn {
			position: fixed;
			bottom: 8px;
			width: calc(100% - 40rpx);
			height: 40px;
			line-height: 40px;
			text-align: center;
			background-color: #409eff;
			color: #fff;
			border: none;
			border-radius: 4px;
		}
	}
</style>