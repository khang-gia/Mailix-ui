<template>
    <UModal v-model="socialCreatePostModal" :ui="{ width: 'w-full sm:max-w-4xl' }" class="font-averta">
        <UCard :ui="{ body: { padding: 'p-6' }, header: { padding: 'px-6 py-4' } }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">{{ postData.post_type === 2 ? t('Create Poll') : t('Create Post')
                    }}</h3>
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

                <!-- Post Content (only for regular posts) -->
                <UFormGroup v-if="postData.post_type === 1" :label="t('Content')" name="content">
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
                            @click="removePollOption(index)" :disabled="postData.poll_options.length <= 2" />
                    </div>

                    <UButton icon="i-heroicons-plus-circle" :label="t('Add option')" color="gray" variant="soft"
                        size="sm" @click="addPollOption" />
                </div>

                <!-- Poll End Date/Time (only for polls) -->
                <div v-if="postData.post_type === 2" class="space-y-3">
                    <UFormGroup :label="t('Poll end time')">
                        <BaseDatePicker v-model="pollEndDateTime" :required="true" class="w-full" mode="datetime"
                            buttonType="outline" :place-holder="t('Poll end time')" />
                    </UFormGroup>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4 pt-2">
                    <UButton icon="i-heroicons-photo" :label="t('Photo/File')" color="green" variant="ghost"
                        size="sm" />
                    <UButton icon="i-heroicons-document-text" :label="t('Note')" color="blue" variant="ghost"
                        size="sm" />
                    <UButton icon="i-heroicons-chart-bar" :label="t('Poll')"
                        :color="postData.post_type === 2 ? 'orange' : 'orange'"
                        :variant="postData.post_type === 2 ? 'solid' : 'ghost'" size="sm" @click="togglePollMode" />
                </div>
            </UForm>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <UButton :label="t('Cancel')" color="gray" variant="ghost" @click="closeModal"
                        :disabled="isSubmitting" />
                    <UButton :label="t('Post')" color="primary" @click="handleSubmit" :loading="isSubmitting" />
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
const { socialCreatePostModal } = storeToRefs(modalStore)
const dayjs = useDayjs()

const postData = ref({
    title: '',
    content: '',
    post_type: 1, // 1 = post, 2 = poll
    poll_options: ['', ''], // Default 2 empty options for polls
})

// Set default poll end time to current date + time
const defaultPollEndTime = new Date()
defaultPollEndTime.setHours(17, 0, 0, 0)
const pollEndDateTime = ref(defaultPollEndTime)

const errors = ref({})
const isSubmitting = ref(false)

const emit = defineEmits(['postCreated'])

// Yup validation schema
const schema = yup.object({
    title: yup.string().required(t('Please enter post title')),
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

const addPollOption = () => {
    postData.value.poll_options.push('')
}

const removePollOption = (index) => {
    if (postData.value.poll_options.length > 2) {
        postData.value.poll_options.splice(index, 1)
    }
}

const closeModal = () => {
    setSocialCreatePostModal(false)
    // Reset form
    postData.value = {
        title: '',
        content: '',
        post_type: 1,
        poll_options: ['', ''],
    }
    const resetDateTime = new Date()
    resetDateTime.setHours(17, 0, 0, 0)
    pollEndDateTime.value = resetDateTime
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

        if (postData.value.post_type === 1) {
            // Regular post
            submitData.content = postData.value.content
        } else {
            // Poll
            // Filter out empty options
            const validOptions = postData.value.poll_options.filter(opt => opt.trim() !== '')
            submitData.poll_options = validOptions

            // Format poll end datetime
            submitData.poll_end_datetime = dayjs(pollEndDateTime.value).format('YYYY-MM-DDTHH:mm:ss')
        }

        const { data: response, error } = await useAPI().post('social/posts/', submitData)

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
