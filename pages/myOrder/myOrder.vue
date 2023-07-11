<template>
	<view class="my-order">
		<view class="order-list" v-if="orderList.length > 0">
			<view class="item" v-for="orderInfo in orderList" :key="orderInfo.orderId">
					<OrderItem :orderInfo="orderInfo" @finishDeleteOrder="finishDeleteOrder"></OrderItem>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: []
			};
		},
		mounted() {
			// 获取订单列表
			this.getOrderList();
		},
		methods: {
			// 获取订单列表
			async getOrderList() {
				let result = await this.$Request({
					url: "/order/get"
				})
				if(result.code === 200) {
					this.orderList = result.data;
				}
			},
			// 删除订单 
			finishDeleteOrder(orderId){
				console.log(orderId);
			
				this.orderList = this.orderList.filter(item=>{
						console.log(item.orderId);
					return item.orderId!=orderId;
				})
				uni.showToast({
					title: "删除成功",
					icon: "none"
				})
			}
		}
	}
</script>

<style lang="scss">
.my-order{
	background: #f4f4f4;
	
	.order-list{
		min-height: calc(100vh - 40rpx - var(--window-top));
		padding: 20rpx;
	}
}
</style>