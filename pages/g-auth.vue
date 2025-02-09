<template>
  <div class="dark:text-gray-400 text-gray-800 flex justify-center items-center space-x-2 text-lg h-screen">
    <p>Loading</p>
    <Icon name="svg-spinners:3-dots-scale-middle" size="24" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'base',
})

const route = useRoute()
const router = useRouter()
const snackbar = useMySnackBar()
const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
const access = useCookie('auth:token', { maxAge: 14 * 24 * 3600 }) // 14 days 
const code = route.query.code

const { data, error } = await useFetch(
  apiBaseUrl + '/auth/google/',
  {
    method: 'POST',
    body: { code: code },
    headers: { 'Content-Type': 'application/json', },
  }
)

onMounted(() => {
  if (error.value) {
    snackbar.error('Đăng nhập bằng Google thất bại')
  }
  else {
    console.log(data.value)
    snackbar.success('Đăng nhập bằng Google thành công')
    access.value = data.value.access
  }
  window.location.href = '/'
})
</script>