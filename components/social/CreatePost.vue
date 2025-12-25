<template>
    <UCard :ui="{ body: { padding: 'p-4' } }">
        <div class="flex gap-3 mb-4">
            <UInput placeholder="Tiêu đề bài viết..." variant="none" class="flex-1 text-lg font-medium" />
            <div class="flex gap-2">
                <UButton icon="i-heroicons-face-smile" color="gray" variant="ghost" />
                <UButton icon="i-heroicons-paper-airplane" color="gray" variant="ghost" />
            </div>
        </div>

        <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
            <div class="flex gap-4">
                <UButton icon="i-heroicons-photo" label="Ảnh/File" color="green" variant="ghost" size="sm" />
                <UButton icon="i-heroicons-document-text" label="Ghi chép" color="blue" variant="ghost" size="sm" />
                <UButton icon="i-heroicons-chart-bar" label="Bình chọn" color="orange" variant="ghost" size="sm" />
            </div>
        </div>
    </UCard>
</template>
