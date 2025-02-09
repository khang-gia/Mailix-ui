<template>
    <div class="flex items-center space-x-2">
        <div
            :class="statusColor"
            class="w-2 h-2 rounded-full inline-block"></div>
        <div class="text-xs">{{ statusText }}</div>
    </div>
</template>
  
<script setup>
    const { $sse } = useNuxtApp()
    const toast = useToast()

    const statusText = ref('Mất kết nối')
    const statusColor = ref('bg-slate-500')

    // const colorByStatus = computed(() => {
    //     if (!sseStatus.value) return 'bg-slate-500'
    //     const MAPS = {
    //         1: 'bg-yellow-500',
    //         2: 'bg-green-500',
    //         3: 'bg-slate-500',
    //         0: 'bg-slate-500'
    //     }
    //     return MAPS[sseStatus.value]
    // })
    // const tooltipByStatus = computed(() => {
    //     if (!sseStatus.value) return 'Mất kết nối'
    //     const MAPS = {
    //         1: 'Đang kết nối...',
    //         2: 'Đã kết nối',
    //         3: 'Mất kết nối',
    //         0: 'Mất kết nối'
    //     }
    //     return MAPS[sseStatus.value]
    // })
    let toastId = null
    function removeDisconnectNoti () {
        if (toastId) {
            toast.remove(toastId)
            toastId = null
        }
    }
    function showDisconnectNoti () {
        if(toastId) return
        const option = {
            title: 'Mất kết nối',
            description: 'Do đường truyền mạng, không thể kết nối đến máy chủ cập nhật giá. Nhấn nút <b class="text-blue-500">Kết nối</b> để thử lại nhé!',
            timeout: 0,            
            icon: 'i-heroicons-signal-slash-20-solid',
            actions: [{
            label: 'Kết nối',
            color: 'blue',
            variant: 'outline',
            click: () => {
                $sse.connect()
            }
        }]
        }
        toastId = toast.add(option).id
    }
    
    watch(
        ()=> $sse.status.value,
        (n, o)=> {
            switch (n) {
                case 'CONNECTING':
                    statusText.value = 'Đang kết nối...'
                    statusColor.value = 'bg-yellow-500'
                    break
                case 'OPEN':
                    statusText.value = 'Đã kết nối'
                    statusColor.value = 'bg-green-500'
                    removeDisconnectNoti()
                    break
                case 'CLOSED':
                    statusText.value = 'Mất kết nối'
                    statusColor.value = 'bg-slate-500'
                    showDisconnectNoti()
                    break
            }
    })
    
    onMounted(() => {
        setTimeout(() => {
            $sse.connect()
        })
    })
</script>