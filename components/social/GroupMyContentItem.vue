<template>
    <UCard :ui="{ body: { padding: 'p-4' } }">
        <!-- Header -->
        <div class="flex justify-between items-start mb-3">
            <div class="flex gap-3">
                <UAvatar :src="post.author.avatar" :alt="post.author.display_name" />
                <div>
                    <div class="flex items-center gap-1">
                        <span class="font-bold text-gray-900 dark:text-white">
                            {{ post.author.display_name }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-500">
                        <span>{{ formatDate(post.created_at) }}</span>
                        <span>•</span>
                        <UIcon :name="privacyIcons[post.privacy]" class="w-3 h-3" />
                    </div>
                </div>
            </div>

            <!-- Context Menu (Edit/Delete) -->
            <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-end' }">
                <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-ellipsis-horizontal" />
            </UDropdown>
        </div>

        <!-- Content -->
        <div class="mb-4">
            <h3 class="text-lg font-bold mb-3">{{ post.title }}</h3>
            <!-- Post Content -->
            <div v-if="post.content" class="relative mb-3">
                <div ref="contentRef" :class="[
                    'break-words overflow-wrap-anywhere transition-all duration-300',
                    !isExpanded && isTruncated ? 'max-h-[300px] overflow-hidden' : ''
                ]" v-html="post.content"></div>

                <!-- See more button -->
                <button v-if="isTruncated" @click="isExpanded = !isExpanded"
                    class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mt-2">
                    {{ isExpanded ? $t('See less') : $t('See more') }}
                </button>
            </div>

            <!-- Attachments -->
            <div v-if="post.attachments && post.attachments.length > 0">
                <!-- Single image -->
                <img v-if="post.attachments.length === 1 && post.attachments[0].file_type === 'image'"
                    :src="post.attachments[0].file" class="w-full rounded-lg object-cover max-h-96 mb-3 cursor-pointer"
                    @click="openFullscreen" />

                <!-- Grid images -->
                <div v-else-if="imageAttachments.length > 0" :class="getGridClass(imageAttachments.length)"
                    class="gap-1 mb-3">
                    <img v-for="attachment in imageAttachments" :key="attachment.id" :src="attachment.file"
                        class="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90"
                        @click="openFullscreen" />
                </div>

                <!-- Files -->
                <div v-if="fileAttachments.length > 0" class="space-y-2 mb-3">
                    <a v-for="attachment in fileAttachments" :key="attachment.id" :href="attachment.file"
                        target="_blank"
                        class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                        <UIcon :name="getFileIcon(attachment.file_type)" class="w-6 h-6" />
                        <div class="flex-1">
                            <p class="text-sm font-medium">{{ attachment.file_name }}</p>
                            <p class="text-xs text-gray-500">{{ formatFileSize(attachment.file_size) }}</p>
                        </div>
                        <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
                    </a>
                </div>
            </div>
            <!-- Legacy image support -->
            <img v-else-if="post.image" :src="post.image" class="w-full rounded-lg mb-3 object-cover max-h-96" />

            <!-- Poll (Simplified view) -->
            <div v-if="post.post_type === 2 && post.poll_options"
                class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-gray-500" />
                    <span class="text-sm font-medium text-gray-600">{{ $t('Poll attached') }}</span>
                </div>
                <p class="text-sm">{{ post.poll_options.length }} {{ $t('options') }}</p>
            </div>
        </div>

        <!-- Action Button -->
        <div v-if="post.status !== 4" class="pt-3 border-t border-gray-100 dark:border-gray-800">
            <UButton v-if="post.status === 7" :label="$t('Edit post')" block color="gray" variant="solid"
                @click="editPost" />
            <UButton v-else :label="$t('View in group')" block color="gray" variant="solid" @click="openPost" />
        </div>
    </UCard>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['postDeleted'])
const { t } = useI18n()

const modalStore = useModalStore()
const { setSocialCreatePostModal, setAlertModal, setSocialCommentModalFullscreen, setSocialCommentModal } = modalStore
const { alertConfirm, alertModal } = storeToRefs(modalStore)
const { data: userInfo } = useAuth()

// Content truncation
const contentRef = ref(null)
const isExpanded = ref(false)
const isTruncated = ref(false)

onMounted(() => {
    if (contentRef.value) {
        const contentHeight = contentRef.value.scrollHeight
        isTruncated.value = contentHeight > 300
    }
})

const imageAttachments = computed(() => {
    return props.post.attachments?.filter(a => a.file_type === 'image') || []
})

const fileAttachments = computed(() => {
    return props.post.attachments?.filter(a => a.file_type !== 'image') || []
})

const getGridClass = (count) => {
    if (count === 2) return 'grid grid-cols-2'
    if (count === 3) return 'grid grid-cols-3'
    if (count === 4) return 'grid grid-cols-2'
    return 'grid grid-cols-3'
}

const getFileIcon = (type) => {
    const icons = {
        'pdf': 'i-heroicons-document-text',
        'document': 'i-heroicons-document',
        'video': 'i-heroicons-film',
        'image': 'i-heroicons-photo'
    }
    return icons[type] || 'i-heroicons-document'
}

const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (date) => {
    if (!date) return ''
    return dayjs(date).format('HH:mm DD/MM/YYYY')
}

const privacyIcons = {
    1: 'i-heroicons-globe-alt',
    2: 'i-heroicons-lock-closed',
    3: 'i-heroicons-users',
}

const openPost = () => {
    setSocialCommentModal(true, props.post)
}

const editPost = () => {
    setSocialCreatePostModal(true, props.post.post_type, props.post.social_group, props.post)
}

const deletePost = async () => {
    try {
        const response = await useAPI().del(`social/posts/${props.post.id}/`);
        if (response && response.status.value === 'success') {
            return true;
        } else {
            throw new Error('Unexpected response status');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}

const dropdownItems = computed(() => [
    [{
        label: t('Edit post'),
        icon: 'i-heroicons-pencil-square',
        click: () => {
            setSocialCreatePostModal(true, props.post.post_type, props.post.social_group, props.post)
        }
    },
    {
        label: t('Delete post'),
        icon: 'i-heroicons-trash',
        click: () => {
            setAlertModal(true, {
                message: t('Are you sure you want to delete this post?'),
                confirmButton: t('OK'),
                denyButton: t('No'),
            })
            const unwatch = watch(
                () => alertModal.value,
                async (newVal) => {
                    if (!newVal) {
                        if (alertConfirm.value) {
                            const isDeleted = await deletePost();
                            if (isDeleted) {
                                emit('postDeleted', props.post.id);
                            }
                        }
                        unwatch();
                    }
                }
            )
        }
    }]
])
</script>
