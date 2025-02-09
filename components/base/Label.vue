<template>
    <label :for="forId" class="block mb-2 text-sm font-medium text-slate-800 dark:text-slate-400">
        {{ text }}
        <span v-if="required" class="text-red-500">*</span>
    </label>
</template>
<script setup>
    const props = defineProps({
        required: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: ''
        },
        forId: String
    })
</script>