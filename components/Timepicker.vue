<template>
    <div class="relative">
        <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-1 pointer-events-none">
        </div>
        <input v-model="time" type="time" id="time" class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" required />
    </div>
</template>
<script setup>
const time = defineModel({ default: '00:00' })
</script>