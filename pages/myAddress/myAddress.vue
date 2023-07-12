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
					
					<view class="edit-icon"><u-icon name="edit-pen" @click="editAddress(item)"></u-icon></view>
				
					<u-icon name="trash-fill" @click="showModal(item.addressId)"></u-icon>
					
				</view>
			
			</view>
	
		</view>
		<u-empty v-else mode="list" icon="http://cdn.uviewui.com/uview/empty/car.png">
		</u-empty>
		<button @click="addAddress" class="submit-btn">+ 添加收获地址</button>
		<u-modal :show="showDelBox" :content="`你确定删除这个地址吗`" show-cancel-button close-on-click-overlay
			width="400rpx" cancel-text="我再想想" confirm-text="删除" @cancel="closeModal" @confirm="delAddress"
			@close="closeModal"></u-modal>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [],
				isSettlement: false,
				showDelBox:false,
				addressId:null // 将要删除的id
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
				uni.redirectTo({
					url: `/pages/addAddress/addAddress?isSettlement=${this.isSettlement}`
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
			},
			// 删除地址
			async delAddress(){
				let result = await this.$Request({
					url: "/address/del",
					data:{
						addressId:this.addressId
					}
				});
				if (result.code === 200) {
					uni.showToast({
						title:"删除成功",
						icon:"none"
					})
					this.getAddress();
						this.showDelBox = false;
				}
			},
			// 关闭弹出层
			closeModal() {
				this.showDelBox = false;
			},
			// 显示弹出层
			showModal(addressId) {
				this.showDelBox = true;
				this.addressId = addressId;
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
					flex:1;
					.t {
						display: flex;
						align-items: center;
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
							color: #ff7a00;
							font-size: 24rpx;
							border: 1px #ff7a00 solid;
							padding: 2rpx;
							border-radius: 8rpx;
						}
					}

					.b {
						max-width: 100%;
						// word-wrap: normal;
						font-size: 24rpx;
						color: #666;
						
					}
				}
				.edit-button{
					min-width: 120rpx;
					display: flex;
					justify-content: flex-end;
					.edit-icon{
						margin-right: 20rpx;
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