<template>
    <div class="fixed bottom-0 left-0 right-0 h-5 bg-white border-t border-slate-200 dark:bg-[#182235] dark:border-slate-700 flex justify-between px-4 py-px">    
        <span class="text-xs pl-14">
            &copy; {{ year }} <Icon class="text-red-500" name="heroicons:heart"></Icon> SCP
        </span>
        
        <div class="flex space-x-2">
            <ClientOnly>
            <div class="text-xs">{{ clock }}</div>
            </ClientOnly>
            <div class="text-xs">|</div>
        </div>
    </div>
</template>
  
<script setup>
    import { useNow, useDateFormat } from '@vueuse/core'
    const clock = useDateFormat(useNow(), 'DD-MM-YYYY | HH:mm:ss')
    const dayjs = useDayjs()
    const year = dayjs().year()
</script>