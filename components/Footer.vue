<template>
  <div class="text-sm text-center absolute bottom-2 left-0 right-0">
    <div>
      &copy; {{ year }} <span class="text-primary-500">TITACA.COM</span>
    </div>
    <div>
      <NuxtLink class="text-blue-500 hover:text-blue-400" to="/privacy-policy">{{ $t('Privacy Policy') }}</NuxtLink> | <NuxtLink class="text-blue-500 hover:text-blue-400" to="/terms-of-service">{{ $t('Terms of Service') }}</NuxtLink> 
    </div>
  </div>
</template>

<script setup>
  const dayjs = useDayjs()
  const year = dayjs().year()
</script>