<template>
  <div class="flex-col flex md:flex-row space-x-0 md:space-x-2 p-2">
    <div class="w-full md:w-2/3 space-y-2 ">
      <ScpRecommendationOpenCard @close-recommend="recommendClosed=true"></ScpRecommendationOpenCard>
      <ScpRecommendationCloseCard :refreshData="recommendClosed"></ScpRecommendationCloseCard>
    </div>
    <div class="w-full md:w-1/3 mt-2 md:mt-0">
      <ScpTopStocks />
    </div>
  </div>
    
</template>
<script setup>
  const dayjs = useDayjs()
    definePageMeta({
        title: 'Danh mục'
    })

    useSeoMeta({
      title: `Cổ phiếu đang dẫn dắt thị trường ngày ${dayjs().format('DD-MM-YYYY')}`,
      ogTitle: `Cổ phiếu đang dẫn dắt thị trường ngày ${dayjs().format('DD-MM-YYYY')}`,
      description: `Xem danh sách các cổ phiếu đang dẫn dắt thị trường và các cổ phiếu có dòng tiền tổ chức`,
      ogDescription: `Xem danh sách các cổ phiếu đang dẫn dắt thị trường và các cổ phiếu có dòng tiền tổ chức`,
    })
    const recommendClosed = ref(false)
</script>