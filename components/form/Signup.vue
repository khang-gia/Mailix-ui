<template>
    <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
        <div>
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên của bạn</label>
            <input name="name" id="name" type="text" v-model="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Tên của bạn" required="">
        </div>
        <div class="flex flex-row space-x-4">
            <div class="w-1/2">
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email của bạn</label>
                <input name="username" id="username" type="email" v-model="username"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Email" required="">
            </div>
            <div class="w-1/2">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu</label>
                <input type="password" name="password" id="password" placeholder="••••••••" v-model="password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required="">
            </div>
        </div>
        <BaseButton
            :busy="busy"
            type="submit"
            class="w-full text-white bg-primary-600 enabled:hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm dark:bg-primary-600 enabled:dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75"
            text="Tiếp theo"></BaseButton>
        
        <!-- <GoogleSigninButton /> -->

        <div class="text-sm font-light text-gray-500 dark:text-gray-400">
            Bạn đã có tài khoản? <button type="button" @click.stop="onSignin"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500">Đăng nhập</button>
        </div>
    </form>
</template>

<script setup>

const emit = defineEmits(['on-signin', 'after-submit', 'on-otp-verify'])
const username = ref('')
const password = ref('')
const first_name = ref('')
const snackbar = useMySnackBar()
const busy = ref(false)
const signup = async (info) => {
    const { data, error } = await useAPI().post('/auth/register/', info)

    if (error.value) {
        throw error.value
    }

    return data.value
}

const onSubmit = async () => {
    try {
        busy.value = true
        const res = await signup({
            username: username.value,
            password: password.value,
            first_name: first_name.value
        })
        console.log(res)
        // snackbar.success('Một Email đã được gửi tới hộp thư của bạn. Vui lòng kiểm tra và nhập mã OTP để hoàn tất đăng ký.')
        // emit('on-otp-verify', {
        //     username: username.value,
        //     password: password.value,
        // })
        snackbar.success('Đăng ký thành công')
        emit('on-signin')
    }
    catch (err) {
        console.log('## error', err)
        const msg = Object.values(err.data).join(' | ')

        snackbar.error(msg, 'Đăng ký thất bại!')
    }
    busy.value = false
    
}
const onSignin = () => {
    emit('on-signin')
}

const clearForm = () => {
    username.value = ''
    password.value = ''
    first_name.value = ''
}

onUnmounted(() => {
    clearForm()
})

defineExpose({
    clearForm
})
</script>