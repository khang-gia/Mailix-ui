<template>
    <div class="grid grid-cols-12 gap-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <!-- Left Sidebar (3 cols) -->
        <div class="col-span-12 lg:col-span-3">
            <SocialSidebar :user="currentUser" current-page="groups" />
        </div>

        <!-- Center Content (9 cols) -->
        <div class="col-span-12 lg:col-span-9 space-y-0">
            <!-- Cover Image Section -->
            <div
                class="relative w-full h-[300px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
                <img v-if="group?.cover" :src="group.cover" alt="Group Cover" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black bg-opacity-30"></div>

                <!-- Group Name Overlay -->
                <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <div class="flex items-center gap-4">
                        <img v-if="group?.avatar" :src="group.avatar" alt="Group Avatar"
                            class="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
                        <div v-else
                            class="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                            <UIcon name="i-heroicons-user-group" class="w-8 h-8 text-gray-500" />
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-white">{{ group?.name || 'Loading...' }}</h1>
                            <p class="text-white/90 text-sm">
                                {{ group?.is_public ? $t('Public group') : $t('Private group') }}
                                <span v-if="group?.members_count !== undefined"> · {{ group.members_count }} {{
                                    $t('members') }}</span>
                                <span v-if="group?.posts_count !== undefined"> · {{ group.posts_count }} {{ $t('posts')
                                }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between px-4">
                    <div class="flex gap-1">
                        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                            class="px-6 py-3 text-sm font-medium border-b-2 transition-colors"
                            :class="activeTab === tab.key
                                ? 'text-orange-600 border-orange-600'
                                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100'">
                            {{ tab.label }}
                        </button>
                    </div>
                    <UButton v-if="!isMember" color="primary" @click="joinGroup" :loading="joining" size="sm">
                        {{ $t('Join Group') }}
                    </UButton>
                    <UButton v-else color="gray" variant="outline" size="sm">
                        {{ $t('Joined') }}
                    </UButton>
                </div>
            </div>

            <!-- Content -->
            <div class='col-span-12 lg:col-span-9 px-4 pt-4'>
                <!-- Feed Tab -->
                <div v-if="activeTab === 'feed'">
                    <!-- Post Creation -->
                    <SocialCreatePost v-if="isMember" class="mb-4" @click="openCreatePostModal" />

                    <!-- Posts -->
                    <div class="space-y-4">
                        <!-- Uploading Posts (with loading spinner) -->
                        <UCard v-for="uploadingPost in uploadingPosts" :key="'uploading-' + uploadingPost.id"
                            :ui="{ body: { padding: 'p-4' } }">
                            <div class="flex items-center justify-center gap-3">
                                <svg class="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4">
                                    </circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('Uploading post...') }}
                                </p>
                            </div>
                        </UCard>

                        <SocialPostItem v-for="post in posts" :key="post.id" :post="post"
                            @postDeleted="handlePostDeleted" />

                        <UCard v-if="!posts || posts.length === 0" class="text-center py-12">
                            <UIcon name="i-heroicons-document-text" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p class="text-gray-500 dark:text-gray-400">{{ $t('No posts yet') }}</p>
                        </UCard>
                    </div>
                </div>

                <div v-else-if="activeTab === 'importants'" class="mb-5">
                    <div class="space-y-4">
                        <SocialPostItem v-for="post in importantPosts" :key="post.id" :post="post"
                            @postDeleted="handlePostDeleted" />

                        <UCard v-if="!importantPosts || importantPosts.length === 0" class="text-center py-12">
                            <UIcon name="i-heroicons-megaphone" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p class="text-gray-500 dark:text-gray-400">{{ $t('No important posts') }}</p>
                        </UCard>
                    </div>
                </div>

                <div v-else-if="activeTab === 'members'" class="mb-5 space-y-6">
                    <!-- Admins Section -->
                    <div v-if="adminMembers.length > 0">
                        <h3 class="font-bold text-gray-700 dark:text-gray-300 mb-3 ml-1">{{ $t('Administrator') }}</h3>
                        <UCard>
                            <div class="space-y-4">
                                <div v-for="member in adminMembers" :key="member.id"
                                    @click="navigateToProfile(member.user.id)"
                                    class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                                    <div class="flex items-center gap-3">
                                        <img v-if="member.user && member.user.avatar" :src="member.user.avatar"
                                            alt="Member" class="w-12 h-12 rounded-full" />
                                        <div v-else
                                            class="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                            <UIcon name="i-heroicons-user" class="w-6 h-6 text-gray-500" />
                                        </div>
                                        <div>
                                            <p class="font-semibold">{{ member.user?.display_name || '' }}</p>
                                            <p class="text-xs text-gray-500">{{ formatDate(member.created_at) }}</p>
                                        </div>
                                    </div>
                                    <UBadge color="orange">{{ $t('Admin') }}</UBadge>
                                </div>
                            </div>
                        </UCard>
                    </div>

                    <!-- Regular Members Section -->
                    <div>
                        <h3 class="font-bold text-gray-700 dark:text-gray-300 mb-3 ml-1">{{ $t('Members') }}</h3>
                        <UCard>
                            <div class="space-y-4">
                                <template v-if="regularMembers.length > 0">
                                    <div v-for="member in regularMembers" :key="member.id"
                                        @click="navigateToProfile(member.user.id)"
                                        class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                                        <div class="flex items-center gap-3">
                                            <img v-if="member.user && member.user.avatar" :src="member.user.avatar"
                                                alt="Member" class="w-12 h-12 rounded-full" />
                                            <div v-else
                                                class="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                                <UIcon name="i-heroicons-user" class="w-6 h-6 text-gray-500" />
                                            </div>
                                            <div>
                                                <p class="font-semibold">{{ member.user?.display_name || '' }}</p>
                                                <p class="text-xs text-gray-500">{{ formatDate(member.created_at) }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <div v-else class="text-center py-4 text-gray-500">
                                    {{ $t('No members found') }}
                                </div>
                            </div>
                        </UCard>
                    </div>
                </div>
            </div>

        </div>

        <!-- Right Sidebar (3 cols) -->
        <!-- <div class="col-span-12 lg:col-span-3 space-y-4">
            <SocialBirthdayWidget />
            <SocialDailyInspiration />
            <SocialTodayEvents />
            <SocialUpcomingEvents />
            <SocialSystemNotifications />
        </div> -->

        <!-- Modals -->
        <ModalOpenPost />
        <ModalOpenPostFullscreen />
        <ModalCreatePost @postCreated="handlePostCreated" />
        <ModalPostReactions />
        <ModalPollVoters />
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useModalStore } from '@/stores/modal'

const { t } = useI18n()
const route = useRoute()
const groupId = route.params.id

const modalStore = useModalStore()
const { setSocialCreatePostModal } = modalStore

definePageMeta({
    title: 'Group Detail'
})

const activeTab = ref('feed')
const joining = ref(false)
const reload = ref(0) // Dependency for refreshing data

// Fetch group details with counts
const group = computedAsync(async () => {
    // Access reload.value to track dependency
    const _ = reload.value
    const { data } = await useAPI().get(`social/groups/${groupId}/`)
    return data.value || {}
})

// Fetch posts using dedicated endpoint  
const posts = computedAsync(async () => {
    const _ = reload.value
    const { data } = await useAPI().get(`social/groups/${groupId}/posts/`)
    return data.value || []
})

// Fetch important posts (announcements) using dedicated endpoint
const importantPosts = computedAsync(async () => {
    const _ = reload.value
    const { data } = await useAPI().get(`social/groups/${groupId}/importants/`)
    return data.value || []
})

// Fetch members using dedicated endpoint
const members = computedAsync(async () => {
    // Access reload.value to track dependency
    const _ = reload.value
    const { data } = await useAPI().get(`social/groups/${groupId}/members/`)
    return data.value || []
})

// Get current user
const { data: currentUser } = useAuth()

// Check if current user is a member
const isMember = computed(() => {
    if (!currentUser.value?.id || !members.value) return false
    return members.value.some(m => m.user?.id === currentUser.value.id)
})

const adminMembers = computed(() => {
    if (!members.value) return []
    return members.value.filter(m => m.role === 1)
})

const regularMembers = computed(() => {
    if (!members.value) return []
    return members.value.filter(m => m.role !== 1)
})

const tabs = [
    { key: 'feed', label: t('Feed') },
    { key: 'importants', label: t('Importants') },
    { key: 'members', label: t('Members') }
]

const joinGroup = async () => {
    try {
        joining.value = true
        await useAPI().post(`social/groups/${groupId}/join/`)

        useToast().add({
            title: t('Success'),
            description: t('Joined group successfully'),
            color: 'green'
        })

        // Trigger refresh of group (for counts) and members list
        reload.value++
    } catch (error) {
        console.error('Error joining group:', error)
        useToast().add({
            title: t('Error'),
            description: t('Failed to join group'),
            color: 'red'
        })
    } finally {
        joining.value = false
    }
}

const openCreatePostModal = () => {
    setSocialCreatePostModal(true, 1, groupId)
}

const handlePostCreated = () => {
    // Refresh posts list
    reload.value++
}

const handlePostDeleted = (postId) => {
    // Refresh all post lists (regular posts and important posts)
    reload.value++
}

const navigateToProfile = (userId) => {
    navigateTo(`/social/wall/${userId}`)
}

const formatDate = (date) => {
    return dayjs(date).format('MMM D, YYYY HH:mm')
}
</script>
