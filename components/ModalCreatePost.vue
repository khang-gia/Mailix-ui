<template>
    <UModal v-model="socialCreatePostModal" :ui="{ width: 'w-full sm:max-w-4xl' }" class="font-averta">
        <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'px-6 py-4' } }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">
                        {{ modalTitle }}
                    </h3>
                    <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="closeModal"
                        :disabled="isSubmitting" />
                </div>
            </template>

            <UForm :schema="schema" :state="postData" class="space-y-4">
                <!-- Privacy Selector -->
                <div class="flex justify-end"
                    v-if="socialCreatePostData ? !socialCreatePostData.social_group : !socialCreatePostGroupId">
                    <USelectMenu v-model="postData.privacy" :options="privacyOptions" value-attribute="value"
                        option-attribute="label" class="w-36">
                        <template #label>
                            <div class="flex items-center gap-2 text-xs font-normal">
                                <UIcon :name="privacyOptions.find(o => o.value === postData.privacy)?.icon"
                                    class="w-4 h-4" />
                                <span class="truncate">{{privacyOptions.find(o => o.value ===
                                    postData.privacy)?.label}}</span>
                            </div>
                        </template>
                        <template #option="{ option }">
                            <span class="flex items-center gap-2">
                                <UIcon :name="option.icon" class="w-4 h-4" />
                                {{ option.label }}
                            </span>
                        </template>
                    </USelectMenu>
                </div>

                <!-- Post Title -->
                <UFormGroup v-slot="{ error }" :label="postData.post_type === 2 ? t('Poll title') : t('Post title')"
                    name="title" :error="errors.title" required>
                    <UInput v-model="postData.title"
                        :placeholder="postData.post_type === 2 ? t('Poll title') : t('Post title')" size="lg"
                        class="text-lg font-medium"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                </UFormGroup>

                <!-- Post Content (for regular posts and announcements) -->
                <UFormGroup v-if="postData.post_type === 1 || postData.post_type === 3" :label="t('Content')"
                    name="content">
                    <client-only>
                        <RickTextEditor v-model="postData.content" :placeholder="t('What\'s on your mind?')" />
                    </client-only>
                </UFormGroup>

                <!-- Poll Options (only for polls) -->
                <div v-if="postData.post_type === 2" class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        {{ t('Poll options') }}
                    </label>

                    <div v-for="(option, index) in postData.poll_options" :key="index" class="flex items-center gap-2">
                        <UInput v-model="postData.poll_options[index]"
                            :placeholder="t('Poll option') + ' ' + (index + 1)" class="flex-1" />
                        <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="sm"
                            @click="removePollOption(index)" :disabled="postData.poll_options.length <= 1" />
                    </div>

                    <UButton icon="i-heroicons-plus-circle" :label="t('Add option')" color="gray" variant="soft"
                        size="sm" @click="addPollOption" />
                </div>

                <!-- Poll Start & End Date/Time (only for polls) -->
                <div v-if="postData.post_type === 2" class="grid grid-cols-2 gap-4">
                    <UFormGroup :label="t('Poll start time')">
                        <BaseDatePicker v-model="pollStartDateTime" :required="true" class="w-full" mode="datetime"
                            buttonType="outline" :place-holder="t('Poll start time')" :minDate="new Date()" />
                    </UFormGroup>

                    <UFormGroup :label="t('Poll end time')">
                        <BaseDatePicker v-model="pollEndDateTime" :required="true" class="w-full" mode="datetime"
                            buttonType="outline" :place-holder="t('Poll end time')" :minDate="pollStartDateTime" />
                    </UFormGroup>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4 pt-2">
                    <UButton icon="i-heroicons-photo" :label="t('Photo/File')" color="green" variant="ghost" size="sm"
                        @click="triggerFileInput" />
                    <UButton icon="i-heroicons-document-text" :label="t('Note')" color="blue" variant="ghost"
                        size="sm" />
                    <UButton icon="i-heroicons-chart-bar" :label="t('Poll')"
                        :color="postData.post_type === 2 ? 'orange' : 'orange'"
                        :variant="postData.post_type === 2 ? 'solid' : 'ghost'" size="sm" @click="togglePollMode"
                        :disabled="!!socialCreatePostData" /> <!-- Disable switching type when editing -->
                    <UButton icon="i-heroicons-megaphone" :label="t('Announcement')"
                        :color="postData.post_type === 3 ? 'red' : 'red'"
                        :variant="postData.post_type === 3 ? 'solid' : 'ghost'" size="sm"
                        @click="toggleAnnouncementMode" :disabled="!!socialCreatePostData || isCenterPage" />
                    <!-- Disable switching type when editing -->
                </div>

                <!-- Pin Toggle (only for announcements) -->
                <div v-if="postData.post_type === 3" class="flex items-center gap-2 pt-3">
                    <UToggle v-model="postData.is_pinned" />
                    <label class="text-sm font-medium cursor-pointer" @click="postData.is_pinned = !postData.is_pinned">
                        {{ t('Pin this announcement') }}
                    </label>
                </div>

                <!-- Files Preview Grid -->
                <div v-if="filePreviews.length > 0" class="mt-4 grid grid-cols-2 gap-2">
                    <div v-for="(preview, index) in filePreviews" :key="index" class="relative">
                        <!-- Image preview -->
                        <img v-if="preview.type === 'image'" :src="preview.url"
                            class="w-full h-40 object-cover rounded-lg" />

                        <!-- File preview -->
                        <div v-else
                            class="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center p-4">
                            <UIcon :name="getFileIcon(preview.type)" class="w-12 h-12 text-gray-400 mb-2" />
                            <p class="text-xs text-center truncate w-full">{{ preview.name }}</p>
                            <p class="text-xs text-gray-500">{{ formatFileSize(preview.size) }}</p>
                        </div>

                        <!-- Remove button -->
                        <button @click="removeFile(index)"
                            class="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <!-- Hidden file input -->
                <input ref="fileInput" type="file" accept="image/*,video/*,.pdf,.doc,.docx" multiple class="hidden"
                    @change="handleFilesSelect" />
            </UForm>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <UButton :label="t('Cancel')" color="gray" variant="ghost" @click="closeModal"
                        :disabled="isSubmitting" />
                    <UButton :label="submitButtonLabel" color="primary" @click="handleSubmit" :loading="isSubmitting" />
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
import * as yup from 'yup'

const { t } = useI18n()
const modalStore = useModalStore()
const { setSocialCreatePostModal } = modalStore
const { socialCreatePostModal, socialCreatePostType, socialCreatePostGroupId, socialCreatePostData } = storeToRefs(modalStore)
const dayjs = useDayjs()
const props = defineProps({
    isCenterPage: {
        type: Boolean,
        default: false
    }
})
const postData = ref({
    title: '',
    content: '',
    post_type: 1, // 1 = post, 2 = poll, 3 = announcement
    poll_options: [''], // Default empty option for polls
    is_pinned: false, // For announcements
    privacy: 1 // 1 = Public, 2 = Only Me
})

const privacyOptions = computed(() => [
    { label: t('Public'), value: 1, icon: 'i-heroicons-globe-alt' },
    { label: t('Only Me'), value: 2, icon: 'i-heroicons-lock-closed' }
])

const modalTitle = computed(() => {
    if (socialCreatePostData.value) {
        if (postData.value.post_type === 2) return t('Edit Poll')
        if (postData.value.post_type === 3) return t('Edit Announcement')
        return t('Edit Post')
    }
    if (postData.value.post_type === 2) return t('Create Poll')
    if (postData.value.post_type === 3) return t('Create Announcement')
    return t('Create Post')
})

const submitButtonLabel = computed(() => {
    if (socialCreatePostData.value) return t('Update')
    if (postData.value.post_type === 2) return t('Create Poll')
    if (postData.value.post_type === 3) return t('Create Announcement')
    return t('Post')
})

// Multiple files upload state
const fileInput = ref(null)
const selectedFiles = ref([])
const filePreviews = ref([])
const deletedAttachmentIds = ref([])

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFilesSelect = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
        selectedFiles.value.push(file)
        if (file.type.startsWith('image/')) {
            filePreviews.value.push({
                url: URL.createObjectURL(file),
                type: 'image',
                name: file.name,
                size: file.size
            })
        } else {
            filePreviews.value.push({
                url: null,
                type: getFileType(file.type),
                name: file.name,
                size: file.size
            })
        }
    })
}

const removeFile = (index) => {
    const file = filePreviews.value[index]
    if (file.isExisting) {
        deletedAttachmentIds.value.push(file.id)
    } else {
        let newFileIndex = 0
        for (let i = 0; i < index; i++) {
            if (!filePreviews.value[i].isExisting) newFileIndex++
        }
        selectedFiles.value.splice(newFileIndex, 1)
    }

    if (file.url && !file.isExisting) {
        URL.revokeObjectURL(file.url)
    }
    filePreviews.value.splice(index, 1)
}



const getFileType = (contentType) => {
    if (contentType.startsWith('image/')) return 'image'
    if (contentType.startsWith('video/')) return 'video'
    if (contentType === 'application/pdf') return 'pdf'
    return 'document'
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

// Set default poll start time to current date + time
const defaultPollStartTime = new Date()
const pollStartDateTime = ref(defaultPollStartTime)

const defaultPollEndTime = new Date()
defaultPollEndTime.setDate(defaultPollEndTime.getDate() + 1)
defaultPollEndTime.setHours(17, 0, 0, 0)
const pollEndDateTime = ref(defaultPollEndTime)

// If user modifies start date to be after end date, update end date to be 1 hour later
watch(pollStartDateTime, (newStart) => {
    if (newStart && pollEndDateTime.value && newStart > pollEndDateTime.value) {
        const newEnd = new Date(newStart)
        newEnd.setHours(newEnd.getHours() + 1)
        pollEndDateTime.value = newEnd
    }
})

const errors = ref({})
const isSubmitting = ref(false)

const emit = defineEmits(['postCreated', 'postUpdated'])

// Yup validation schema
const schema = yup.object({
    title: yup.string().required(t('This field is required')),
})

// Watch for modal opening and set post_type from store
watch(socialCreatePostModal, (newValue) => {
    if (newValue) {
        // When modal opens, set post_type from store
        postData.value.post_type = socialCreatePostType.value

        // Populate data if editing
        if (socialCreatePostData.value) {
            const data = socialCreatePostData.value
            postData.value.title = data.title
            postData.value.content = data.content || ''
            postData.value.post_type = data.post_type
            postData.value.is_pinned = data.is_pinned || false
            postData.value.privacy = data.privacy || 1

            if (data.post_type === 2 && data.poll_options) {
                // Map existing options to string array for editing
                // Note: deeply confusing to edit active polls, but we'll allow text editing
                postData.value.poll_options = data.poll_options.map(opt => opt.option)
                if (data.start_poll) pollStartDateTime.value = new Date(data.start_poll)
                if (data.end_poll) pollEndDateTime.value = new Date(data.end_poll)
            }

            // Populate file previews from existing attachments
            if (data.attachments && data.attachments.length > 0) {
                data.attachments.forEach(att => {
                    filePreviews.value.push({
                        id: att.id, // Keep track of ID
                        url: att.file,
                        type: att.file_type || 'document',
                        name: att.file_name || 'File',
                        size: att.file_size || 0,
                        isExisting: true
                    })
                })
            }
        }
    } else {
        resetForm()
    }
})

const togglePollMode = () => {
    if (postData.value.post_type === 1) {
        postData.value.post_type = 2
        // Initialize with 2 empty options if not already set
        if (postData.value.poll_options.length === 0) {
            postData.value.poll_options = ['', '']
        }
    } else {
        postData.value.post_type = 1
    }
}

const toggleAnnouncementMode = () => {
    if (postData.value.post_type === 3) {
        // Switch back to regular post
        postData.value.post_type = 1
        postData.value.is_pinned = false
    } else {
        // Switch to announcement
        postData.value.post_type = 3
    }
}

const addPollOption = () => {
    postData.value.poll_options.push('')
}

const removePollOption = (index) => {
    if (postData.value.poll_options.length > 1) {
        postData.value.poll_options.splice(index, 1)
    }
}

const resetForm = () => {
    // Clear store data
    socialCreatePostGroupId.value = null
    socialCreatePostData.value = null
    socialCreatePostType.value = 1

    // Reset form
    postData.value = {
        title: '',
        content: '',
        post_type: 1,
        poll_options: ['', ''],
        is_pinned: false,
        privacy: 1
    }
    const resetStartDateTime = new Date()
    const resetEndDateTime = new Date()
    resetEndDateTime.setDate(resetEndDateTime.getDate() + 1)
    resetEndDateTime.setHours(17, 0, 0, 0)
    pollStartDateTime.value = resetStartDateTime
    pollEndDateTime.value = resetEndDateTime

    // Reset files state
    filePreviews.value.forEach(preview => {
        if (preview.url && !preview.isExisting) {
            URL.revokeObjectURL(preview.url)
        }
    })
    selectedFiles.value = []
    filePreviews.value = []
    deletedAttachmentIds.value = []
    if (fileInput.value) {
        fileInput.value.value = ''
    }

    errors.value = {}
}

const closeModal = () => {
    socialCreatePostModal.value = false
}

const validateSchema = async () => {
    try {
        await schema.validate(postData.value, { abortEarly: false })
        errors.value = {}
        return true
    } catch (validationError) {
        const validationErrors = {}
        validationError.inner.forEach((err) => {
            validationErrors[err.path] = err.message
        })
        errors.value = validationErrors
        return false
    }
}

const handleSubmit = async () => {
    // Validate using Yup schema
    const isValid = await validateSchema()
    if (!isValid) return

    try {
        isSubmitting.value = true

        const submitData = {
            title: postData.value.title,
            post_type: postData.value.post_type,
            privacy: postData.value.privacy
        }

        // Include group ID if creating post in a group
        if (socialCreatePostGroupId.value) {
            submitData.social_group = socialCreatePostGroupId.value
        }

        // Include is_pinned for announcements
        if (postData.value.post_type === 3) {
            submitData.is_pinned = postData.value.is_pinned
        }

        if (postData.value.post_type === 1 || postData.value.post_type === 3) {
            // Regular post or announcement
            submitData.content = postData.value.content
        } else {
            // Poll
            // Filter out empty options
            const validOptions = postData.value.poll_options.filter(opt => opt.trim() !== '')
            submitData.poll_options = validOptions

            // Set start_poll to user selected datetime
            submitData.start_poll = dayjs(pollStartDateTime.value).format('YYYY-MM-DDTHH:mm:ss')

            // Set end_poll to user selected datetime
            submitData.end_poll = dayjs(pollEndDateTime.value).format('YYYY-MM-DDTHH:mm:ss')
        }

        // Handle existing attachments to delete if any
        if (socialCreatePostData.value && socialCreatePostData.value.attachments) {
            const currentAttachmentIds = filePreviews.value
                .filter(p => p.isExisting)
                .map(p => p.id)

            // Assume backend handles diff or we can send 'attachments_to_keep'
            // But standard DRF update usually requires specific handling
            // We will rely on uploading new files, deleting old files needs explicit support
            // If backend doesn't support 'attachments_to_delete', we might need separate calls
            // For now, let's just proceed with create logic, adding new files
        }

        // Use FormData if image is selected
        let response, error

        const isEdit = !!socialCreatePostData.value
        const url = isEdit ? `social/posts/${socialCreatePostData.value.id}/` : 'social/posts/'

        // Check if we need multipart/form-data (files added OR files deleted OR normal update)
        if (selectedFiles.value.length > 0 || (isEdit && deletedAttachmentIds.value.length > 0)) {
            const formData = new FormData()
            formData.append('title', submitData.title)
            formData.append('post_type', submitData.post_type)
            formData.append('privacy', submitData.privacy)

            if (submitData.social_group) {
                formData.append('social_group', submitData.social_group)
            }

            if (submitData.is_pinned !== undefined) {
                formData.append('is_pinned', submitData.is_pinned)
            }

            if (submitData.content) {
                formData.append('content', submitData.content)
            }

            if (submitData.poll_options) {
                formData.append('poll_options', JSON.stringify(submitData.poll_options))
            }

            if (submitData.start_poll) {
                formData.append('start_poll', submitData.start_poll)
            }

            if (submitData.end_poll) {
                formData.append('end_poll', submitData.end_poll)
            }

            selectedFiles.value.forEach(file => {
                formData.append('attachments', file)
            })

            if (deletedAttachmentIds.value.length > 0) {
                deletedAttachmentIds.value.forEach(id => {
                    formData.append('attachments_to_delete', id)
                })
            }

            const result = await useAPI()[isEdit ? 'patch' : 'post'](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            response = result.data
            error = result.error
        } else {
            const result = await useAPI()[isEdit ? 'patch' : 'post'](url, submitData)
            response = result.data
            error = result.error
        }

        if (error.value) {
            throw new Error(error.value.message || (isEdit ? 'Failed to update post' : 'Failed to create post'))
        }

        if (response.value) {
            useToast().add({
                title: t('Success'),
                description: isEdit ?
                    (postData.value.post_type === 2 ? t('Poll updated successfully') : t('Post updated successfully')) :
                    (postData.value.post_type === 2 ? t('Poll created successfully') : t('Post created successfully')),
                icon: 'i-heroicons-check-circle',
                color: 'green',
                timeout: 3000,
            })

            if (isEdit) {
                emit('postUpdated', response.value)
            } else {
                emit('postCreated') // This refreshes the feed
            }

            closeModal()
        }
    } catch (error) {
        console.error('Error submitting post:', error)
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred. Please try again.'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            timeout: 5000,
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>
