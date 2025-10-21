<script setup lang="ts">
// Đặt tiêu đề cho trang Nuxt
definePageMeta({
  title: 'Hướng Dẫn Dịch Vụ - Mailix'
})
// Lấy base URL cho iframe
const iframeSrc = '/guide/guide_app_mailix.html';
const isLoading = ref(true);
const handleIframeLoad = () => {
  // Tắt trạng thái loading, sẽ ẩn Skeleton và hiển thị iframe
  isLoading.value = false;
};
onMounted(() => {
  // Bộ đếm thời gian an toàn (Safety Timer)
  // Nếu sau 5 giây (5000ms) mà iframe vẫn còn ở trạng thái loading, 
  // ta sẽ buộc phải tắt nó đi để tránh bị kẹt.
  setTimeout(() => {
    if (isLoading.value) {
      console.warn("IFrame load event was missed. Forcing loading state off after 5s fallback.");
      isLoading.value = false;
    }
  }, 500); 
});
</script>

<template>
  <div class="nuxt-guide-wrapper relative" style="min-height: 100vh; width: 100%;">
    
    <iframe 
      :src="iframeSrc" 
      frameborder="0" 
      @load="handleIframeLoad" 
      :class="{'opacity-0': isLoading, 'opacity-100': !isLoading}"
      style="height: 100%; width: 100%; min-height: 100vh; transition: opacity 0.5s ease-out;"
      title="Hướng Dẫn Dịch Vụ (HTML gốc)"
    >
      Trình duyệt của bạn không hỗ trợ iframe.
    </iframe>

    <div v-if="isLoading" class="absolute inset-0 p-8 z-10 bg-mailix-bg">
        <USkeleton class="h-10 w-2/3 mb-10" />
        <div class="space-y-6">
            <div v-for="i in 4" :key="i" class="p-6 rounded-xl border-l-4 border-gray-200 bg-white shadow-md">
                <USkeleton class="h-6 w-1/3 mb-4" /> 
                <div class="space-y-2 pt-2">
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-11/12" />
                    <USkeleton class="h-4 w-5/6" />
                </div>
            </div>
        </div>
        <USkeleton class="h-6 w-1/4 mt-10 mx-auto" />
    </div>
  </div>
</template>

<style>
/* (Đảm bảo bạn đã thêm màu `mailix-bg` trong cấu hình Tailwind/CSS global nếu cần) */
.bg-mailix-bg { background-color: #f9fafb; }

.nuxt-guide-wrapper {
  margin: 0;
  padding: 0;
}
</style>
