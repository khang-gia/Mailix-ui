<template>
    <UCard class="bg-pink-50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-900">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 text-pink-500 font-bold">
                <UIcon name="i-heroicons-cake" class="w-5 h-5" />
                <span>Sinh nhật sắp tới</span>
            </div>
            <UButton icon="i-heroicons-chevron-right" color="gray" variant="ghost" size="xs" />
        </div>

        <div class="text-center py-4">
            <div class="flex justify-center -space-x-2 mb-3">
                <UAvatar v-for="user in birthdays" :key="user.id" :src="user.avatar" :alt="user.name" size="md"
                    class="ring-2 ring-white dark:ring-gray-900" />
                <div v-if="remainingCount > 0"
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 ring-2 ring-white dark:ring-gray-900 text-xs font-medium text-gray-500">
                    +{{ remainingCount }}
                </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300">
                Sắp tới là sinh nhật của <span class="font-bold text-green-500">{{ highlightName }}</span>
                <span v-if="remainingCount > 0"> và {{ remainingCount }} người khác</span>
            </p>
        </div>
    </UCard>
</template>

<script setup>
const birthdays = [
    { id: 1, name: 'Trương Thanh Tuấn', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'User 2', avatar: 'https://i.pravatar.cc/150?u=2' },
]
const highlightName = 'Trương Thanh Tuấn'
const remainingCount = 17
</script>
