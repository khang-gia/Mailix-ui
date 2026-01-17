<template>
    <UModal v-model="socialCommentModalFullscreen" fullscreen :ui="{
        padding: 'p-0',
        background: 'bg-black'
    }">
        <div class="h-screen flex">
            <!-- Left side - Image Gallery (60%) -->
            <div class="w-3/5 bg-black flex items-center justify-center relative">
                <!-- Close button -->
                <UButton icon="i-heroicons-x-mark" color="black" variant="soft" size="xl" :ui="{
                    rounded: 'rounded-full',
                    background: ' backdrop-blur-sm',
                    color: {
                        black: {
                            soft: 'text-white dark:text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800'
                        }
                    }
                }" class="absolute top-4 left-4 z-20" @click="socialCommentModalFullscreen = false" />

                <!-- Image carousel -->
                <div v-if="imageAttachments.length > 0" class="w-full h-full flex items-center justify-center relative">
                    <!-- Previous button - full height -->
                    <button v-if="imageAttachments.length > 1" @click="previousImage"
                        class="absolute left-0 top-0 h-full w-20 flex items-center justify-center bg-gray-800 opacity-15 hover:bg-neutral-800 hover:opacity-40 transition-colors group z-10">
                        <div
                            class="w-10 h-10 rounded-full !bg-white !opacity-100 flex items-center justify-center shadow-lg">
                            <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 text-gray-800" />
                        </div>
                    </button>

                    <!-- Current image -->
                    <img :src="imageAttachments[currentImageIndex]?.file" class="max-w-full max-h-full object-contain"
                        alt="Post image" />

                    <!-- Next button - full height -->
                    <button v-if="imageAttachments.length > 1" @click="nextImage"
                        class="absolute right-0 top-0 h-full w-20 flex items-center justify-center bg-gray-900 opacity-15 hover:bg-neutral-800 hover:opacity-40 transition-colors group z-10">
                        <div
                            class="w-10 h-10 rounded-full !bg-white !opacity-100 flex items-center justify-center shadow-lg">
                            <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 text-gray-800" />
                        </div>
                    </button>

                    <!-- Image counter -->
                    <div v-if="imageAttachments.length > 1"
                        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {{ currentImageIndex + 1 }} / {{ imageAttachments.length }}
                    </div>
                </div>

                <!-- No image placeholder -->
                <div v-else class="text-white text-center">
                    <UIcon name="i-heroicons-photo" class="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <p class="text-lg opacity-70">{{ $t('No images available') }}</p>
                </div>
            </div>

            <!-- Right side - Post Details (40%) -->
            <div class="w-2/5 bg-white dark:bg-gray-900 flex flex-col">
                <!-- Post header -->
                <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-start gap-3">
                        <UAvatar :src="post.author?.avatar" :alt="post.author?.display_name" size="md" />
                        <div class="flex-1">
                            <div class="flex items-center gap-1">
                                <span class="font-bold text-gray-900 dark:text-white">{{ post.author?.display_name
                                    }}</span>
                                <span v-if="post.social_group" class="text-gray-500 text-sm">{{ $t('shared on')
                                    }}</span>
                                <NuxtLink v-if="post.social_group" :to="`/social/groups/${post.social_group}`"
                                    class="text-green-500 font-medium hover:underline text-sm">
                                    {{ post.social_group_name }}
                                </NuxtLink>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-gray-500">
                                <span>{{ formatDate(post.created_at) }}</span>
                                <span>•</span>
                                <UIcon :name="privacyIcons[post.privacy]" class="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Post content (scrollable) -->
                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                    <!-- Title -->
                    <h3 v-if="post.title" class="text-lg font-bold">{{ post.title }}</h3>

                    <!-- Content -->
                    <div v-if="post.content" class="break-words" v-html="post.content"></div>

                    <!-- Reactions summary -->
                    <div class="flex items-center justify-between py-2 border-y border-gray-200 dark:border-gray-700">
                        <div v-if="post.top_interaction_types && post.top_interaction_types.length > 0"
                            class="flex items-center gap-1">
                            <div class="flex items-center -space-x-1">
                                <div v-for="interaction in post.top_interaction_types.slice(0, 3)"
                                    :key="interaction.interaction_type"
                                    class="w-5 h-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                    <UIcon :name="getInteractionIcon(interaction.interaction_type)" class="w-4 h-4" />
                                </div>
                            </div>
                            <span class="text-sm text-gray-600 dark:text-gray-400">{{ post.interactions_count }}</span>
                        </div>
                        <div v-else></div>
                        <div v-if="post.comments_count" class="text-sm text-gray-600 dark:text-gray-400">
                            {{ post.comments_count }} {{ $t('comments') }}
                        </div>
                    </div>

                    <!-- Action buttons -->
                    <div class="flex items-center gap-2">
                        <div class="flex-1">
                            <UPopover :popper="{ placement: 'top' }" mode="hover">
                                <UButton
                                    :icon="post.your_interaction ? getInteractionIcon(post.your_interaction) : 'streamline:like-1'"
                                    :label="post.your_interaction ? getInteractionLabel(post.your_interaction) : $t('Like')"
                                    :class="post.your_interaction ? getInteractionTextColor(post.your_interaction) : ''"
                                    color="gray" variant="ghost" block
                                    @click="interactPost(post.your_interaction ? 0 : 1)" />

                                <template #panel>
                                    <div class="p-2 flex gap-2">
                                        <UButton v-for="interaction in interactionOptions" :key="interaction.id"
                                            :icon="interaction.icon" :title="interaction.label" color="gray"
                                            variant="ghost" size="sm" @click="interactPost(interaction.id)" />
                                    </div>
                                </template>
                            </UPopover>
                        </div>
                        <div class="flex-1">
                            <UButton icon="i-heroicons-chat-bubble-left" :label="$t('Comment')" color="gray"
                                variant="ghost" block />
                        </div>
                    </div>

                    <!-- Comments section -->
                    <div>
                        <CommentsSection comment-type="social" :id="post.id" :placeholder="$t('Write a comment...')"
                            @onAddComment="post.comments_count++" useTimeAgo="true" />
                    </div>

                </div>
            </div>
        </div>
    </UModal>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const { data: userInfo } = useAuth()
const dayjs = useDayjs()

const modalStore = useModalStore()
const { socialCommentModalFullscreen, socialCommentPost: post } = storeToRefs(modalStore)

// Image carousel state
const currentImageIndex = ref(0)

const imageAttachments = computed(() => {
    return post.value.attachments?.filter(a => a.file_type === 'image') || []
})

const nextImage = () => {
    if (currentImageIndex.value < imageAttachments.value.length - 1) {
        currentImageIndex.value++
    } else {
        currentImageIndex.value = 0 // Loop back to first
    }
}

const previousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--
    } else {
        currentImageIndex.value = imageAttachments.value.length - 1 // Loop to last
    }
}

// Reset image index when modal opens
watch(socialCommentModalFullscreen, (newVal) => {
    if (newVal) {
        currentImageIndex.value = 0
    }
})

// Keyboard navigation
onMounted(() => {
    const handleKeydown = (e) => {
        if (!socialCommentModalFullscreen.value) return

        if (e.key === 'ArrowLeft') {
            previousImage()
        } else if (e.key === 'ArrowRight') {
            nextImage()
        }
    }

    window.addEventListener('keydown', handleKeydown)

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown)
    })
})

const formatDate = (date) => {
    if (!date) return ''
    return dayjs(date).format('HH:mm DD/MM/YYYY')
}

const privacyIcons = {
    1: 'i-heroicons-globe-alt',
    2: 'i-heroicons-users',
    3: 'i-heroicons-lock-closed',
}

const interactionOptions = ref([
    { id: 1, label: t('Like'), icon: 'streamline-plump-color:like-1-flat' },
    { id: 2, label: t('Dislike'), icon: 'emojione-v1:broken-heart' },
    { id: 3, label: t('Heart'), icon: 'emojione-v1:red-heart' },
    { id: 4, label: t('Haha'), icon: 'twemoji:rolling-on-the-floor-laughing' },
    { id: 5, label: t('Wow'), icon: 'twemoji:star-struck' },
    { id: 6, label: t('Sad'), icon: 'twemoji:sad-but-relieved-face' },
    { id: 7, label: t('Angry'), icon: 'twemoji:angry-face' },
])

const getInteractionIcon = (type) => {
    const interaction = interactionOptions.value.find(i => i.id === type)
    return interaction?.icon || 'streamline:like-1'
}

const getInteractionLabel = (type) => {
    const interaction = interactionOptions.value.find(i => i.id === type)
    return interaction?.label || t('Like')
}

const getInteractionTextColor = (type) => {
    const colorMap = {
        1: 'text-blue-600',
        2: 'text-red-600',
        3: 'text-red-600',
        4: 'text-yellow-600',
        5: 'text-yellow-600',
        6: 'text-yellow-600',
        7: 'text-yellow-600',
    }
    return colorMap[type] || ''
}

const interactPost = async (interactionType) => {
    if (interactionType === 0 && !post.value.your_interaction) {
        return
    }

    try {
        if (interactionType === 0) {
            const { status } = await useAPI().post(`/social/posts/${post.value.id}/remove_interaction/`)
            if (status.value === 'success') {
                post.value.your_interaction = null
                post.value.interactions_count = Math.max(0, post.value.interactions_count - 1)
            }
            return
        }

        const { data: response } = await useAPI().post(`/social/posts/${post.value.id}/interact/`, {
            interaction_type: interactionType
        })

        if (response.value && response.value.id) {
            const hadInteraction = post.value.your_interaction !== null
            post.value.your_interaction = interactionType

            if (!hadInteraction) {
                post.value.interactions_count += 1
            }
        }
    } catch (error) {
        console.error('Error interacting with post:', error)
    }
}
</script>