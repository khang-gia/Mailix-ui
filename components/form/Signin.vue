<template>
    <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
        <div>
            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email của bạn</label>
            <input name="username" id="username" type="email" v-model="username"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Email" required="">
        </div>
        <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu</label>
            <input type="password" name="password" id="password" placeholder="••••••••" v-model="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required="">
        </div>
        <div class="flex items-center justify-between">
            <div class="flex items-start">
                
            </div>
            <!-- <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                Quên mật khẩu?</a> -->
            <button
                id="btnForgotPassword"
                type="button"
                @click.stop="onForgotPassword"
                class="font-medium text-sm text-primary-600 hover:underline dark:text-primary-500">
                Quên mật khẩu?
            </button>
        </div>
        <BaseButton
            :busy="busy"
            type="submit"
            class="w-full text-white bg-primary-600 enabled:hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm dark:bg-primary-600 enabled:dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            text="Đăng nhập"></BaseButton>
        

        <GoogleSigninButton />

        <div class="text-sm font-light text-gray-500 dark:text-gray-400">
            Bạn chưa có tài khoản? 
            <button
                type="button"
                @click.stop="onSignup"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Đăng ký
            </button>
        </div>
    </form>
</template>

<script setup>
const emit = defineEmits(['on-signup', 'after-submit', 'on-forgot-password', 'on-otp-verify'])

const username = ref('')
const password = ref('')
const busy = ref(false)
const { signIn, status, data } = useAuth()
const snackbar = useMySnackBar()

const onSubmit = async () => {
    try {
        busy.value = true
        const res = await signIn({
            username: username.value,
            password: password.value,
        }, {
            redirect: false
        })
        snackbar.success('Đăng nhập thành công')
        // if (data.value.profile.email_verified === false) {
        //     emit('on-otp-verify', {
        //         username: username.value,
        //         password: password.value,
        //     })
        // }
        // else{
        //     
        //     emit('after-submit')
        // }
        // reloadNuxtApp()
        reloadNuxtApp()
        emit('after-submit')
        clearForm()
    } catch (err) {
        console.log(err)
        snackbar.error('Email hoặc mật khẩu không đúng. Vui lòng thử lại!')
    } 
    busy.value = false
}
const onSignup = () => {
    emit('on-signup')    
}
const onForgotPassword = () => {
    emit('on-forgot-password')
}
const clearForm = () => {
    username.value = ''
    password.value = ''
}

onUnmounted( () => {
    clearForm()
})

defineExpose({
    clearForm
})

</script>