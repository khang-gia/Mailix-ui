<template>
    <div class="grid grid-cols-12 gap-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <!-- Left Sidebar (3 cols) -->
        <div class="col-span-12 lg:col-span-3">
            <SocialSidebar :user="userInfo" current-page="groups" />
        </div>

        <!-- Center Content (9 cols) -->
        <SocialGroupDetail :group-id="groupId" />

        <!-- Modals are handled inside SocialGroupDetail or globally -->
    </div>
</template>

<script setup>
const route = useRoute()
const groupId = route.params.id
const { data: userInfo } = useAuth()

definePageMeta({
    title: 'Social'
})
</script>
