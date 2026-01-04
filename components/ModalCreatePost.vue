<template>
    <UModal v-model="socialCreatePostModal" :ui="{ width: 'w-full sm:max-w-4xl' }" class="font-averta">
        <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'px-6 py-4' } }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">
                        {{ postData.post_type === 2 ? t('Create Poll') :
                            postData.post_type === 3 ? t('Create Announcement') :
                                t('Create Post') }}
                    </h3>
                    <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="closeModal"
                        :disabled="isSubmitting" />
                </div>
            </template>

            <UForm :schema="schema" :state="postData" class="space-y-4">
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
                            buttonType="outline" :place-holder="t('Poll start time')" />
                    </UFormGroup>

                    <UFormGroup :label="t('Poll end time')">
                        <BaseDatePicker v-model="pollEndDateTime" :required="true" class="w-full" mode="datetime"
                            buttonType="outline" :place-holder="t('Poll end time')" />
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
                        :variant="postData.post_type === 2 ? 'solid' : 'ghost'" size="sm" @click="togglePollMode" />
                    <UButton icon="i-heroicons-megaphone" :label="t('Announcement')"
                        :color="postData.post_type === 3 ? 'red' : 'red'"
                        :variant="postData.post_type === 3 ? 'solid' : 'ghost'" size="sm"
                        @click="toggleAnnouncementMode" />
                </div>

                <!-- Pin Toggle (only for announcements) -->
                <div v-if="postData.post_type === 3" class="flex items-center gap-2 pt-3">
                    <UToggle v-model="postData.is_pinned" />
                    <label class="text-sm font-medium cursor-pointer" @click="postData.is_pinned = !postData.is_pinned">
                        {{ t('Pin this announcement') }}
                    </label>
                </div>

                <!-- Image Preview -->
                <div v-if="imagePreview" class="mt-4 relative">
                    <img :src="imagePreview" class="w-full rounded-lg max-h-96 object-cover" />
                    <button @click="removeImage"
                        class="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
                    </button>
                </div>

                <!-- Hidden file input -->
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageSelect" />
            </UForm>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <UButton :label="t('Cancel')" color="gray" variant="ghost" @click="closeModal"
                        :disabled="isSubmitting" />
                    <UButton :label="postData.post_type === 2 ? t('Create Poll') :
                        postData.post_type === 3 ? t('Create Announcement') :
                            t('Post')" color="primary" @click="handleSubmit" :loading="isSubmitting" />
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
const { socialCreatePostModal, socialCreatePostType, socialCreatePostGroupId } = storeToRefs(modalStore)
const dayjs = useDayjs()

const postData = ref({
    title: '',
    content: '',
    post_type: 1, // 1 = post, 2 = poll, 3 = announcement
    poll_options: [''], // Default empty option for polls
    is_pinned: false // For announcements
})

// Image upload state
const fileInput = ref(null)
const selectedImage = ref(null)
const imagePreview = ref(null)

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        selectedImage.value = file
        imagePreview.value = URL.createObjectURL(file)
    }
}

const removeImage = () => {
    selectedImage.value = null
    imagePreview.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// Set default poll start time to current date + time
const defaultPollStartTime = new Date()
const pollStartDateTime = ref(defaultPollStartTime)

// Set default poll end time to current date + time + 1 day
const defaultPollEndTime = new Date()
defaultPollEndTime.setDate(defaultPollEndTime.getDate() + 1)
defaultPollEndTime.setHours(17, 0, 0, 0)
const pollEndDateTime = ref(defaultPollEndTime)

const errors = ref({})
const isSubmitting = ref(false)

const emit = defineEmits(['postCreated'])

// Yup validation schema
const schema = yup.object({
    title: yup.string().required(t('This field is required')),
})

// Watch for modal opening and set post_type from store
watch(socialCreatePostModal, (newValue) => {
    if (newValue) {
        // When modal opens, set post_type from store
        postData.value.post_type = socialCreatePostType.value
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

const closeModal = () => {
    setSocialCreatePostModal(false)
    socialCreatePostGroupId.value = null // Reset group context
    // Reset form
    postData.value = {
        title: '',
        content: '',
        post_type: 1,
        poll_options: ['', ''],
    }
    const resetStartDateTime = new Date()
    const resetEndDateTime = new Date()
    resetEndDateTime.setDate(resetEndDateTime.getDate() + 1)
    resetEndDateTime.setHours(17, 0, 0, 0)
    pollStartDateTime.value = resetStartDateTime
    pollEndDateTime.value = resetEndDateTime

    // Reset image state
    selectedImage.value = null
    imagePreview.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }

    errors.value = {}
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

        // Use FormData if image is selected
        let response, error
        if (selectedImage.value) {
            const formData = new FormData()
            formData.append('title', submitData.title)
            formData.append('post_type', submitData.post_type)

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

            formData.append('image', selectedImage.value)

            const result = await useAPI().post('social/posts/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            response = result.data
            error = result.error
        } else {
            const result = await useAPI().post('social/posts/', submitData)
            response = result.data
            error = result.error
        }

        if (error.value) {
            throw new Error(error.value.message || 'Failed to create post')
        }

        if (response.value) {
            useToast().add({
                title: t('Success'),
                description: postData.value.post_type === 2 ? t('Poll created successfully') : t('Post created successfully'),
                icon: 'i-heroicons-check-circle',
                color: 'green',
                timeout: 3000,
            })

            // Emit event to trigger polling (no post data since it's still processing)
            emit('postCreated')

            closeModal()
        }
    } catch (error) {
        console.error('Error creating post:', error)
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while creating the post. Please try again.'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            timeout: 5000,
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>
