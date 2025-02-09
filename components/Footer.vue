<template>
  <div class="text-sm text-center absolute bottom-2 left-0 right-0">
    <div>
      &copy; {{ year }} <span class="text-primary-500">SIEUCOPHIEU.VN</span>
    </div>
    <div>
      <NuxtLink class="text-blue-500 hover:text-blue-400" to="/privacy-policy">Chính sách B.Mật</NuxtLink> | <NuxtLink class="text-blue-500 hover:text-blue-400" to="/terms-of-service">Điều khoản D.Vụ</NuxtLink> 
    </div>
  </div>
</template>

<script setup>
  const dayjs = useDayjs()
  const year = dayjs().year()
</script>