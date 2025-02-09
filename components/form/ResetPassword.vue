<template>
    <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
      <div class="text-slate-800 dark:text-white text-sm">
        <p>
          Mã OTP đã được gửi tới email <strong>{{ data.username }}</strong> của bạn.
          Vui lòng nhập OTP nhận được vào bên dưới
        </p>
      </div>
      <div>
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu mới</label>
        <input type="password" name="password" id="password" placeholder="••••••••" v-model="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required="">
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
  
    const snackbar = useMySnackBar()
    const password = ref('')
  
    const OTP_LENGTH = 6
    const busy = ref(false)
    const inputOtp = ref('')
  
    const verify = async (username, password, code) => {
      busy.value = true
      const { data, error } = await useAPI().post('/auth/reset_password/', {
        username,
        password,
        code
      })
      busy.value = false
      if (error.value) {
        throw error.value
      }
      return data.value
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
          password.value,
          inputOtp.value
        )
        snackbar.success('Mật khẩu đã được khôi phục thành công!')
        resetCountdown()
        emit('after-submit')
      }
      catch (err) {
        console.log('## error', err)
        const msg = Object.values(err.data).join(' | ')
        snackbar.error(msg, 'Xác thực thất bại!')
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