<template>

    <i-button long type="ghost" :data-index="index" @click="handleClickItem">
        <view class="i-modal-btn-loading" v-if="item.loading"></view>
        <i-icon v-if="item.icon" :type="item.icon" i-class="i-modal-btn-icon"></i-icon>
        <view class="i-modal-btn-text" :style="( item.color ? 'color: ' + item.color : '' )">{{ item.name }}</view>
    </i-button>

</template>

<script>
    export default {
    		name: "button-diy",
    		props: ["item"]
    	}
</script>
