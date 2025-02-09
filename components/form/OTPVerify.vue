<template>
  <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
    <div class="text-slate-800 dark:text-white text-sm">
      <p>
        Mã OTP đã được gửi tới email <strong>{{ data.username }}</strong> của bạn.
        Vui lòng nhập OTP nhận được vào bên dưới
      </p>
    </div>
    <div>
      <FormOTPInput :length="OTP_LENGTH" @input="onOTPReady"></FormOTPInput>
    </div>
    <BaseButton
      type="submit"
      class="w-full text-white bg-primary-600 enabled:hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm dark:bg-primary-600 enabled:dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      :busy="busy"
      :disabled="inputOtp.length<OTP_LENGTH"
    text="Xác nhận"></BaseButton>
    
    <div class="w-full flex items-center justify-between text-sm">
      <button
        type="button"
        @click.stop="resendOtp"
        :disabled="timeout>0"
        class="font-medium enabled:text-primary-600 disabled:text-grey-500 hover:underline dark:enabled:text-primary-500 dark:disabled:text-gray-500">
        Gửi lại mã
        <span v-if="timeout>0">({{ timeout }}s)</span>
      </button>
    </div>

  </form>
</template>

<script setup>
  const props = defineProps(['data'])
  const emit = defineEmits(['after-submit'])

  const { signIn, status } = useAuth()
  const snackbar = useMySnackBar()

  const OTP_LENGTH = 6
  const busy = ref(false)
  const inputOtp = ref('')

  const verify = async (username, code) => {
    busy.value = true
    const { data, error } = await useAPI().post('/auth/otp/verify/', {
      username,
      code
    })
    busy.value = false
    if (error.value) {
      throw error.value
    }
    return data.value
  }

  const ensureLogin = async () => {
    if (status.value !== 'authenticated') {
      busy.value = true
      await signIn({
        username: props.data.username,
        password: props.data.password,
      }, {
        redirect: false
      })
      busy.value = false
    }
  }

  const resendOtp = async () => {
    busy.value = true
    const { data, error } = await useAPI().post('/auth/otp/generate/', {
      username: props.data.username,
    })
    busy.value = false
    
    if (error.value) {
      snackbar.error('Hiện tại không thể gửi OTP. Vui lòng thử lại sau.', 'Gửi thất bại!')
    } else {
      snackbar.success('Gửi OTP thành công!')
      resendCountdown()
    }

  }
  let countdownHandler = null
  const timeout = ref(0)
  const resendCountdown = () => {
    timeout.value = 120
    clearInterval(countdownHandler)
    countdownHandler = setInterval(() => {
      timeout.value --
    }, 1000)
  }

  function resetCountdown () {
    timeout.value = 0
    clearInterval(countdownHandler)
  }

  const onSubmit = async () => {
    try {
      const res = await verify(
        props.data.username,
        inputOtp.value
      )
      snackbar.success('Xác thực thành công.')
      resetCountdown()
      await ensureLogin()
      emit('after-submit')
    }
    catch (err) {
      console.log('## error', err)
      const msg = Object.values(err.data).join(' | ')
      snackbar.error(msg, 'Đăng ký thất bại!')
    }
  }

const clearForm = () => {
  inputOtp.value = ''
}
  const onOTPReady = (value) => {
    inputOtp.value = value
    if (value.length == OTP_LENGTH) {
      onSubmit()
    }
    
  }

  onUnmounted(() => {
    clearForm()
  })

  defineExpose({
    clearForm
  })
</script>