<template>
    <div class="flex gap-2 overflow-x-auto pb-2">
        <UButton v-for="filter in filters" :key="filter.label" :label="filter.label" size="sm"
            :variant="filter.active ? 'solid' : 'ghost'" :color="filter.active ? 'white' : 'gray'"
            class="rounded-full px-4" :class="{ 'bg-white shadow-sm text-primary-500': filter.active }" />
    </div>
</template>

<script setup>
const filters = [
    { label: 'Tất cả', active: true },
    { label: 'Liên quan', active: false },
    { label: 'Công ty', active: false },
    { label: 'Từ nhóm', active: false },
    { label: 'Bình chọn', active: false },
]
</script>
