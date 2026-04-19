<template>
  <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
    <div class="text-slate-800 dark:text-white text-sm">
      <p>{{ $t('Please verify your email. An OTP code will be sent to your email') }}<strong>{{ data.username }}</strong> của bạn.</p>
      <p>{{ $t('You can skip this step and verify your email later.') }}</p>
    </div>
    
    <button type="submit"
      class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{{ $t('Go to Verification') }}</button>
    <div class="w-full flex items-center justify-between text-sm">
      <button type="button" @click.stop="emit('after-submit')"
        class="font-medium text-primary-600 hover:underline dark:text-primary-300">{{ $t('Do it later') }}</button>
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