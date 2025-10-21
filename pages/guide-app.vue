<script setup lang="ts">
// Đặt tiêu đề cho trang Nuxt
definePageMeta({
  title: 'Hướng Dẫn Dịch Vụ - Mailix'
})
// Lấy base URL cho iframe
const iframeSrc = '/guide/guide_app_mailix.html';
</script>

<template>
  <div class="nuxt-guide-wrapper" style="height: 100vh; width: 100%; overflow: hidden;">
    <iframe 
      :src="iframeSrc" 
      frameborder="0" 
      style="height: 100%; width: 100%; min-height: 100vh;"
      title="Hướng dẫn sử dụng Mailix (HTML gốc)"
    >
      Trình duyệt của bạn không hỗ trợ iframe.
    </iframe>
  </div>
</template>

<style scoped>
/* Nếu bạn muốn ẩn header/footer của Nuxt khi trang này được load, 
  hãy thêm class này vào layout của bạn hoặc đảm bảo trang này dùng layout trống.
*/
.nuxt-guide-wrapper {
  /* Loại bỏ padding mặc định của body/main wrapper nếu có */
  margin: 0;
  padding: 0;
}
</style>