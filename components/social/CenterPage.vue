<template>
    <div v-if="currentPage === 'news'" class="col-span-12 lg:col-span-6 space-y-6">
        <SocialCreatePost />

        <SocialFeedFilter :active-filter="activeFilter" @filter-change="handleFilterChange" />

        <div class="space-y-4">
            <!-- Uploading Posts (with loading spinner) -->
            <UCard v-for="uploadingPost in uploadingPosts" :key="'uploading-' + uploadingPost.id"
                :ui="{ body: { padding: 'p-4' } }">
                <div class="flex items-center justify-center gap-3">
                    <svg class="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Uploading post...') }}</p>
                </div>
            </UCard>

            <!-- Regular Posts -->
            <SocialPostItem v-for="post in filteredPosts" :key="post.id" :post="post"
                @postDeleted="handlePostDeleted" />

            <!-- Load More Button -->
            <div v-if="hasMore" class="pt-8 flex justify-center items-center">
                <UButton v-if="!loadingMore" :label="$t('Load more')" color="gray" variant="soft" class="mx-auto"
                    @click="loadMore" block icon="i-heroicons-arrow-path" />
                <UIcon v-else name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin mx-auto text-gray-400" />
            </div>
        </div>
        <ModalCreatePost @postCreated="handlePostCreated" @postUpdated="handlePostUpdated" />
    </div>
</template>

<script setup>
const props = defineProps({
    currentPage: {
        type: String,
        default: 'news'
    }
})

const { data: userInfo } = useAuth()

const page = ref(1)
const pageSize = ref(10)
const postsKey = ref(0) // Key to force refresh

// Pagination state
const posts = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)

// State for uploading posts
const uploadingPosts = ref([])
const pollingStartTime = ref(0)
let pollingInterval = null

// Filter state
const activeFilter = ref('all')

const handleFilterChange = (filterValue) => {
    activeFilter.value = filterValue
    // Reset and refetch
    posts.value = []
    page.value = 1
    hasMore.value = true
    fetchPosts()
}

// Fetch posts logic
const fetchPosts = async (isLoadMore = false) => {
    if (loading.value || (isLoadMore && loadingMore.value)) return

    if (isLoadMore) {
        loadingMore.value = true
    } else {
        loading.value = true
    }

    try {
        const params = {
            page: page.value,
            page_size: pageSize.value,
            status: 3, // Only show Published posts
        }

        // Apply filters
        if (activeFilter.value === 'poll') {
            params.post_type = 2
        }

        const { data: data } = await useAPI().get('social/posts/', params)

        if (data.value && data.value.results) {
            let newPosts = data.value.results

            // Client-side filtering for 'group' (until backend supports 'has_group' filter)
            // Note: This results in fewer than pageSize posts being shown if filtered
            if (activeFilter.value === 'group') {
                newPosts = newPosts.filter(p => p.social_group !== null)
            }

            if (isLoadMore) {
                posts.value = [...posts.value, ...newPosts]
            } else {
                posts.value = newPosts
            }

            hasMore.value = !!data.value.next
        } else {
            if (!isLoadMore) posts.value = []
            hasMore.value = false
        }
    } catch (error) {
        console.error('Error fetching posts:', error)
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

// Filtered posts - now mostly handling just the array, as filtering is largely moved to backend/fetch
const filteredPosts = computed(() => {
    return posts.value
})

const loadMore = () => {
    if (loading.value || loadingMore.value || !hasMore.value) return
    page.value++
    fetchPosts(true)
}

const handlePostDeleted = (postId) => {
    posts.value = posts.value.filter(post => post.id !== postId)
}

const handlePostCreated = async () => {
    // Show a placeholder uploading state immediately
    uploadingPosts.value = [{ id: 'temp-' + Date.now(), title: '' }]

    // Small delay to allow backend to start processing
    await new Promise(resolve => setTimeout(resolve, 500))

    // Fetch posts with status=2 to show uploading state
    await fetchUploadingPosts()

    // If no uploading posts found (backend was too fast), refresh main feed
    if (uploadingPosts.value.length === 0) {
        postsKey.value++ // Trigger refresh of main posts
        return
    }

    // Start polling for status updates
    startPolling()
}

const handlePostUpdated = (updatedPost) => {
    const index = posts.value.findIndex(p => p.id === updatedPost.id)
    if (index !== -1) {
        posts.value[index] = { ...posts.value[index], ...updatedPost }
    }
}

// Fetch uploading posts (status=2)
const fetchUploadingPosts = async () => {
    try {
        const { data: data } = await useAPI().get('social/posts/', {
            status: 2, // Posting state
            page: 1,
            page_size: 20,
            author: userInfo.value?.id // Only fetch uploading posts for current user
        })

        if (data.value && data.value.results) {
            uploadingPosts.value = data.value.results
        } else {
            uploadingPosts.value = []
        }
    } catch (error) {
        console.error('Error fetching uploading posts:', error)
        uploadingPosts.value = []
    }
}

// Poll for uploading posts (status=2)
const pollUploadingPosts = async () => {
    // Check for timeout (10 seconds)
    if (Date.now() - pollingStartTime.value > 10000) {
        console.log('Polling timeout reached, refreshing main feed')
        stopPolling()
        uploadingPosts.value = [] // Clear uploading state
        postsKey.value++ // Refresh main feed
        return
    }

    // Fetch current status=2 posts
    await fetchUploadingPosts()

    // If no uploading posts found, refresh main feed and stop polling
    if (uploadingPosts.value.length === 0) {
        // Refresh the entire post list to show completed posts
        postsKey.value++
        stopPolling()
        return
    }

    // Otherwise, keep polling (posts still uploading)
}

const startPolling = () => {
    // Clear existing interval if any
    if (pollingInterval) {
        clearInterval(pollingInterval)
    }

    pollingStartTime.value = Date.now()

    // Start polling every 3 seconds
    pollingInterval = setInterval(pollUploadingPosts, 3000)
}

const stopPolling = () => {
    if (pollingInterval) {
        clearInterval(pollingInterval)
        pollingInterval = null
    }
}

// Watchers
watch(postsKey, () => {
    page.value = 1
    hasMore.value = true
    posts.value = []
    fetchPosts()
})

watch(userInfo, (val) => {
    if (val) {
        fetchPosts()
        fetchUploadingPosts() // Also check for any pending uploads
    }
}, { immediate: true })

onMounted(() => {
    if (userInfo.value) {
        fetchPosts()
    }
})

onUnmounted(() => {
    stopPolling()
})
</script>