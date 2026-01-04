<template>
    <div class="grid grid-cols-12 gap-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <!-- Left Sidebar (3 cols) -->
        <div class="col-span-12 lg:col-span-3">
            <SocialSidebar :user="userInfo" :current-page="currentPage" @update:page="currentPage = $event" />
        </div>

        <!-- Center Feed (6 cols) -->
        <!-- <div class="col-span-12 lg:col-span-6 space-y-6">
            <SocialCreatePost />

            <SocialFeedFilter />

            <div class="space-y-4">
                <SocialPostItem v-for="post in posts" :key="post.id" :post="post" :current-user="userInfo" />
            </div>
        </div> -->
        <SocialCenterPage :current-page="currentPage" />
        <!-- Right Sidebar (3 cols) -->
        <div class="col-span-12 lg:col-span-3 space-y-4">
            <SocialBirthdayWidget />
            <SocialDailyInspiration />
            <SocialTodayEvents />
            <SocialUpcomingEvents />
            <SocialSystemNotifications />
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Social'
})

const { data: userInfo } = useAuth()
const currentPage = ref('news')
// Mock data for posts
const posts = ref([
    {
        id: 1,
        author: {
            name: 'Lê Việt Thắng (TGĐ)',
            avatar: 'https://i.pravatar.cc/150?u=ceo'
        },
        target: 'tường công ty',
        time: '13:22 11/12/2025',
        title: 'Đăng ký xuất ăn',
        content: '111111',
        poll: {
            endsAt: '14:00, 11/12/2025',
            options: [
                { id: 1, label: 'Bún bò', voted: false, percent: 0 },
                { id: 2, label: 'Cơm sườn', voted: true, percent: 100 }
            ]
        }
    }
])
</script>
