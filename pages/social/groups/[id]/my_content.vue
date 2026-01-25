<template>
    <div class="grid grid-cols-12 gap-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <!-- Left Sidebar (3 cols) -->
        <div class="col-span-12 lg:col-span-3">
            <UCard :ui="{ body: { padding: 'p-0' } }">
                <div class="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 class="font-bold text-lg">{{ $t('Your Content') }}</h2>
                    <p class="text-xs text-gray-500">{{ $t('Manage your posts in this group') }}</p>
                </div>
                <div class="p-2 space-y-1">
                    <button v-for="item in menuItems" :key="item.status" @click="activeStatus = item.status" :class="[
                        'w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left',
                        activeStatus === item.status
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                    ]">
                        <!-- Icon Container -->
                        <div :class="[
                            'flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0',
                            activeStatus === item.status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        ]">
                            <UIcon :name="item.icon" class="w-6 h-6" />
                        </div>

                        <!-- Label -->
                        <div class="flex-1">
                            <span class="font-bold block text-sm">{{ item.label }}</span>
                        </div>

                        <!-- Count -->
                        <span v-if="counts[item.status] && [3, 6].includes(item.status)" :class="[
                            'text-xs py-0.5 px-2 rounded-md font-medium',
                            activeStatus === item.status
                                ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        ]">
                            {{ counts[item.status] }}
                        </span>
                    </button>
                </div>
                <div class="p-2 border-t border-gray-100 dark:border-gray-800">
                    <button @click="navigateTo(`/social/groups/${groupId}`)" :class="[
                        'w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                    ]">
                        <div
                            class="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                            <UIcon name="i-heroicons-arrow-left" class="w-6 h-6" />
                        </div>
                        <span class="font-bold block text-sm">{{ $t('Back to group') }}</span>
                    </button>
                </div>
            </UCard>
        </div>

        <!-- Center Content (9 cols) -->
        <div class="col-span-12 lg:col-span-9 space-y-4">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ getStatusTitle(activeStatus) }}</h1>
            </div>

            <!-- Posts List -->
            <div class="space-y-4">
                <template v-if="loading">
                    <UCard v-for="i in 3" :key="i" :ui="{ body: { padding: 'p-4' } }">
                        <div class="animate-pulse flex space-x-4">
                            <div class="rounded-full bg-gray-200 h-10 w-10"></div>
                            <div class="flex-1 space-y-2 py-1">
                                <div class="h-2 bg-gray-200 rounded"></div>
                                <div class="space-y-3">
                                    <div class="grid grid-cols-3 gap-4">
                                        <div class="h-2 bg-gray-200 rounded col-span-2"></div>
                                        <div class="h-2 bg-gray-200 rounded col-span-1"></div>
                                    </div>
                                    <div class="h-2 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </template>
                <template v-else-if="filteredPosts.length > 0">
                    <SocialGroupMyContentItem v-for="post in filteredPosts" :key="post.id" :post="post"
                        @postDeleted="handlePostDeleted" />
                </template>
                <UCard v-else class="text-center py-12">
                    <UIcon name="i-heroicons-document-text" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p class="text-gray-500 dark:text-gray-400">{{ $t('No posts to show') }}</p>
                </UCard>
            </div>
        </div>

        <!-- Modals -->
        <!-- Modals -->
        <ModalCreatePost @postCreated="fetchMyPosts" />
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const route = useRoute()
const groupId = route.params.id

definePageMeta({
    title: 'Social'
})

const loading = ref(true)
const posts = ref([])
const activeStatus = ref(3) // Default to Published
const { data: userInfo } = useAuth()

const menuItems = computed(() => [
    { label: t('Pending'), status: 6, icon: 'i-heroicons-clock' },
    { label: t('Published'), status: 3, icon: 'i-heroicons-check-circle' },
    { label: t('Denied'), status: 7, icon: 'i-heroicons-x-circle' },
    { label: t('Removed'), status: 4, icon: 'i-heroicons-trash' }
])

const getStatusTitle = (status) => {
    const item = menuItems.value.find(i => i.status === status)
    return item ? item.label : ''
}

const fetchMyPosts = async () => {
    if (!userInfo.value) return
    loading.value = true
    try {
        console.log('Fetching my posts...')
        // Fetch all my posts in this group
        // Backend filtering by social_group and author
        // We might need to iterate or fetch all and filter client side if endpoint is limited
        // Assuming PostViewSet supports filtering by social_group and author
        const response = await useAPI().$get('social/posts/', {
            social_group: groupId,
            author: userInfo.value.id,
            page_size: 100 // Fetch a reasonable amount
        })

        if (response) {
            console.log('My posts fetched:', response.results?.length)
            posts.value = response.results || []
        }
    } catch (error) {
        console.error('Error fetching my posts:', error)
    } finally {
        loading.value = false
    }
}

const filteredPosts = computed(() => {
    return posts.value.filter(post => post.status === activeStatus.value)
})

const counts = computed(() => {
    const c = {}
    menuItems.value.forEach(item => {
        c[item.status] = posts.value.filter(p => p.status === item.status).length
    })
    return c
})

const handlePostDeleted = (postId) => {
    posts.value = posts.value.filter(p => p.id !== postId)
}

watch(userInfo, (val) => {
    if (val) {
        fetchMyPosts()
    }
}, { immediate: true })

</script>
