<template>
    <div class="space-y-4 h-full overflow-x-auto mb-4">
        <!-- Top-level comments only -->
        <div v-for="comment in topLevelComments" :key="comment.id" class="h-full">
            <!-- Top-level comment -->
            <div class="flex w-full">
                <NuxtLink v-if="comment.user.profile_hr"
                    :to="{ name: 'hr-id', params: { id: comment.user.profile_hr.id } }">
                    <UAvatar :src="comment.user.avatar" :alt='comment.user.display_name' />
                </NuxtLink>
                <UAvatar v-else :src="comment.user.avatar" :alt='comment.user.display_name' />
                <div class="pl-1 flex-1">
                    <div class="bg-slate-200 rounded-lg py-1 px-2">
                        <NuxtLink v-if="comment.user.profile_hr"
                            :to="{ name: 'hr-id', params: { id: comment.user.profile_hr.id } }">
                            <p class="font-semibold text-sm">{{ comment.user.display_name }}</p>
                        </NuxtLink>
                        <p v-else class="font-semibold text-sm">{{ comment.user.display_name }}</p>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">
                            {{ comment.text }}
                        </p>
                        <!-- Attachment Display -->
                        <div v-if="comment.attachment" class="mt-2">
                            <!-- Image Attachment -->
                            <img v-if="comment.attachment.file_type === 'image'" :src="comment.attachment.file"
                                :alt="comment.attachment.filename"
                                class="max-w-xs rounded cursor-pointer hover:opacity-90"
                                @click="window.open(comment.attachment.file, '_blank')" />
                            <!-- File Attachment -->
                            <a v-else :href="comment.attachment.file" target="_blank"
                                class="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                <UIcon :name="getFileIcon(comment.attachment.filename)" class="w-5 h-5" />
                                <span>{{ comment.attachment.filename }}</span>
                            </a>
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-x-4 mt-1 pl-2 text-xs w-fit">
                        <span class=" text-gray-500">
                            {{ formatCommentTime(comment.created_at) }}
                        </span>
                        <span class="cursor-pointer hover:underline"
                            :class="{ 'text-mailix-primary font-semibold': comment.is_liked_by_you }"
                            @click.prevent="interactComment(comment)">{{ $t('Like') }}</span>
                        <!-- Reply button only for top-level comments -->
                        <span class="cursor-pointer hover:underline text-gray-600" @click="startReply(comment.id)">{{
                            $t('Reply') }}</span>
                        <div v-if="comment.likes && comment.like_count > 0">
                            <UButton icon="i-heroicons-hand-thumb-up-solid" color="primary" size="xs" variant="ghost"
                                square trailing :label="comment.like_count"></UButton>
                        </div>
                        <!-- Reply count -->
                        <span v-if="comment.reply_count > 0" class="text-gray-500">
                            {{ comment.reply_count }} {{ comment.reply_count === 1 ? $t('reply') : $t('replies') }}
                        </span>
                    </div>

                    <!-- Nested Replies -->
                    <div v-if="comment.replies && comment.replies.length > 0"
                        class="ml-8 mt-3 space-y-3 border-l-2 border-gray-200 pl-3">
                        <div v-for="reply in comment.replies" :key="reply.id" class="flex w-full">
                            <NuxtLink v-if="reply.user.profile_hr"
                                :to="{ name: 'hr-id', params: { id: reply.user.profile_hr.id } }">
                                <UAvatar :src="reply.user.avatar" :alt='reply.user.display_name' size="sm" />
                            </NuxtLink>
                            <UAvatar v-else :src="reply.user.avatar" :alt='reply.user.display_name' size="sm" />
                            <div class="pl-1 flex-1">
                                <div class="bg-gray-100 rounded-lg py-1 px-2">
                                    <NuxtLink v-if="reply.user.profile_hr"
                                        :to="{ name: 'hr-id', params: { id: reply.user.profile_hr.id } }">
                                        <p class="font-semibold text-sm">{{ reply.user.display_name }}</p>
                                    </NuxtLink>
                                    <p v-else class="font-semibold text-sm">{{ reply.user.display_name }}</p>
                                    <p class="text-gray-700 dark:text-gray-300 text-sm">
                                        {{ reply.text }}
                                    </p>
                                    <!-- Attachment Display in Reply -->
                                    <div v-if="reply.attachment" class="mt-2">
                                        <!-- Image Attachment -->
                                        <img v-if="reply.attachment.file_type === 'image'" :src="reply.attachment.file"
                                            :alt="reply.attachment.filename"
                                            class="max-w-xs rounded cursor-pointer hover:opacity-90"
                                            @click="window.open(reply.attachment.file, '_blank')" />
                                        <!-- File Attachment -->
                                        <a v-else :href="reply.attachment.file" target="_blank"
                                            class="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                            <UIcon :name="getFileIcon(reply.attachment.filename)" class="w-5 h-5" />
                                            <span>{{ reply.attachment.filename }}</span>
                                        </a>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center gap-x-4 mt-1 pl-2 text-xs w-fit">
                                    <span class=" text-gray-500">
                                        {{ formatCommentTime(reply.created_at) }}
                                    </span>
                                    <span class="cursor-pointer hover:underline"
                                        :class="{ 'text-mailix-primary font-semibold': reply.is_liked_by_you }"
                                        @click.prevent="interactComment(reply)">{{ $t('Like') }}</span>
                                    <!-- NO Reply button for replies -->
                                    <div v-if="reply.likes && reply.like_count > 0">
                                        <UButton icon="i-heroicons-hand-thumb-up-solid" color="primary" size="xs"
                                            variant="ghost" square trailing :label="reply.like_count"></UButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reply Input Box (shown when replying to this comment) -->
                    <div v-if="replyingTo === comment.id" class="ml-8 mt-2">
                        <!-- File Preview for Reply -->
                        <div v-if="selectedReplyFile"
                            class="mb-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div class="flex items-center gap-2">
                                <img v-if="replyFilePreviewUrl" :src="replyFilePreviewUrl" alt="Preview"
                                    class="w-12 h-12 object-cover rounded" />
                                <div v-else class="flex items-center gap-2">
                                    <UIcon :name="getFileIcon(selectedReplyFile.name)" class="w-6 h-6 text-gray-500" />
                                    <span class="text-xs text-gray-700 dark:text-gray-300">{{ selectedReplyFile.name
                                        }}</span>
                                </div>
                                <UButton icon="i-heroicons-x-mark" size="2xs" color="red" variant="ghost"
                                    @click="removeReplyFile" />
                            </div>
                        </div>

                        <UInput v-model="replyText" type="text" :placeholder="$t('Write a reply...')"
                            @keyup.enter="submitReply(comment.id)" size="sm" class="w-full" :ui="{
                                color: {
                                    white: {
                                        outline: 'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-1 focus:ring-inset focus:ring-gray-300 dark:focus:ring-gray-700'
                                    },
                                },
                                icon: {
                                    trailing: {
                                        pointer: ''
                                    },
                                    leading: {
                                        wrapper: 'flex items-center justify-center',
                                        pointer: ''
                                    }
                                }
                            }">
                            <template #leading>
                                <!-- Attach File Button for Reply -->
                                <UButton icon="i-heroicons-paper-clip" size="2xs" color="gray" variant="ghost"
                                    @click="openReplyFileInput" :padded="false" />
                            </template>
                            <template #trailing>
                                <div class="flex gap-1">
                                    <UButton :padded="false" :disabled="!replyText && !selectedReplyFile" color="blue"
                                        variant="link" icon="i-heroicons-paper-airplane-20-solid"
                                        @click="submitReply(comment.id)" />
                                    <UButton :padded="false" color="gray" variant="link"
                                        icon="i-heroicons-x-mark-20-solid" @click="cancelReply" />
                                </div>
                            </template>
                        </UInput>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main comment input -->
    <div class="mt-2">
        <!-- File Preview (if file selected) -->
        <div v-if="selectedFile" class="mb-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="flex items-center gap-2">
                <!-- Image Preview -->
                <img v-if="filePreviewUrl" :src="filePreviewUrl" alt="Preview" class="w-16 h-16 object-cover rounded" />
                <!-- File Icon -->
                <div v-else class="flex items-center gap-2">
                    <UIcon :name="getFileIcon(selectedFile.name)" class="w-8 h-8 text-gray-500" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ selectedFile.name }}</span>
                </div>
                <!-- Remove Button -->
                <UButton icon="i-heroicons-x-mark" size="xs" color="red" variant="ghost" @click="removeFile" />
            </div>
        </div>

        <!-- Hidden File Input -->
        <input ref="fileInputRef" type="file" class="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
            @change="handleFileSelect" />

        <UInput v-model="newComment" type="text" :placeholder="$t(placeholder)" @keyup.enter="writeComment" size="md"
            class="w-full" :ui="{
                color: {
                    white: {
                        outline: 'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-1 focus:ring-inset focus:ring-gray-300 dark:focus:ring-gray-700'
                    },
                },

                icon: {
                    trailing: {
                        pointer: ''
                    },
                    leading: {
                        wrapper: 'flex items-center justify-center',
                        pointer: ''
                    }
                }
            }">
            <template #leading>
                <!-- Attach File Button -->
                <UButton icon="i-heroicons-paper-clip" size="xs" color="gray" variant="ghost" @click="openFileInput"
                    :padded="false" />
            </template>
            <template #trailing>
                <UButton :padded="false" :disabled="!newComment && !selectedFile" color="blue" variant="link"
                    icon="i-heroicons-paper-airplane-20-solid" @click="writeComment" />
            </template>
        </UInput>
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { data: userInfo } = useAuth()

const { t } = useI18n();
const dayjs = useDayjs()
const props = defineProps({
    commentType: {
        type: String,
        required: true,
        default: 'works',
    },
    id: {
        type: String,
        required: false,
    },
    placeholder: {
        type: String,
        required: false,
        default: 'Write a discussion...',
    },
    useTimeAgo: {
        type: Boolean,
        required: false,
        default: false,
    },
})
const emit = defineEmits(['onAddComment'])
const apiUrl = computed(() => {
    const id = props.id || useRoute().params.id
    switch (props.commentType) {
        case 'works':
            return `core/works/${id}/comments/`
        case 'contacts':
            return `core/contacts/${id}/comments/`
        case 'customers':
            return `core/customers/${id}/comments/`
        case 'social':
            return `social/posts/${id}/comments/`
        default:
            console.warn(`Unknown commentType: ${props.commentType}`)
            return null
    }
})
const { data: comments, refresh } = await useAPI().get(apiUrl);
const newComment = ref('')

// Reply state management
const replyingTo = ref(null)  // ID of comment being replied to
const replyText = ref('')     // Text of the reply

// File upload state management
const selectedFile = ref(null)  // Selected file for main comment
const selectedReplyFile = ref(null)  // Selected file for reply
const filePreviewUrl = ref(null)  // Preview URL for main comment file
const replyFilePreviewUrl = ref(null)  // Preview URL for reply file
const fileInputRef = ref(null)  // Reference to hidden file input

// Filter to show only top-level comments (parent is null)
const topLevelComments = computed(() => {
    if (!comments.value) return []
    return comments.value.filter(comment => comment.parent === null)
})

// Format comment time based on useTimeAgo prop
const formatCommentTime = (timestamp) => {
    if (props.useTimeAgo) {
        return dayjs(timestamp).fromNow()
    }
    return dayjs(timestamp).format('MMM D, YYYY h:mm A')
}

// File upload helper functions
const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
        // Validate file size (10MB for images, 25MB for documents)
        const maxSize = file.type.startsWith('image/') ? 10 * 1024 * 1024 : 25 * 1024 * 1024
        if (file.size > maxSize) {
            const maxSizeMB = file.type.startsWith('image/') ? '10MB' : '25MB'
            alert(t('File size exceeds maximum allowed size of {size}', { size: maxSizeMB }))
            return
        }

        selectedFile.value = file

        // Generate preview for images
        if (file.type.startsWith('image/')) {
            filePreviewUrl.value = URL.createObjectURL(file)
        }
    }
}

const handleReplyFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
        // Validate file size
        const maxSize = file.type.startsWith('image/') ? 10 * 1024 * 1024 : 25 * 1024 * 1024
        if (file.size > maxSize) {
            const maxSizeMB = file.type.startsWith('image/') ? '10MB' : '25MB'
            alert(t('File size exceeds maximum allowed size of {size}', { size: maxSizeMB }))
            return
        }

        selectedReplyFile.value = file

        // Generate preview for images
        if (file.type.startsWith('image/')) {
            replyFilePreviewUrl.value = URL.createObjectURL(file)
        }
    }
}

const removeFile = () => {
    selectedFile.value = null
    if (filePreviewUrl.value) {
        URL.revokeObjectURL(filePreviewUrl.value)
        filePreviewUrl.value = null
    }
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}

const removeReplyFile = () => {
    selectedReplyFile.value = null
    if (replyFilePreviewUrl.value) {
        URL.revokeObjectURL(replyFilePreviewUrl.value)
        replyFilePreviewUrl.value = null
    }
    if (replyFileInputRef.value) {
        replyFileInputRef.value.value = ''
    }
}

const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase()
    const iconMap = {
        pdf: 'i-heroicons-document-text',
        doc: 'i-heroicons-document',
        docx: 'i-heroicons-document',
        xls: 'i-heroicons-table-cells',
        xlsx: 'i-heroicons-table-cells',
        txt: 'i-heroicons-document-text',
        csv: 'i-heroicons-table-cells',
        zip: 'i-heroicons-archive-box'
    }
    return iconMap[ext] || 'i-heroicons-document'
}

// Helper methods to open file inputs
const openFileInput = () => {
    fileInputRef.value?.click()
}

const openReplyFileInput = () => {
    // Create a temporary file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip'
    input.onchange = (event) => handleReplyFileSelect(event)
    input.click()
}

// Start replying to a comment
const startReply = (commentId) => {
    replyingTo.value = commentId
    replyText.value = ''
}

// Cancel reply
const cancelReply = () => {
    replyingTo.value = null
    replyText.value = ''
    removeReplyFile()  // Clean up reply file
}

// Submit a reply
const submitReply = async (parentId) => {
    if (!replyText.value.trim() && !selectedReplyFile.value) return

    try {
        const apiPath = typeMapping[props.commentType]
        if (!apiPath) {
            console.error(`Invalid commentType: ${props.commentType}`)
            throw new Error(t('Invalid comment type'))
        }
        const endpoint = `${apiPath}/`

        // Use FormData if file is attached
        let payload
        if (selectedReplyFile.value) {
            payload = new FormData()
            payload.append('text', replyText.value)
            payload.append('user', userInfo.value.id)
            payload.append('parent', parentId)
            payload.append(mappingForeignKey[props.commentType], props.id || useRoute().params.id)
            payload.append('attachment', selectedReplyFile.value)
        } else {
            payload = {
                text: replyText.value,
                user: userInfo.value.id,
                parent: parentId,
                [mappingForeignKey[props.commentType]]: props.id || useRoute().params.id,
            }
        }

        const response = await useAPI().post(endpoint, payload)

        if (response && response.status.value === 'success') {
            console.log('Reply API Response:', response.data.value)

            // Find the parent comment and add the new reply to its replies array
            const parentComment = comments.value.find(c => c.id === parentId)
            if (parentComment && response.data.value) {
                // Check if response has full nested data (user object)
                if (response.data.value.user && typeof response.data.value.user === 'object') {
                    // Response has full data, use optimistic update
                    if (!parentComment.replies) {
                        parentComment.replies = []
                    }
                    parentComment.replies.push(response.data.value)
                    parentComment.reply_count = (parentComment.reply_count || 0) + 1
                    console.log('Using optimistic update')
                } else {
                    // Response missing nested data, fallback to refresh
                    console.log('Response missing nested data, using refresh()')
                    await refresh()
                }
            }

            replyText.value = ''
            removeReplyFile()
            replyingTo.value = null
            emit('onAddComment')
            return true
        } else {
            throw new Error(t('Unexpected response status'))
        }
    } catch (error) {
        console.error('Error creating reply:', error)
        throw error
    }
}

const typeMapping = {
    works: 'core/work_comments',
    contacts: 'core/customer_comments',
    customers: 'core/customer_comments',
    social: 'social/post_comments',
};
const interactComment = async (comment) => {
    try {
        const apiPath = typeMapping[props.commentType];

        if (!apiPath) {
            console.error(`Invalid commentType: ${props.commentType}`);
            throw new Error(t('Invalid comment type'));
        }
        const endpoint = `${apiPath}/${comment.id}/interact/`;

        const response = await useAPI().post(endpoint);
        if (response && response.status.value === 'success') {
            comment.is_liked_by_you = !comment.is_liked_by_you
            if (comment.is_liked_by_you) {
                comment.likes.push({ ...userInfo.value });
                comment.like_count += 1;
            } else {
                comment.likes = comment.likes.filter(like => like.id !== userInfo.value.id);
                comment.like_count -= 1;
            }
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error interacting with comment:', error);
        throw error;
    }
}
const mappingForeignKey = {
    works: 'work',
    contacts: 'customer',
    customers: 'customer',
    social: 'post',
}
const writeComment = async () => {
    try {
        const apiPath = typeMapping[props.commentType];
        // Allow comment if either text OR file is present
        if (!apiPath || (!newComment.value && !selectedFile.value)) {
            console.error(`Invalid commentType: ${props.commentType}`);
            throw new Error(t('Invalid comment type'));
        }
        const endpoint = `${apiPath}/`;

        // Use FormData if file is attached
        let payload
        if (selectedFile.value) {
            payload = new FormData()
            payload.append('text', newComment.value)
            payload.append('user', userInfo.value.id)
            payload.append(mappingForeignKey[props.commentType], props.id || useRoute().params.id)
            payload.append('attachment', selectedFile.value)
        } else {
            payload = {
                text: newComment.value,
                user: userInfo.value.id,
                [mappingForeignKey[props.commentType]]: props.id || useRoute().params.id,
            }
        }

        const response = await useAPI().post(endpoint, payload);

        if (response && response.status.value === 'success') {
            newComment.value = '';
            removeFile()
            refresh()
            emit('onAddComment')
            return true
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
}
</script>