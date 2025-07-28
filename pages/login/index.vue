<template>
    <div class=" h-full transition-all duration-500 hover:scale-[1.02] space-y-12">
        <!-- <div class="p-2">
            <img src="/images/logo/positive/name.png" alt="Logo" class="h-20">
        </div> -->
        <h1 class="text-2xl font-medium text-left font-averta text-black">Đăng nhập.</h1>
        <p class="text-center text-gray-500 mb-5"></p>
        <form v-if="authMode === 'signin'" @submit.stop.prevent="onLoginSubmit" novalidate="novalidate" @submit="_signinNoOTP">
            <div class="relative mb-4">
                <div class="relative">
                    <input ref="usernameInput" v-model="creds.username" name="username" id="username" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0313B0] pl-10" placeholder="Tên đăng nhập">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <UIcon name="heroicons:user-circle" class="w-5 h-5 text-gray-400"></UIcon>
                    </div>
                </div>
            </div>
            <div class="relative mt-4 mb-4">
                <div class="relative">
                    <input v-model="creds.password" :type="showPassword ? 'text':'password'" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0313B0] pl-10" placeholder="Mật khẩu">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <UIcon name="heroicons:lock-closed" class="w-5 h-5 text-gray-400"></UIcon>
                    </div>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-1">
                        <UButton type="button" variant="ghost" color="white" @click="togglePasswordVisibility" class="text-gray-500 focus:outline-none">
                            <UIcon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5"></UIcon>
                        </UButton>
                    </div>
                </div>
            </div>
            <div class="flex justify-between items-center mt-4">
                <div>
                    <!-- <input class="mr-2" type="checkbox" value="" id="flexCheckDefault">
                    <label class="text-gray-600" for="flexCheckDefault">
                        Ghi nhớ tôi
                    </label> -->
                </div>
                <div>
                    <!-- <button type="button" @click="onForgotPassword" class="text-sm text-blue-500 hover:underline">
                        Quên mật khẩu?
                    </button> -->
                    <a href="/login/forgot-password" class="text-sm text-[#0313B0] hover:underline">
                        Quên mật khẩu?
                    </a>
                </div>
            </div>
            <button class="p-2 w-full text-white py-2 px-4 rounded-lg shadow-lg mt-10 bg-[#0313B0] hover:bg-[#020B51] transition duration-300">ĐĂNG NHẬP</button>
        </form>
        <form  v-else-if="authMode === 'otp'" class="space-y-4 md:space-y-6" @submit.prevent="onSubmitOTP">
            <div class="text-slate-800 dark:text-white text-sm">
            <p>
                Vui lòng nhập mã chúng tôi đã gửi cho bạn qua email <strong>{{ userEmail }}</strong>.
                Mã OTP có hiệu lực trong vòng 2 phút.
            </p>
            </div>
            <div>
            <FormOTPInput :length="OTP_LENGTH" @input="onOTPReady"></FormOTPInput>
            </div>
            <UCheckbox
                v-model="trustDevice"
                class="text-slate-800 dark:text-white"
                :label="$t('Trust this device')"/>
            <BaseButton
            type="submit"
            class="w-full text-white bg-primary-600 enabled:hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm dark:bg-primary-600 enabled:dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            :busy="busy"
            :disabled="inputOtp.length<OTP_LENGTH"
            text="Xác nhận"></BaseButton>
            
            <div class="w-full flex items-center justify-between text-sm">
            <button
                type="button"
                @click="resendOtp"
                :disabled="timeout>0"
                class="font-medium enabled:text-primary-600 disabled:text-grey-500 hover:underline dark:enabled:text-primary-500 dark:disabled:text-gray-500">
                Gửi lại mã
                <span v-if="timeout>0">({{ timeout }}s)</span>
            </button>
            </div>

        </form>
        <p class="text-xs text-gray-400 text-center mt-4">© 2025 Mailix. All rights reserved.</p>
    </div>
</template>
<script setup>
definePageMeta({
  title: 'ĐĂNG NHẬP',
})
const emit = defineEmits(['on-signup', 'after-submit', 'on-forgot-password', 'on-otp-verify'])
const authMode = ref('signin')
const showPassword = ref(false)
const userEmail = ref('')
const creds = ref({
    username: '',
    password: ''
})
const inputOtp = ref('')
const OTP_LENGTH = 6
const busy = ref(false)
const trustDevice = ref(false)
const snackbar = useMySnackBar()
const { signIn, status } = useAuth()
const preSignIn = async (creds) => {
    const { data, error } = await useAPI().post('/auth/login/', {
        username: creds.username,
        password: creds.password,
        withCredentials: true
    })
    busy.value = false
    if (error.value) {
        throw error.value
    }
    return data.value
}

const onPreLogin = async () => {
    try {
        busy.value = true
        const res = await preSignIn(creds.value)
        // emit('on-otp-verify', {
        //     username: creds.value.username,
        //     password: creds.value.password,
        // })
        userEmail.value = res.email
        authMode.value = 'otp'
        resendCountdown()
    } catch (err) {
        console.log(err)
        snackbar.error('Email hoặc mật khẩu không đúng. Vui lòng thử lại!')
    } 
    busy.value = false
}
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}
const verify = async (username, code, is_trust_device) => {
    busy.value = true
    const { data, error } = await useAPI().post('/auth/otp/verify/', {
      username,
      code,
      is_trust_device
    })
    busy.value = false
    if (error.value) {
      throw error.value
    }
    return data.value
}
const ensureLogin = async () => {
    busy.value = true
    await signIn({
        username: creds.value.username,
        password: creds.value.password,
    }, {
    redirect: false
    })
    busy.value = false
  }
const resendOtp = async () => {
    busy.value = true
    const { data, error } = await useAPI().post('/auth/otp/generate/', {
      username: creds.value.username,
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
const clearOTPForm = () => {
  inputOtp.value = ''
}
const onSubmitOTP = async () => {
    try {
        const res = await verify(
            creds.value.username,
            inputOtp.value,
            trustDevice.value
        )
        snackbar.success('Xác thực thành công.')
        resetCountdown()
        await ensureLogin()
        navigateTo('/me')
    }
    catch (err) {
        console.log('## error', err)
        const msg = Object.values(err.data).join(' | ')
        snackbar.error(msg, 'Xác thực thất bại!')
}
}
const _signinNoOTP = async()=>{
    try {
        // const res = await verify(
        //     creds.value.username,
        //     inputOtp.value,
        //     trustDevice.value
        // )
        // snackbar.success('Xác thực thành công.')
        resetCountdown()
        await ensureLogin()
        navigateTo('/me')
    }
    catch (err) {
        console.log('## error', err)
        const msg = Object.values(err.data).join(' | ')
        snackbar.error(msg, 'Xác thực thất bại!')
}
}
const onOTPReady = (value) => {
    inputOtp.value = value
    if (value.length == OTP_LENGTH) {
        onSubmitOTP()
    }
}

const clearForm = () => {
    creds.value.username = ''
    creds.value.password = ''
}

onUnmounted( () => {
    clearForm()
    clearOTPForm()
})

defineExpose({
    clearForm,
    clearOTPForm
})

</script>