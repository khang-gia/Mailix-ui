<template>
    <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
        <div class="text-slate-800 dark:text-white text-sm">
            <p>Cám ơn bạn đã tham gia TTT MAILSERVER - nền tảng cung cấp, quản lý và gửi email hàng đầu Việt Nam.</p>
            <p>
                Để trao đổi, đóng góp, thảo luận cũng như nhận các tin thông báo biến động mã cổ phiếu, mời bạn 
                tham gia đóng góp vào nhóm cộng đồng TTTMAILSERVER trên Telegram nhé!
            </p>
            <div class="text-center">
                <img :src="TelegramQR" class="w-2/3 inline-block">
            </div>
        </div>
        <div class="text-center">
            <a 
                href="https://t.me/sieucophieu_official"
                class="px-5 py-2.5 w-full text-white bg-sky-500 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
                target="_blank"
                @click.stop="onOpenTelegram">
                Mở Telegram
            </a>
        </div>
    </form>
</template>
  
<script setup>
    import TelegramQR from '/images/TTTMAILSERVER_OFFICIAL.png'
    const emit = defineEmits(['after-submit'])
    const gtm = useGtm()
    
    const onOpenTelegram = () => {
        emit('after-submit')
    }
    onMounted(() => {
        useTrackEvent('signup:onboarding')
        gtm.trackEvent({
            event: 'onboarding',
            category: 'signup',
        })
    })
    
</script>