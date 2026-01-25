<template>
    <div class="grid grid-cols-12 gap-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <!-- Left Sidebar (3 cols) -->
        <div class="col-span-12 lg:col-span-3">
            <SocialSidebar :user="userInfo" current-page="pending" />
        </div>

        <!-- Center Feed (6 cols) -->
        <div class="col-span-12 lg:col-span-6 space-y-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('Pending Posts') }}</h1>

            <div v-if="loading" class="space-y-4">
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
            </div>

            <div v-else class="space-y-4">
                <template v-if="pendingPosts.length > 0">
                    <SocialPostItem v-for="post in pendingPosts" :key="post.id" :post="post" :pending="true"
                        @postDeleted="handlePostDeleted" @postProcessed="handlePostDeleted" />
                </template>
                <UCard v-else class="text-center py-12">
                    <UIcon name="i-heroicons-check-circle" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p class="text-gray-500 dark:text-gray-400">{{ $t('No pending posts') }}</p>
                </UCard>
            </div>
        </div>

        <!-- Right Sidebar (3 cols) -->
        <div class="col-span-12 lg:col-span-3 space-y-4">
            <SocialBirthdayWidget />
            <SocialDailyInspiration />
            <SocialTodayEvents />
            <SocialUpcomingEvents />
            <SocialSystemNotifications />
        </div>

        <!-- Modals -->
        <ModalCreatePost />
        <!-- Assuming ModalCreatePost is needed but maybe hidden? It's usually invoked by events. 
             If SocialPostItem uses it for editing, we need it. -->
        <!-- <ModalOpenPost />
        <ModalOpenPostFullscreen /> -->

    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { data: userInfo } = useAuth()

definePageMeta({
    title: 'Pending Posts'
})

const loading = ref(true)
const pendingPosts = ref([])
const page = ref(1)
const pageSize = ref(10)

const fetchPendingPosts = async () => {
    loading.value = true
    try {
        const { data } = await useAPI().get('social/posts/pending/', {
            page: page.value,
            page_size: pageSize.value
        })
        pendingPosts.value = data.value.results || []
    } catch (error) {
        console.error('Error fetching pending posts:', error)
    } finally {
        loading.value = false
    }
}

const handlePostDeleted = (postId) => {
    pendingPosts.value = pendingPosts.value.filter(post => post.id !== postId)
}

watch(userInfo, (val) => {
    if (val) {
        fetchPendingPosts()
    }
}, { immediate: true })
</script>
