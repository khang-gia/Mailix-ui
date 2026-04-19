<template>
    <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
        <div>
            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('Your email') }}</label>
            <input name="username" id="username" type="email" v-model="username"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Email" required="">
        </div>
        <div>
            <BaseButton
            :busy="busy"
            type="submit"
            class="w-full text-white bg-primary-600 enabled:hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm dark:bg-primary-600 enabled:dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75"
            text="Tiếp theo"></BaseButton>
        </div>
        
    </form>
</template>

<script setup>

const emit = defineEmits(['on-signin', 'after-submit', 'on-reset-password'])
const username = ref('')
const snackbar = useMySnackBar()
const busy = ref(false)
const sendOtp = async (info) => {
    const { data, error } = await useAPI().post('/auth/otp/generate/', info)

    if (error.value) {
        throw error.value
    }

    return data.value
}

const onSubmit = async () => {
    try {
        busy.value = true
        const res = await sendOtp({
            username: username.value,
            view: 'resetpassword'
        })
        console.log(res)
        snackbar.success('Một Email đã được gửi tới hộp thư của bạn. Vui lòng kiểm tra và nhập mã OTP để khôi phục mật khẩu.')
        emit('on-reset-password', {
            username: username.value,
        })
    }
    catch (err) {
        console.log('## error', err)
        const msg = Object.values(err.data).join(' | ')

        snackbar.error(msg, 'Tạo OTP thất bại!')
    }
    busy.value = false
}
const onSignin = () => {
    emit('on-signin')
}

const clearForm = () => {
    username.value = ''
}

onUnmounted(() => {
    clearForm()
})

defineExpose({
    clearForm
})
</script>