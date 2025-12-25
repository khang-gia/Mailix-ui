<template>
    <div v-if="currentPage === 'news'" class="col-span-12 lg:col-span-6 space-y-6">
        <SocialCreatePost />

        <SocialFeedFilter />

        <div class="space-y-4">
            <SocialPostItem v-for="post in posts" :key="post.id" :post="post" @postDeleted="handlePostDeleted"/>
        </div>
        <ModalOpenPost/>
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
const posts = computedAsync(async () => {
    const { data: data } = await useAPI().get('social/posts/', {
        page: page.value,
        page_size: pageSize.value,
    })
    return data.value.results
})

const handlePostDeleted = (postId) => {
    posts.value = posts.value.filter(post => post.id !== postId)
}
</script>