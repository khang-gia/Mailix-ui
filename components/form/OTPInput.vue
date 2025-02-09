<template>
    <div class="flex items-center justify-center space-x-2">
        <input
            v-for="i in length"
            v-model="otpValues[i-1]"
            type="tel"
            maxlength="1"
            class="otp-input w-10 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
            autocomplete="off"
            aria-autocomplete="none"
            @input="handleInput($event)"
            @paste.input.prevent="handlePaste($event)"
            @keyup.backspace="handleBackspace($event)">
        
    </div>
</template>

<script setup>

    const props = defineProps({
        length: {
            type: Number,
            default: 6
        }
    })
    const emit = defineEmits(['input'])
     
    const otpValues = ref([])

    const handleInput = (e) => {
        const input = e.target;
        // focus next input
        if (input.value && input.nextElementSibling) {
            input.nextElementSibling.focus()
        }
        
    }

    function handlePaste(e) {
        let paste = e.clipboardData.getData('text')
        if (paste.length>props.length) {
            paste = paste.substr(0, props.length+1)
        }
        otpValues.value = paste.split('')
    }

    function handleBackspace(e) {                   
        const input = e.target
        // focus previous input
        if (input.previousElementSibling) {
            input.previousElementSibling.focus()
        }
    }

    watchArray(otpValues, (n, o) => {
        if (n != o) {
            emit('input', otpValues.value.join(''))
        }
    }, {deep: true})

    onMounted (() => {
        setTimeout(() => {
            const firstInput = document.querySelector('.otp-input')
            if (firstInput) {
                firstInput.focus()
            }
        }, 200)
        
    })
</script>