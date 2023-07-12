<template>
	<view>
		<view>支付成功</view>
		<button @click="goToOrderDetail">查看订单详情</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId:null
			};
		},
		methods:{
			goToOrderDetail(){
				uni.redirectTo({
					url:`/pages/OrderDetail/OrderDetail?orderId=${this.orderId}`
				})
			}
		},
		onBackPress() {
			uni.switchTab({
					url:"/pages/index/index"
			})
			return;
		},
		onLoad(options) {
				if(options.orderId){
					this.orderId = options.orderId
				}
		}
	}
</script>

<style lang="scss">

</style>
