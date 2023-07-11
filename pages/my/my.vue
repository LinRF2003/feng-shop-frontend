<template>
	<view class="my">
		<view class="user-info">
			<view class="cover">
			<image :src="imgUrl + userInfo.avatar" mode="widthFix"></image>
			</view>
			<view class="name">{{userInfo.userName}}</view>
		</view>
		<u-cell-group>
				<u-cell title="我的收获地址" :isLink="true" arrow-direction="right" url="/pages/myAddress/myAddress"></u-cell>
				<u-cell  title="我的订单" :isLink="true" arrow-direction="right" url="/pages/myOrder/myOrder"></u-cell>
			</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},
				imgUrl:"",
			}
		},
		methods: {
			
		},
		mounted() {
			this.imgUrl = this.$ImageUrl;
			this.userInfo = uni.getStorageSync("userInfo")
		}
	}
</script>

<style lang="scss">
.my{
	.user-info{
			display: flex;
			flex-direction: column;
			align-items: center;
			.cover{
				margin-bottom: 10rpx;
				width: 240rpx;
				height: 240rpx;
				border-radius: 50%;
				overflow: hidden;
				display: flex;
				align-items: center;
				border: 1px solid #ddd;
				image{
					width: 240rpx;
				}
			}
			margin-bottom: 30rpx;
	}
}
</style>
