<template>
    <div v-if="pinnedPosts && pinnedPosts.length > 0" class="mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-star-solid" class="w-5 h-5 text-yellow-500" />
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ $t('Remarkable') }}
                    </h3>
                </div>
                <!-- <span class="text-sm text-gray-500">{{ pinnedPosts.length }} {{ $t('pinned posts') }}</span> -->
            </div>

            <!-- Horizontal Scrollable Container -->
            <div class="relative">
                <!-- Scroll Buttons -->
                <button v-if="showLeftArrow" @click="scrollLeft"
                    class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                    <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
                </button>
                <button v-if="showRightArrow" @click="scrollRight"
                    class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                    <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
                </button>

                <!-- Carousel -->
                <div ref="carouselContainer" @scroll="checkScroll"
                    class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2">
                    <div v-for="post in pinnedPosts" :key="post.id"
                        class="flex-shrink-0 w-80 snap-start cursor-pointer group" @click="openPost(post)">
                        <div
                            class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all h-full p-4">
                            <!-- Post Header -->
                            <div class="flex items-center gap-3 mb-3">
                                <UAvatar :src="post.author?.avatar" :alt="post.author?.display_name" size="sm" />
                                <div class="flex-1 min-w-0">
                                    <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                        {{ post.author?.display_name }}
                                    </p>
                                    <p class="text-xs text-gray-500">{{ formatDate(post.created_at) }}</p>
                                </div>
                                <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            </div>

                            <!-- Post Content -->
                            <div class="mb-3">
                                <h4 v-if="post.title"
                                    class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                    {{ post.title }}
                                </h4>
                                <div v-html="post.content"
                                    class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3"></div>
                            </div>

                            <!-- Post Image Preview (if available) -->
                            <div v-if="post.attachments && post.attachments.length > 0 && post.attachments[0].file_type === 'image'"
                                class="mb-3 rounded-lg overflow-hidden">
                                <img :src="post.attachments[0].file" :alt="post.attachments[0].file_name"
                                    class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>

                            <!-- Post Stats -->
                            <div class="flex items-center gap-4 text-xs text-gray-500">
                                <div class="flex items-center gap-1">
                                    <UIcon name="i-heroicons-heart" class="w-4 h-4" />
                                    <span>{{ post.interactions_count || 0 }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <UIcon name="i-heroicons-chat-bubble-left" class="w-4 h-4" />
                                    <span>{{ post.comments_count || 0 }}</span>
                                </div>
                                <div v-if="post.post_type === 3" class="ml-auto">
                                    <span
                                        class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                                        {{ $t('Announcement') }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'
import dayjs from 'dayjs'

const props = defineProps({
    pinnedPosts: {
        type: Array,
        default: () => []
    }
})

const modalStore = useModalStore()
const carouselContainer = ref(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(false)

const formatDate = (date) => {
    return dayjs(date).fromNow()
}

const openPost = (post) => {
    // Check if post has image attachments
    const hasImages = post.attachments && post.attachments.length > 0 &&
        post.attachments.some(attachment => attachment.file_type === 'image')

    if (hasImages) {
        // Open fullscreen modal for posts with images
        modalStore.setSocialCommentModalFullscreen(true, post)
    } else {
        // Open normal modal for posts without images
        modalStore.setSocialCommentModal(true, post)
    }
}

const scrollLeft = () => {
    if (carouselContainer.value) {
        carouselContainer.value.scrollBy({ left: -320, behavior: 'smooth' })
    }
}

const scrollRight = () => {
    if (carouselContainer.value) {
        carouselContainer.value.scrollBy({ left: 320, behavior: 'smooth' })
    }
}

const checkScroll = () => {
    if (!carouselContainer.value) return

    const { scrollLeft, scrollWidth, clientWidth } = carouselContainer.value
    showLeftArrow.value = scrollLeft > 0
    showRightArrow.value = scrollLeft + clientWidth < scrollWidth - 10
}

onMounted(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkScroll)
})

watch(() => props.pinnedPosts, () => {
    nextTick(() => checkScroll())
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
