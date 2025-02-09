<template>
  <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
    <div class="text-slate-800 dark:text-white text-sm">
      <p>Xin hãy xác thực email của bạn. Một mã OTP sẽ được gửi tới email <strong>{{ data.username }}</strong> của bạn.</p>
      <p>Bạn có thể bỏ qua bước này và xác thực email lần sau.</p>
    </div>
    
    <button type="submit"
      class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
      Đến Xác thực
    </button>
    <div class="w-full flex items-center justify-between text-sm">
      <button type="button" @click.stop="emit('after-submit')"
        class="font-medium text-primary-600 hover:underline dark:text-primary-300">Để lần sau</button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps(['data'])
const emit = defineEmits(['on-otp-verify', 'after-submit'])

const onSubmit = async () => {
  emit('on-otp-verify', {
    username: props.data.username,
  })
}
</script>