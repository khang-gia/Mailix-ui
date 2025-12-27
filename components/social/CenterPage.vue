<template>
    <div v-if="currentPage === 'news'" class="col-span-12 lg:col-span-6 space-y-6">
        <SocialCreatePost />

        <SocialFeedFilter />

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
            <SocialPostItem v-for="post in posts" :key="post.id" :post="post" @postDeleted="handlePostDeleted" />
        </div>
        <ModalOpenPost />
        <ModalCreatePost @postCreated="handlePostCreated" />
    </div>
    <div v-else-if="currentPage === 'groups'">
        <GroupList />
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

// State for uploading posts
const uploadingPosts = ref([])
let pollingInterval = null

const posts = computedAsync(async () => {
    const { data: data } = await useAPI().get('social/posts/', {
        page: page.value,
        page_size: pageSize.value,
        _refresh: postsKey.value, // Include key in params to trigger refetch
    })
    return data.value.results
})

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
        console.log('test post key')
        postsKey.value++ // Trigger refresh of main posts
        return
    }

    // Start polling for status updates
    startPolling()
}

// Fetch uploading posts (status=2)
const fetchUploadingPosts = async () => {
    try {
        const { data: data } = await useAPI().get('social/posts/', {
            status: 2, // Posting state
            page: 1,
            page_size: 20,
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
    // Fetch current status=2 posts
    await fetchUploadingPosts()

    // If no uploading posts found, refresh main feed and stop polling
    if (uploadingPosts.value.length === 0) {
        // Refresh the entire post list to show completed posts
        console.log('test post key')
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

    // Start polling every 3 seconds
    pollingInterval = setInterval(pollUploadingPosts, 3000)
}

const stopPolling = () => {
    if (pollingInterval) {
        clearInterval(pollingInterval)
        pollingInterval = null
    }
}

// Cleanup on component unmount
onUnmounted(() => {
    stopPolling()
})
</script>