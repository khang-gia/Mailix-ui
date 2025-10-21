<script setup lang="ts">
// Đặt tiêu đề cho trang Nuxt
definePageMeta({
    title: 'Hướng Dẫn Thiết Lập Outlook - Mailix',
})
// Lấy base URL cho iframe
const iframeSrc = '/guide/guide_mailix.html';
</script>

<template>
  <div class="nuxt-guide-wrapper" style="height: 100vh; width: 100%; overflow: hidden;">
    <iframe 
      :src="iframeSrc" 
      frameborder="0" 
      style="height: 100%; width: 100%; min-height: 100vh;"
      title="Hướng dẫn Thiết lập Outlook (HTML gốc)"
    >
      Trình duyệt của bạn không hỗ trợ iframe.
    </iframe>
  </div>
</template>

<style scoped>
/* Đảm bảo khung bao không có lề/padding mặc định */
.nuxt-guide-wrapper {
  margin: 0;
  padding: 0;
}
</style>